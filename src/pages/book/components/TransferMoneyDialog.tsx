import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { format } from "date-fns";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import instance from "../../../instance";
import { apiError } from "../../../lib/chat";
import type { AppDispatch } from "../../../store/Store";
import { cashbooksAction } from "../../../store/slices/cashbooksSlice";
import { getCashbookById } from "../../../store/slices/singleCashbookSlice";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";

interface CashbookOption { id: string; name: string }
interface Props { open: boolean; onOpenChange: (open: boolean) => void; sourceId: string; sourceName: string }
const fieldClass = "mt-1 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-yellow-500 disabled:bg-gray-100";

export default function TransferMoneyDialog({ open, onOpenChange, sourceId, sourceName }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [cashbooks, setCashbooks] = useState<CashbookOption[]>([]);
  const [destinationId, setDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!open) return;
    const now = new Date();
    setDestinationId(""); setAmount(""); setName(""); setError("");
    setDate(format(now, "yyyy-MM-dd")); setTime(format(now, "HH:mm:ss"));
  }, [open, sourceId]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setLoading(true); setLoadError(""); setCashbooks([]);
    instance.get<{ items: CashbookOption[] }>("/api/cashbook", { signal: controller.signal, skipGlobalLoader: true })
      .then(response => {
        if (!Array.isArray(response.data.items)) throw new Error("Invalid cashbook response");
        setCashbooks(response.data.items.filter(book => book.id !== sourceId));
      })
      .catch(() => { if (!controller.signal.aborted) setLoadError("Could not load your cashbooks. Please try again."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [open, sourceId, reload]);

  const destination = cashbooks.find(book => book.id === destinationId);
  const validAmount = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(amount) && Number(amount) > 0 && Number(amount) <= 999999999999.99;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    if (!sourceId || !destination || destination.id === sourceId || !validAmount || !date || date < "1900-01-01" || !time) {
      setError("Choose a destination, a positive amount with at most two decimal places, and a valid date and time.");
      return;
    }
    inFlight.current = true; setSaving(true); setError("");
    try {
      await instance.post("/api/Cashbook/Transfer", {
        fromCashbook: sourceId,
        toCashbook: destination.id,
        amount: Number(amount),
        creationDate: date,
        creationTime: time.length === 5 ? `${time}:00` : time,
        name: name.trim() || `Transfer to ${destination.name}`.slice(0, 400),
        categoryId: null,
        paymentMethodId: null,
      }, { skipGlobalLoader: true });
      toast.success("Money transferred successfully");
      onOpenChange(false);
      // A refresh failure must never be treated as a failed transfer or trigger a retry.
      void Promise.allSettled([
        dispatch(getCashbookById(sourceId)).unwrap(),
        dispatch(cashbooksAction()).unwrap(),
      ]).then(results => {
        if (results.some(result => result.status === "rejected")) toast.error("Transfer saved. Reload the page to see updated balances.");
      });
    } catch (failure) {
      setError(axios.isAxiosError(failure) && !failure.response
        ? "Connection lost. The transfer may have been saved. Check both cashbooks before trying again."
        : apiError(failure, "Could not transfer money. Check both cashbooks before trying again."));
    } finally {
      inFlight.current = false; setSaving(false);
    }
  }

  return <Dialog open={open} onOpenChange={next => { if (!inFlight.current) onOpenChange(next); }}>
    <DialogContent className="max-h-[90dvh] overflow-y-auto" showCloseButton={!saving} onEscapeKeyDown={event => { if (inFlight.current) event.preventDefault(); }} onPointerDownOutside={event => { if (inFlight.current) event.preventDefault(); }}>
      <DialogHeader>
        <DialogTitle>Transfer money between cashbooks</DialogTitle>
        <DialogDescription>Records cash out from the source and cash in to the destination. Your combined balance stays the same.</DialogDescription>
      </DialogHeader>
      <form onSubmit={event => void submit(event)} className="space-y-4" aria-busy={saving}>
        <fieldset disabled={saving} className="min-w-0 space-y-4">
          <div><p className="text-xs font-medium text-gray-600">From cashbook</p><p className="mt-1 break-words rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold" dir="auto">{sourceName}</p></div>
          {loading ? <p role="status" className="text-sm text-gray-500">Loading your cashbooks…</p> : loadError ? <div role="alert" className="text-sm text-red-700"><p>{loadError}</p><button type="button" className="mt-1 underline" onClick={() => setReload(value => value + 1)}>Retry loading cashbooks</button></div> : !cashbooks.length ? <p role="status" className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-900">Create another cashbook before transferring money.</p> : <label className="block text-xs font-medium text-gray-600">To cashbook<select required value={destinationId} onChange={event => setDestinationId(event.target.value)} className={fieldClass}><option value="">Choose a destination</option>{cashbooks.map(book => <option key={book.id} value={book.id}>{book.name}</option>)}</select></label>}
          <label className="block text-xs font-medium text-gray-600">Amount<input required type="number" inputMode="decimal" min="0.01" max="999999999999.99" step="0.01" value={amount} onChange={event => setAmount(event.target.value)} placeholder="0.00" className={fieldClass} /></label>
          <div className="grid min-w-0 grid-cols-2 gap-3"><label className="block min-w-0 text-xs font-medium text-gray-600">Date<input required type="date" min="1900-01-01" max="9999-12-31" value={date} onChange={event => setDate(event.target.value)} className={fieldClass} /></label><label className="block min-w-0 text-xs font-medium text-gray-600">Time<input required type="time" step={1} value={time} onChange={event => setTime(event.target.value)} className={fieldClass} /></label></div>
          <label className="block text-xs font-medium text-gray-600">Label (optional)<input maxLength={400} value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Move cash to bank" className={fieldClass} dir="auto" /></label>
        </fieldset>
        {destination && validAmount && <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-950" role="status">Transfer <strong>{Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> from <strong>{sourceName}</strong> to <strong>{destination.name}</strong>.</p>}
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <DialogFooter><Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={saving || loading || !!loadError || !destination || !validAmount || !date || !time} className="bg-yellow-500 text-gray-950 hover:bg-yellow-400">{saving ? "Transferring…" : "Transfer money"}</Button></DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}
