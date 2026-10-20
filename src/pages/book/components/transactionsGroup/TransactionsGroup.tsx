import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import instance from "../../../../instance";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store/Store";
import { cashbooksAction } from "../../../../store/slices/cashbooksSlice";
import { getCashbookById } from "../../../../store/slices/singleCashbookSlice";
import type { Entries, GroupedEntries } from '../../Book'

interface CashbookOption {
  id: string;
  name: string;
}

const TransactionsGroup = ({
  entries,
  sourceCashbookId,
}: {
  entries: GroupedEntries[];
  sourceCashbookId: string;
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const [selectedEntry, setSelectedEntry] = useState<Entries | null>(null);
  const [cashbooks, setCashbooks] = useState<CashbookOption[]>([]);
  const [destinationCashbookId, setDestinationCashbookId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingCashbooks, setIsLoadingCashbooks] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleOpenMove = async (
    event: React.MouseEvent<HTMLButtonElement>,
    entry: Entries,
  ) => {
    event.stopPropagation();
    setSelectedEntry(entry);
    setCashbooks([]);
    setDestinationCashbookId("");
    setErrorMessage("");
    setIsDialogOpen(true);
    setIsLoadingCashbooks(true);

    try {
      const result = await dispatch(cashbooksAction()).unwrap();
      if (!Array.isArray(result)) {
        throw new Error("Cashbook response did not contain a list.");
      }
      setCashbooks(result);
    } catch (error: unknown) {
      console.error("Failed to load cashbooks for entry move:", error);
      setErrorMessage("Unable to load your cashbooks. Please try again.");
    } finally {
      setIsLoadingCashbooks(false);
    }
  };

  const handleMove = async () => {
    if (!selectedEntry || !sourceCashbookId || !destinationCashbookId) {
      setErrorMessage("Select a destination cashbook to continue.");
      return;
    }

    setErrorMessage("");
    setIsMoving(true);
    try {
      await instance.post("/api/Cashbook/MoveEntry", {
        entryId: selectedEntry.id,
        toCashbook: destinationCashbookId,
      });

      toast.success("Entry moved successfully");
      setIsDialogOpen(false);
      dispatch(getCashbookById(sourceCashbookId));
      dispatch(cashbooksAction());
    } catch (error: unknown) {
      console.error("Entry move failed:", error);
      setErrorMessage("Unable to move this entry. Please try again.");
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <>
      <section className="flex flex-col gap-3 p-2">
        {entries.map((item) => (
          <div key={item.groupDate} className="flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-500">{item.groupDate}</p>
            {item.entries?.map((entry) => (
              <div
                key={entry.id}
                className="cursor-pointer rounded-lg bg-gray-100 p-1"
                onClick={() => navigate(`${entry.id}`)}
              >
                <div className="flex items-center gap-2">
                  <p className="flex min-w-0 flex-1 justify-between gap-2 p-1">
                    <span className="truncate text-sm font-semibold capitalize text-gray-800">{entry.name}</span>
                    <span className={`text-sm ${entry.entryType === 1 ? 'text-green-600' : 'text-red-600'}`}>{entry.amount}</span>
                  </p>
                  <button
                    type="button"
                    aria-label={`Move ${entry.name} to another cashbook`}
                    title="Move entry"
                    className="mr-1 rounded-md p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    onClick={(event) => void handleOpenMove(event, entry)}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                </div>
                {(entry.categoryName || entry.paymentMethodName) && (
                  <div className="flex items-center gap-2 p-2">
                    {entry.paymentMethodName && (
                      <p className="rounded-sm bg-yellow-400 p-1 text-xs text-gray-800">{entry.paymentMethodName}</p>
                    )}
                    {entry.categoryName && (
                      <p className="rounded-sm bg-gray-300 p-1 text-xs text-gray-800">{entry.categoryName}</p>
                    )}
                  </div>
                )}
                <p className="border-t border-gray-300 p-2 text-xs">
                  <span className="text-[10px] font-semibold text-yellow-500">Entered by {entry.createdBy}</span>
                  <span className="ml-1 text-[9px] font-semibold text-gray-400">at {entry.createdAtDate}</span>
                </p>
              </div>
            ))}
          </div>
        ))}
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move entry</DialogTitle>
            <DialogDescription>
              {selectedEntry
                ? `Choose a cashbook to move "${selectedEntry.name}" (${selectedEntry.amount}) to.`
                : "Choose a destination cashbook."}
            </DialogDescription>
          </DialogHeader>
          {isLoadingCashbooks ? (
            <p className="text-sm text-gray-500">Loading your cashbooks...</p>
          ) : cashbooks.filter((cashbook) => cashbook.id !== sourceCashbookId).length > 0 ? (
            <Select value={destinationCashbookId} onValueChange={setDestinationCashbookId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a cashbook" />
              </SelectTrigger>
              <SelectContent>
                {cashbooks
                  .filter((cashbook) => cashbook.id !== sourceCashbookId)
                  .map((cashbook) => (
                    <SelectItem key={cashbook.id} value={cashbook.id}>
                      {cashbook.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-gray-500">
              No other cashbooks are available for moving this entry.
            </p>
          )}
          {errorMessage && (
            <p role="alert" className="text-sm text-red-700">{errorMessage}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isMoving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleMove()}
              disabled={
                isLoadingCashbooks ||
                isMoving ||
                !destinationCashbookId ||
                cashbooks.filter((cashbook) => cashbook.id !== sourceCashbookId).length === 0
              }
            >
              {isMoving ? "Moving..." : "Move entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TransactionsGroup
