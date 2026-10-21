import { useCallback, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Plus, RefreshCw, Settings2 } from "lucide-react";
import axios from "axios";
import instance from "../../instance";
import { apiError, chatRequestOptions, formatCredits, sessionUser } from "../../lib/chat";
import type { ChatSettings, ManagedModel, ManagedTier, UsageRecord } from "../../models/chat";
import { Button } from "../../components/ui/button";

const fieldClass = "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-yellow-500 disabled:bg-gray-100";
const panelClass = "rounded-2xl border border-gray-200 bg-white p-4 sm:p-5";
type ModelForm = Omit<ManagedModel, "id" | "disabledReason">;
type TierForm = Omit<ManagedTier["tier"], "id"> & { allowedModelIds: string[] };
const emptyModel = (): ModelForm => ({ name: "", providerName: "OpenAI", providerKey: "iti", invocationId: "", isEnabled: true, maxInputTokens: 16384, maxOutputTokens: 1024 });
const emptyTier = (): TierForm => ({ name: "", description: "", isEnabled: true, dailyTokenLimit: 20000, monthlyTokenLimit: 100000, defaultModelId: "", allowedModelIds: [] });
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-xs font-medium text-gray-600">{label}{children}</label>; }

export default function ChatAdmin() {
  const user = sessionUser();
  const allowed = user?.roles.includes("SuperUser") ?? false;
  const [tab, setTab] = useState<"models" | "tiers" | "settings" | "usage">("models");
  const [models, setModels] = useState<ManagedModel[]>([]);
  const [tiers, setTiers] = useState<ManagedTier[]>([]);
  const [providers, setProviders] = useState<{ key: string; adapter: string }[]>([]);
  const [settings, setSettings] = useState<ChatSettings>({ defaultTierId: "", tokensPerCredit: 1000 });
  const [settingsDraft, setSettingsDraft] = useState<ChatSettings>({ defaultTierId: "", tokensPerCredit: 1000 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modelForm, setModelForm] = useState<ModelForm>(emptyModel);
  const [modelId, setModelId] = useState<string | null>(null);
  const [tierForm, setTierForm] = useState<TierForm>(emptyTier);
  const [tierId, setTierId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [assignmentTier, setAssignmentTier] = useState("");
  const [assignmentExpiry, setAssignmentExpiry] = useState("");
  const [userSummary, setUserSummary] = useState<string | null>(null);
  const [usageFilter, setUsageFilter] = useState("");
  const [usagePage, setUsagePage] = useState(1);
  const [usage, setUsage] = useState<{ total: number; items: UsageRecord[] }>({ total: 0, items: [] });
  const [usageLoading, setUsageLoading] = useState(false);
  const [reconcileId, setReconcileId] = useState<string | null>(null);
  const [reconcileInput, setReconcileInput] = useState("");
  const [reconcileOutput, setReconcileOutput] = useState("");
  const [reason, setReason] = useState("");

  const reload = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const config = { ...chatRequestOptions, signal };
      const [modelResponse, tierResponse, settingsResponse, providerResponse] = await Promise.all([
        instance.get<ManagedModel[]>("/api/admin/chat/models", config),
        instance.get<ManagedTier[]>("/api/admin/chat/tiers", config),
        instance.get<ChatSettings>("/api/admin/chat/settings", config),
        instance.get<{ key: string; adapter: string }[]>("/api/admin/chat/providers", config),
      ]);
      setModels(modelResponse.data); setTiers(tierResponse.data); setSettings(settingsResponse.data);
      setSettingsDraft(settingsResponse.data); setProviders(providerResponse.data);
    } catch (failure) { if (!axios.isCancel(failure)) setError(apiError(failure, "Could not load AI configuration.")); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, []);
  useEffect(() => { if (!allowed) return; const controller = new AbortController(); void reload(controller.signal); return () => controller.abort(); }, [allowed, reload]);

  async function loadUsage(page = 1, filter = usageFilter) {
    setUsageLoading(true); setError("");
    try {
      const result = await instance.get<{ total: number; items: UsageRecord[] }>("/api/admin/chat/usage", { ...chatRequestOptions, params: { page, pageSize: 25, userId: filter.trim() || undefined } });
      setUsage(result.data); setUsagePage(page);
    } catch (failure) { setError(apiError(failure, "Could not load usage records.")); }
    finally { setUsageLoading(false); }
  }
  async function mutate(action: () => Promise<unknown>, success: string) {
    if (saving) return;
    setSaving(true); setError(""); setNotice("");
    try { await action(); setNotice(success); await reload(); }
    catch (failure) { setError(apiError(failure)); }
    finally { setSaving(false); }
  }
  async function saveModel(event: FormEvent) {
    event.preventDefault();
    await mutate(async () => {
      if (modelId) await instance.put(`/api/admin/chat/models/${modelId}`, modelForm, chatRequestOptions);
      else await instance.post("/api/admin/chat/models", modelForm, chatRequestOptions);
      setModelId(null); setModelForm(emptyModel());
    }, "Model saved. New requests use the updated configuration.");
  }
  async function saveTier(event: FormEvent) {
    event.preventDefault();
    await mutate(async () => {
      if (tierId) await instance.put(`/api/admin/chat/tiers/${tierId}`, tierForm, chatRequestOptions);
      else await instance.post("/api/admin/chat/tiers", tierForm, chatRequestOptions);
      setTierId(null); setTierForm(emptyTier());
    }, "Tier saved. Existing token usage is retained.");
  }
  async function inspectUser() {
    if (!userId.trim()) return;
    setSaving(true); setError(""); setUserSummary(null);
    try {
      const result = await instance.get<{ assignment: { tierId: string; expiresAtUtc: string | null } | null; usage: { period: string; usedTokens: number; reservedTokens: number }[] }>(`/api/admin/chat/users/${encodeURIComponent(userId.trim())}`, chatRequestOptions);
      const assignment = result.data.assignment;
      setAssignmentTier(assignment?.tierId ?? settings.defaultTierId);
      if (assignment?.expiresAtUtc) {
        const date = new Date(assignment.expiresAtUtc);
        setAssignmentExpiry(new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
      } else setAssignmentExpiry("");
      setUserSummary(`${assignment ? "Explicit tier assignment" : "Uses the default tier"}. ${result.data.usage.map(item => `${item.period}: ${item.usedTokens.toLocaleString()} used / ${item.reservedTokens.toLocaleString()} reserved tokens`).join(". ")}`);
    } catch (failure) { setError(apiError(failure, "Could not inspect this account.")); }
    finally { setSaving(false); }
  }

  if (!localStorage.getItem("accessToken")) return <Navigate to="/login" replace />;
  if (!allowed) return <Navigate to="/chat" replace />;
  const blocked = saving || loading;
  const creditLabel = (tokens: number) => formatCredits(tokens / settings.tokensPerCredit);
  return <main className="min-h-screen bg-gray-50 text-gray-900">
    <header className="border-b border-gray-200 bg-white px-4 py-4"><div className="mx-auto flex max-w-6xl items-center gap-3"><Link to="/chat" aria-label="Back to chat" className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft size={20} /></Link><Settings2 className="text-yellow-600" size={24} /><div className="flex-1"><h1 className="font-semibold">AI management</h1><p className="text-xs text-gray-500">Models, tiers, credit allowances, and usage</p></div><Button variant="outline" disabled={blocked} onClick={() => { setError(""); void reload(); }}><RefreshCw size={15} />Refresh</Button></div></header>
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <nav aria-label="AI management sections" className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1">{(["models", "tiers", "settings", "usage"] as const).map(item => <button key={item} onClick={() => { setTab(item); setNotice(""); if (item === "usage") void loadUsage(); }} className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium capitalize ${tab === item ? "bg-yellow-100 text-yellow-900" : "text-gray-500 hover:bg-gray-50"}`}>{item === "usage" ? "Users & usage" : item}</button>)}</nav>
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      {notice && <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</div>}
      {loading && <p role="status" className="text-sm text-gray-500">Loading AI configuration…</p>}
      {tab === "models" && <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className={panelClass}><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Registered models</h2><Button variant="outline" size="sm" disabled={blocked} onClick={() => { setModelId(null); setModelForm(emptyModel()); }}><Plus size={14} />New model</Button></div><p className="mb-4 text-xs text-gray-500">All portal providers share the same integration. Register their invocation IDs here; credentials stay on the server.</p>
          <div className="space-y-3">{models.map(model => <article key={model.id} className="rounded-xl border border-gray-200 p-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-sm font-semibold">{model.name} <span className={`ml-1 text-xs font-normal ${model.isEnabled ? "text-green-700" : "text-gray-500"}`}>{model.isEnabled ? "Enabled" : "Disabled"}</span></h3><p className="mt-1 text-xs text-gray-500">{model.providerName} · {model.providerKey}</p><p className="mt-1 break-all font-mono text-xs text-gray-500">{model.invocationId}</p></div><button disabled={blocked} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50" onClick={() => { setModelId(model.id); setModelForm({ name: model.name, providerName: model.providerName, providerKey: model.providerKey, invocationId: model.invocationId, isEnabled: model.isEnabled, maxInputTokens: model.maxInputTokens, maxOutputTokens: model.maxOutputTokens }); }}>Edit</button></div><p className="mt-2 text-xs text-gray-500">Input cap {model.maxInputTokens.toLocaleString()} · Output cap {model.maxOutputTokens.toLocaleString()} tokens per call</p>{model.disabledReason && <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-800">{model.disabledReason}</p>}</article>)}{!loading && !models.length && <p className="text-sm text-gray-500">Register a model to get started.</p>}</div>
        </section>
        <form onSubmit={event => void saveModel(event)} className={`${panelClass} space-y-4`}><h2 className="font-semibold">{modelId ? "Edit model" : "Register model"}</h2>
          <Field label="Display name"><input required maxLength={100} className={fieldClass} value={modelForm.name} onChange={event => setModelForm({ ...modelForm, name: event.target.value })} /></Field>
          <Field label="Provider name"><input required maxLength={100} className={fieldClass} value={modelForm.providerName} onChange={event => setModelForm({ ...modelForm, providerName: event.target.value })} /></Field>
          <Field label="Server integration"><select required className={fieldClass} value={modelForm.providerKey} onChange={event => setModelForm({ ...modelForm, providerKey: event.target.value })}>{providers.map(item => <option key={item.key} value={item.key}>{item.key}</option>)}</select></Field>
          <Field label="Portal invocation ID"><input required maxLength={500} className={`${fieldClass} font-mono`} value={modelForm.invocationId} onChange={event => setModelForm({ ...modelForm, invocationId: event.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="Max input tokens"><input type="number" required min={256} max={1000000} step={1} className={fieldClass} value={modelForm.maxInputTokens} onChange={event => setModelForm({ ...modelForm, maxInputTokens: Number(event.target.value) })} /></Field><Field label="Max output tokens"><input type="number" required min={64} max={16000} step={1} className={fieldClass} value={modelForm.maxOutputTokens} onChange={event => setModelForm({ ...modelForm, maxOutputTokens: Number(event.target.value) })} /></Field></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={modelForm.isEnabled} onChange={event => setModelForm({ ...modelForm, isEnabled: event.target.checked })} />Enabled</label>
          <p className="text-xs text-gray-500">Re-enabling a suspended model should follow verification of the portal's usage caps. Registration does not make a live model call.</p>
          <Button disabled={blocked || !providers.length} type="submit" className="bg-yellow-500 text-gray-950 hover:bg-yellow-400">{saving ? "Saving…" : "Save model"}</Button>
        </form>
      </div>}
      {tab === "tiers" && <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className={panelClass}><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">User tiers</h2><Button size="sm" variant="outline" disabled={blocked} onClick={() => { setTierId(null); setTierForm(emptyTier()); }}><Plus size={14} />New tier</Button></div><div className="space-y-3">{tiers.map(({ tier, allowedModelIds }) => <article key={tier.id} className="rounded-xl border border-gray-200 p-3"><div className="flex justify-between gap-3"><h3 className="text-sm font-semibold">{tier.name}{tier.id === settings.defaultTierId && <span className="ml-2 rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-900">Default</span>}</h3><button disabled={blocked} className="rounded-lg border px-3 py-1.5 text-xs" onClick={() => { setTierId(tier.id); setTierForm({ name: tier.name, description: tier.description, isEnabled: tier.isEnabled, dailyTokenLimit: tier.dailyTokenLimit, monthlyTokenLimit: tier.monthlyTokenLimit, defaultModelId: tier.defaultModelId, allowedModelIds }); }}>Edit</button></div><p className="mt-2 text-xs text-gray-500">{tier.description}</p><p className="mt-3 text-sm">{creditLabel(tier.dailyTokenLimit)} daily / {creditLabel(tier.monthlyTokenLimit)} monthly credits</p><p className="mt-1 text-xs text-gray-500">{tier.dailyTokenLimit.toLocaleString()} / {tier.monthlyTokenLimit.toLocaleString()} tokens · {tier.isEnabled ? "Enabled" : "Disabled"}</p><p className="mt-2 text-xs text-gray-500">Default model: {models.find(model => model.id === tier.defaultModelId)?.name ?? "Unavailable"} · {allowedModelIds.length} allowed</p></article>)}</div></section>
        <form onSubmit={event => void saveTier(event)} className={`${panelClass} space-y-4`}><h2 className="font-semibold">{tierId ? "Edit tier" : "Create tier"}</h2>
          <Field label="Tier name"><input required maxLength={100} className={fieldClass} value={tierForm.name} onChange={event => setTierForm({ ...tierForm, name: event.target.value })} /></Field>
          <Field label="Description"><textarea maxLength={1000} rows={2} className={fieldClass} value={tierForm.description} onChange={event => setTierForm({ ...tierForm, description: event.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="Daily token limit"><input type="number" required min={0} max={1000000000} step={1} className={fieldClass} value={tierForm.dailyTokenLimit} onChange={event => setTierForm({ ...tierForm, dailyTokenLimit: Number(event.target.value) })} /></Field><Field label="Monthly token limit"><input type="number" required min={0} max={1000000000} step={1} className={fieldClass} value={tierForm.monthlyTokenLimit} onChange={event => setTierForm({ ...tierForm, monthlyTokenLimit: Number(event.target.value) })} /></Field></div>
          <p className="text-xs text-gray-500">Users see {creditLabel(tierForm.dailyTokenLimit)} daily and {creditLabel(tierForm.monthlyTokenLimit)} monthly credits. Both limits apply; zero blocks chat. Changing tiers does not reset usage.</p>
          <fieldset className="space-y-2 rounded-lg border p-3"><legend className="px-1 text-xs font-medium text-gray-600">Allowed models</legend>{models.map(model => <label key={model.id} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={tierForm.allowedModelIds.includes(model.id)} onChange={event => { const ids = event.target.checked ? [...tierForm.allowedModelIds, model.id] : tierForm.allowedModelIds.filter(id => id !== model.id); setTierForm({ ...tierForm, allowedModelIds: ids, defaultModelId: ids.includes(tierForm.defaultModelId) ? tierForm.defaultModelId : ids[0] ?? "" }); }} />{model.name}{!model.isEnabled && " (disabled)"}</label>)}</fieldset>
          <Field label="Default model"><select required className={fieldClass} value={tierForm.defaultModelId} onChange={event => setTierForm({ ...tierForm, defaultModelId: event.target.value })}><option value="">Choose an allowed model</option>{models.filter(model => tierForm.allowedModelIds.includes(model.id)).map(model => <option key={model.id} value={model.id}>{model.name}{!model.isEnabled && " (disabled)"}</option>)}</select></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={tierForm.isEnabled} onChange={event => setTierForm({ ...tierForm, isEnabled: event.target.checked })} />Enabled</label>
          <Button disabled={blocked || !tierForm.allowedModelIds.length} type="submit" className="bg-yellow-500 text-gray-950 hover:bg-yellow-400">{saving ? "Saving…" : "Save tier"}</Button>
        </form>
      </div>}
      {tab === "settings" && <form className={`${panelClass} max-w-2xl space-y-5`} onSubmit={event => { event.preventDefault(); void mutate(() => instance.put("/api/admin/chat/settings", settingsDraft, chatRequestOptions), "Settings saved. Recorded usage and token allowances are unchanged."); }}><h2 className="font-semibold">Credit display and default tier</h2><Field label="Default tier for unassigned or expired users"><select required className={fieldClass} value={settingsDraft.defaultTierId} onChange={event => setSettingsDraft({ ...settingsDraft, defaultTierId: event.target.value })}><option value="">Choose a tier</option>{tiers.filter(item => item.tier.isEnabled).map(({ tier }) => <option key={tier.id} value={tier.id}>{tier.name}</option>)}</select></Field><Field label="Tokens per credit"><input required type="number" min={1} max={1000000} step={1} className={fieldClass} value={settingsDraft.tokensPerCredit} onChange={event => setSettingsDraft({ ...settingsDraft, tokensPerCredit: Number(event.target.value) })} /></Field><p className="text-sm text-gray-500">One credit represents {settingsDraft.tokensPerCredit.toLocaleString()} input/output tokens. This changes the display unit, not users' underlying token limits or recorded usage. Resets follow the server's configured daily and calendar-month boundaries.</p><Button type="submit" disabled={blocked} className="bg-yellow-500 text-gray-950 hover:bg-yellow-400">Save settings</Button></form>}
      {tab === "usage" && <div className="space-y-4">
        <form className={`${panelClass} space-y-4`} onSubmit={event => { event.preventDefault(); void mutate(async () => { await instance.put(`/api/admin/chat/users/${encodeURIComponent(userId.trim())}/tier`, { tierId: assignmentTier, expiresAtUtc: assignmentExpiry ? new Date(assignmentExpiry).toISOString() : null }, chatRequestOptions); setUserSummary("Assignment saved. Existing daily/monthly usage is retained."); }, "User tier updated."); }}><h2 className="font-semibold">User tier assignment</h2><div className="grid gap-3 sm:grid-cols-3"><Field label="User UUID"><input required className={`${fieldClass} font-mono`} value={userId} onChange={event => { setUserId(event.target.value); setUserSummary(null); }} placeholder="Paste the account ID" /></Field><Field label="Tier"><select required className={fieldClass} value={assignmentTier} onChange={event => setAssignmentTier(event.target.value)}><option value="">Choose tier</option>{tiers.filter(item => item.tier.isEnabled).map(({ tier }) => <option key={tier.id} value={tier.id}>{tier.name}</option>)}</select></Field><Field label="Expires at (your local time; optional)"><input type="datetime-local" className={fieldClass} value={assignmentExpiry} onChange={event => setAssignmentExpiry(event.target.value)} /></Field></div>{userSummary && <p className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">{userSummary}</p>}<div className="flex gap-2"><Button type="button" variant="outline" disabled={blocked || !userId.trim()} onClick={() => void inspectUser()}>Inspect user</Button><Button type="submit" disabled={blocked || !userId.trim() || !assignmentTier} className="bg-yellow-500 text-gray-950 hover:bg-yellow-400">Save assignment</Button></div></form>
        <section className={panelClass}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Token usage ledger</h2><form className="flex gap-2" onSubmit={event => { event.preventDefault(); void loadUsage(); }}><input aria-label="Filter usage by user UUID" placeholder="User UUID (optional)" className="min-w-0 rounded-lg border px-3 py-2 text-xs" value={usageFilter} onChange={event => setUsageFilter(event.target.value)} /><Button size="sm" variant="outline" disabled={usageLoading} type="submit">Filter</Button></form></div><p className="mt-2 text-xs text-gray-500">Planning, repairs, and explanation calls are separate records. Uncertain calls reserve credits conservatively until reconciled.</p>
          <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="text-gray-500">{["Time / user", "Model", "Input / output", "Charged / reserved", "Status", ""].map((heading, index) => <th key={index} className="whitespace-nowrap p-2">{heading}</th>)}</tr></thead><tbody>{usage.items.map(record => <tr key={record.id} className="border-t border-gray-100"><td className="p-2"><p className="whitespace-nowrap">{new Date(record.createdAtUtc).toLocaleString()}</p><p className="mt-1 max-w-48 truncate font-mono text-gray-400" title={record.userId}>{record.userId}</p></td><td className="p-2">{models.find(model => model.id === record.modelId)?.name ?? record.modelId}</td><td className="p-2 tabular-nums">{record.inputTokens.toLocaleString()} / {record.outputTokens.toLocaleString()}</td><td className="p-2 tabular-nums">{record.chargedTokens.toLocaleString()} / {record.reservedTokens.toLocaleString()}</td><td className="p-2">{record.status}{record.reconciliationReason && <p className="mt-1 text-gray-500">{record.reconciliationReason}</p>}</td><td className="p-2">{(record.status === "uncertain" || (record.status === "reserved" && Date.now() - Date.parse(record.createdAtUtc) > 600000)) && <button className="rounded border px-2 py-1" onClick={() => { setReconcileId(record.id); setReconcileInput(""); setReconcileOutput(""); setReason(""); }}>Reconcile</button>}</td></tr>)}</tbody></table>{!usageLoading && !usage.items.length && <p className="py-6 text-center text-sm text-gray-500">No usage records match this filter.</p>}{usageLoading && <p role="status" className="py-4 text-sm text-gray-500">Loading usage…</p>}</div><div className="mt-3 flex items-center justify-between text-xs text-gray-500"><span>{usage.total.toLocaleString()} records · Page {usagePage}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={usageLoading || usagePage <= 1} onClick={() => void loadUsage(usagePage - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={usageLoading || usagePage * 25 >= usage.total} onClick={() => void loadUsage(usagePage + 1)}>Next</Button></div></div>
        </section>
        {reconcileId && <form className={`${panelClass} space-y-4 border-yellow-300`} onSubmit={event => { event.preventDefault(); void mutate(async () => { await instance.post(`/api/admin/chat/usage/${reconcileId}/reconcile`, { inputTokens: Number(reconcileInput), outputTokens: Number(reconcileOutput), reason }, chatRequestOptions); setReconcileId(null); await loadUsage(usagePage); }, "Usage reconciled and credit balances updated."); }}><h2 className="font-semibold">Reconcile usage</h2><p className="text-sm text-gray-500">Enter verified provider counts. Use zero only when you have confirmed no usage occurred. This updates both original daily and monthly windows and records your reason.</p><div className="grid gap-3 sm:grid-cols-2"><Field label="Verified input tokens"><input type="number" required min={0} max={1000000000} step={1} className={fieldClass} value={reconcileInput} onChange={event => setReconcileInput(event.target.value)} /></Field><Field label="Verified output tokens"><input type="number" required min={0} max={1000000000} step={1} className={fieldClass} value={reconcileOutput} onChange={event => setReconcileOutput(event.target.value)} /></Field></div><Field label="Audit reason"><textarea required minLength={5} maxLength={1000} className={fieldClass} value={reason} onChange={event => setReason(event.target.value)} /></Field><div className="flex gap-2"><Button type="submit" disabled={blocked} className="bg-yellow-500 text-gray-950 hover:bg-yellow-400">Confirm reconciliation</Button><Button type="button" variant="outline" disabled={saving} onClick={() => setReconcileId(null)}>Cancel</Button></div></form>}
      </div>}
    </div>
  </main>;
}
