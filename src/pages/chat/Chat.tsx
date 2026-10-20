import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Bot, LoaderCircle, Plus, Send, Settings2, Trash2 } from "lucide-react";
import axios from "axios";
import { chatApi, apiError, formatCredits, readChatIndex, saveChatIndex, sessionUser } from "../../lib/chat";
import type { ChatModelChoice, ChatTurn, CreditAllowance, CreditWindow, SavedChat } from "../../models/chat";
import { Button } from "../../components/ui/button";
import ChatCharts from "./ChatCharts";

function CreditMeter({ label, window }: { label: string; window: CreditWindow }) {
  const consumed = window.limit > 0 ? Math.min(100, (window.used + window.reserved) / window.limit * 100) : 100;
  return <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-3">
    <div className="flex items-center justify-between gap-2 text-xs text-gray-500"><span>{label}</span><span title={new Date(window.resetsAtUtc).toLocaleString()}>Resets {new Date(window.resetsAtUtc).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span></div>
    <p className="mt-1 text-sm font-semibold tabular-nums">{formatCredits(window.remaining)} <span className="font-normal text-gray-500">/ {formatCredits(window.limit)} credits left</span></p>
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100" role="meter" aria-label={`${label} credits used or reserved`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={consumed}><div className={`h-full ${consumed >= 95 ? "bg-red-500" : "bg-yellow-500"}`} style={{ width: `${consumed}%` }} /></div>
    {window.reserved > 0 && <p className="mt-1 text-xs text-gray-500">{formatCredits(window.reserved)} credits reserved</p>}
  </div>;
}

export default function Chat() {
  const user = sessionUser();
  const userId = user?.id ?? "";
  const [models, setModels] = useState<ChatModelChoice[]>([]);
  const [credits, setCredits] = useState<CreditAllowance | null>(null);
  const [modelId, setModelId] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chats, setChats] = useState<SavedChat[]>(() => userId ? readChatIndex(userId) : []);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const sending = useRef(false);
  const requestAbort = useRef<AbortController | null>(null);
  const historyAbort = useRef<AbortController | null>(null);
  const scrollEnd = useRef<HTMLDivElement>(null);
  const loadSetup = useCallback(async (signal?: AbortSignal) => {
    setInitialLoading(true);
    try {
      const [available, allowance] = await Promise.all([chatApi.models(signal), chatApi.allowance(signal)]);
      setModels(available); setCredits(allowance); setError("");
      setModelId(current => current && !available.some(item => item.id === current) ? "" : current);
    } catch (failure) { if (!axios.isCancel(failure)) setError(apiError(failure, "Chat is unavailable. Please try loading it again.")); }
    finally { if (!signal?.aborted) setInitialLoading(false); }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) return;
    const controller = new AbortController();
    void loadSetup(controller.signal);
    return () => { controller.abort(); requestAbort.current?.abort(); historyAbort.current?.abort(); };
  }, [loadSetup]);
  useEffect(() => { scrollEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [turns, pendingQuestion]);

  if (!localStorage.getItem("accessToken")) return <Navigate to="/login" replace />;
  const busy = pendingQuestion !== null || historyLoading || deleting;
  const exhausted = credits !== null && (credits.daily.remaining <= 0 || credits.monthly.remaining <= 0);
  const remember = (items: SavedChat[]) => { setChats(items); if (userId) saveChatIndex(userId, items); };
  const newChat = () => { if (sending.current) return; historyAbort.current?.abort(); setHistoryLoading(false); setConversationId(null); setTurns([]); setError(""); setDraft(""); setDeleteConfirm(false); };

  async function openChat(id: string) {
    if (sending.current) return;
    historyAbort.current?.abort();
    const controller = new AbortController(); historyAbort.current = controller;
    setHistoryLoading(true); setError(""); setDeleteConfirm(false);
    try {
      const saved = await chatApi.conversation(id, controller.signal);
      setConversationId(saved.id); setTurns(saved.turns); setDraft("");
    } catch (failure) {
      if (!axios.isCancel(failure)) {
        setError(apiError(failure, "This conversation is unavailable or has expired."));
        if (axios.isAxiosError(failure) && failure.response?.status === 404) remember(chats.filter(item => item.id !== id));
      }
    } finally { if (!controller.signal.aborted) setHistoryLoading(false); }
  }

  async function send() {
    const question = draft.trim();
    if (!question || question.length > 2000 || sending.current || busy || initialLoading || !credits || !models.length || exhausted) return;
    sending.current = true; setPendingQuestion(question); setError("");
    const controller = new AbortController(); requestAbort.current = controller;
    try {
      const response = await chatApi.send(question, conversationId, modelId || null, controller.signal);
      setConversationId(response.conversationId);
      setTurns(current => [...current, { question, response, createdAtUtc: new Date().toISOString() }]);
      if (response.credits) setCredits(response.credits);
      remember([{ id: response.conversationId, updatedAt: new Date().toISOString() }, ...chats.filter(item => item.id !== response.conversationId)].slice(0, 20));
      setDraft("");
    } catch (failure) {
      if (!axios.isCancel(failure)) {
        setError(apiError(failure));
        // Failed calls may still incur usage. Refresh once; never automatically resubmit.
        try { setCredits(await chatApi.allowance()); } catch { /* Keep last known allowance. */ }
      }
    } finally { sending.current = false; setPendingQuestion(null); }
  }

  async function deleteChat() {
    if (!conversationId || sending.current) return;
    setDeleting(true); setError("");
    try { await chatApi.delete(conversationId); remember(chats.filter(item => item.id !== conversationId)); newChat(); }
    catch (failure) { setError(apiError(failure, "Could not delete the conversation.")); }
    finally { setDeleting(false); setDeleteConfirm(false); }
  }

  return <main className="min-h-screen bg-gray-50 text-gray-900">
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center gap-3"><Link to="/" aria-label="Back to cashbooks" className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft size={20} /></Link><div className="rounded-xl bg-yellow-100 p-2 text-yellow-700"><Bot size={22} /></div><div className="flex-1"><h1 className="font-semibold">Kashly assistant</h1><p className="text-xs text-gray-500">Insights from your own recorded finances</p></div>{user?.roles.includes("SuperUser") && <Link to="/admin/ai" className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs"><Settings2 size={15} />Manage AI</Link>}</div>
    </header>
    <div className="mx-auto grid max-w-7xl gap-5 p-4 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <Button onClick={newChat} disabled={busy} className="w-full bg-yellow-500 text-gray-950 hover:bg-yellow-400"><Plus size={16} />New conversation</Button>
        <div className="rounded-xl border border-gray-200 bg-white p-3"><label htmlFor="chat-model" className="text-xs font-semibold text-gray-600">Model</label><select id="chat-model" value={modelId} onChange={event => setModelId(event.target.value)} disabled={busy || initialLoading} className="mt-2 w-full rounded-lg border border-gray-200 bg-white p-2 text-sm"><option value="">Tier default{models.find(item => item.isDefault) ? ` · ${models.find(item => item.isDefault)?.name}` : ""}</option>{models.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><p className="mt-2 text-xs text-gray-500">Available models depend on your tier.</p></div>
        <section aria-label="Recent conversations" className="rounded-xl border border-gray-200 bg-white p-3"><h2 className="text-xs font-semibold text-gray-600">Recent on this browser</h2><div className="mt-2 max-h-60 space-y-1 overflow-auto">{chats.length ? chats.map(item => <button key={item.id} disabled={busy} onClick={() => void openChat(item.id)} className={`block w-full rounded-lg px-2 py-2 text-left text-xs disabled:opacity-50 ${item.id === conversationId ? "bg-yellow-50 text-yellow-800" : "text-gray-600 hover:bg-gray-50"}`}>{new Date(item.updatedAt).toLocaleString()}</button>) : <p className="py-3 text-xs text-gray-400">Your conversations will appear here.</p>}</div></section>
        <p className="text-xs leading-relaxed text-gray-500">Charts and totals use your recorded data. Missing entries can affect conclusions. Suggestions are scenarios, not predictions.</p>
      </aside>
      <section className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-3" aria-label="Credit allowance">{credits ? <><CreditMeter label={`${credits.tier} · Daily`} window={credits.daily} /><CreditMeter label="Monthly" window={credits.monthly} /></> : <div className="rounded-xl border bg-white p-4 text-sm text-gray-500">{initialLoading ? "Loading your credit allowance…" : "Credit allowance unavailable."}</div>}</div>
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"><p>{error}</p>{!busy && <button className="mt-2 font-semibold underline" onClick={() => void loadSetup()}>Refresh availability</button>}</div>}
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3"><h2 className="text-sm font-medium">{conversationId ? "Conversation" : "Ask about your money"}</h2>{conversationId && <button aria-label="Delete conversation" disabled={busy} onClick={() => setDeleteConfirm(true)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>}</div>
          {deleteConfirm && <div role="alert" className="m-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm"><p>Delete this conversation and its saved history? This does not restore used credits.</p><div className="mt-2 flex gap-2"><Button size="sm" variant="destructive" disabled={deleting} onClick={() => void deleteChat()}>Delete history</Button><Button size="sm" variant="outline" onClick={() => setDeleteConfirm(false)}>Cancel</Button></div></div>}
          <div className="min-h-72 space-y-6 p-4" role="log" aria-label="Chat messages" aria-live="polite" aria-busy={busy}>
            {historyLoading ? <p className="flex items-center gap-2 text-sm text-gray-500"><LoaderCircle size={16} className="animate-spin" />Loading conversation…</p> : turns.length === 0 && !pendingQuestion && <div className="py-8 text-center"><Bot className="mx-auto mb-3 text-yellow-600" size={32} /><h3 className="font-medium">Understand where your money goes</h3><p className="mt-2 text-sm text-gray-500">Choose a question or write your own.</p><div className="mx-auto mt-5 grid max-w-lg gap-2 sm:grid-cols-2">{["Show my spending by category this month", "Compare my spending with last month", "Show my daily spending trend", "ممكن نصيحة أوفر بيها بناء على بياناتي؟"].map(question => <button key={question} onClick={() => setDraft(question)} className="rounded-xl border border-gray-200 p-3 text-left text-xs hover:border-yellow-400 hover:bg-yellow-50" dir="auto">{question}</button>)}</div></div>}
            {!historyLoading && turns.map((turn, index) => <article key={`${turn.createdAtUtc}-${index}`} className="space-y-3">
              <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-yellow-100 px-4 py-3 text-sm" dir="auto">{turn.question}</div>
              <div className="space-y-4 rounded-2xl rounded-tl-sm bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed" dir="auto">{turn.response.answer}</p>
                {turn.response.needsClarification && <p className="text-xs font-medium text-yellow-800">Reply below to clarify your request.</p>}
                {turn.response.data && <>
                  <div className="text-xs text-gray-500">{turn.response.data.query.analysis === "balances" ? "Current stored balances" : `${turn.response.data.query.from} — ${turn.response.data.query.to}`}{turn.response.data.query.compareFrom && ` · Compared with ${turn.response.data.query.compareFrom} — ${turn.response.data.query.compareTo}`}{turn.response.data.currency && ` · ${turn.response.data.currency}`}</div>
                  <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">{turn.response.data.metrics.map(metric => <div key={metric.id} className="rounded-lg border border-gray-200 bg-white p-3"><p className="text-xs text-gray-500" dir="auto">{metric.label}</p><p className="mt-1 break-words text-sm font-semibold tabular-nums">{metric.value === null ? "Not available" : new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(metric.value)}{metric.value !== null && (metric.unit === "percent" ? "%" : metric.unit === "money" && turn.response.data?.currency ? ` ${turn.response.data.currency}` : "")}</p></div>)}</div>
                  {turn.response.data.charts.map((chart, chartIndex) => <ChatCharts key={chartIndex} chart={chart} currency={turn.response.data?.currency ?? ""} />)}
                  {turn.response.data.entries.length > 0 && <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white"><table className="w-full text-left text-xs"><thead><tr><th className="p-2">Date</th><th className="p-2">Entry</th><th className="p-2">Type</th><th className="p-2 text-right">Amount</th></tr></thead><tbody>{turn.response.data.entries.map(entry => <tr key={entry.id} className="border-t border-gray-100"><td className="whitespace-nowrap p-2">{new Date(entry.date).toLocaleDateString()}</td><td className="p-2" dir="auto">{entry.name || "Unnamed entry"}</td><td className="p-2">{entry.direction}</td><td className="p-2 text-right tabular-nums">{entry.amount.toLocaleString()}</td></tr>)}</tbody></table></div>}
                  {turn.response.data.suggestions.length > 0 && <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3"><h3 className="mb-2 text-xs font-semibold text-yellow-900">Suggestions from this analysis</h3><ul className="list-inside list-disc space-y-1 text-xs text-yellow-900">{turn.response.data.suggestions.map((item, suggestionIndex) => <li key={suggestionIndex} dir="auto">{item.text}</li>)}</ul></div>}
                  <details className="text-xs text-gray-500"><summary className="cursor-pointer font-medium">Sources and limitations</summary><ul className="mt-2 list-inside list-disc space-y-1">{turn.response.data.limitations.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>{turn.response.data.evidence.map(item => <p key={item.id} className="mt-2">{item.description} Retrieved {new Date(item.retrievedAtUtc).toLocaleString()}.</p>)}</details>
                </>}
              </div>
            </article>)}
            {pendingQuestion && <><div className="ml-auto max-w-[90%] rounded-2xl bg-yellow-100 px-4 py-3 text-sm" dir="auto">{pendingQuestion}</div><p className="flex items-center gap-2 text-sm text-gray-500"><LoaderCircle size={16} className="animate-spin" />Analyzing your records…</p></>}
            <div ref={scrollEnd} />
          </div>
          <form onSubmit={event => { event.preventDefault(); void send(); }} className="border-t border-gray-100 p-4">
            {exhausted && <p className="mb-2 text-sm text-red-700">Your daily or monthly credits are used up. You can still read previous conversations.</p>}
            {!initialLoading && !models.length && <p className="mb-2 text-sm text-gray-500">No models are available for your tier.</p>}
            <label htmlFor="chat-question" className="sr-only">Ask about your financial data</label><textarea id="chat-question" dir="auto" rows={3} maxLength={2000} value={draft} onChange={event => setDraft(event.target.value)} disabled={busy} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); } }} placeholder="Ask about your spending, income, or cashbooks…" className="w-full resize-y rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-yellow-500 disabled:bg-gray-50" />
            <div className="mt-2 flex items-center justify-between gap-3"><p className="text-xs text-gray-400">{draft.length}/2000 · Enter to send · Shift+Enter for a new line</p><Button type="submit" disabled={busy || initialLoading || !credits || exhausted || !models.length || !draft.trim()} className="bg-yellow-500 text-gray-950 hover:bg-yellow-400"><Send size={15} />Send</Button></div>
          </form>
        </div>
      </section>
    </div>
  </main>;
}
