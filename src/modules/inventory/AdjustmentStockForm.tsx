"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { Button, Panel } from "@/components/ui/design-system";
import {
  getSpareParts,
  getStockBalances,
  getStockLocations,
  recordAdjustment,
} from "@/modules/inventory/service";

export default function AdjustmentStockForm() {
  const router = useRouter();

  const parts = useMemo(() => getSpareParts(), []);
  const locations = useMemo(() => getStockLocations(), []);
  const balances = useMemo(() => getStockBalances(), []);

  const [itemId, setItemId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [direction, setDirection] = useState<
    "increase" | "decrease" | ""
  >("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [reasonCode, setReasonCode] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const availableQuantity = useMemo(() => {
    if (!itemId || !locationId) {
      return 0;
    }

    return (
      balances.find(
        (balance) =>
          balance.itemId === itemId &&
          balance.locationId === locationId,
      )?.quantity ?? 0
    );
  }, [balances, itemId, locationId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedQuantity = Number(quantity);

    if (!itemId) {
      setError("Spare part is required.");
      return;
    }

    if (!locationId) {
      setError("Stock location is required.");
      return;
    }

    if (!direction) {
      setError("Adjustment direction is required.");
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError("Adjustment quantity must be greater than zero.");
      return;
    }

    if (
      direction === "decrease" &&
      parsedQuantity > availableQuantity
    ) {
      setError(
        `Cannot decrease more than the available stock (${availableQuantity}).`,
      );
      return;
    }

    if (!date) {
      setError("Adjustment date is required.");
      return;
    }

    if (!reasonCode.trim()) {
      setError("Reason code is required.");
      return;
    }

    if (!reason.trim()) {
      setError("Reason is required.");
      return;
    }

    try {
      recordAdjustment({
        id: `movement-${Date.now()}`,
        type: "adjustment",
        itemId,
        destinationLocationId: locationId,
        quantity: parsedQuantity,
        date,
        reasonCode: reasonCode.trim(),
        reason: reason.trim(),
        adjustmentDirection: direction,
        notes: notes.trim() || undefined,
      });

      router.push("/inventory/stock-overview");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to record the stock adjustment.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title="Adjust Stock"
        description="Record an auditable stock increase or decrease without directly editing the derived balance."
      />

      <Panel
        title="Stock Adjustment"
        description="Adjustments are append-only movements. The current stock balance is derived from opening balances and recorded movements."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Spare Part *
              </label>
              <select
                value={itemId}
                onChange={(event) => setItemId(event.target.value)}
                className="input w-full"
              >
                <option value="">Select spare part</option>
                {parts
                  .filter((part) => part.status === "active")
                  .map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.name} ({part.partCode})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Stock Location *
              </label>
              <select
                value={locationId}
                onChange={(event) =>
                  setLocationId(event.target.value)
                }
                className="input w-full"
              >
                <option value="">Select stock location</option>
                {locations
                  .filter((location) => location.status === "active")
                  .map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({location.code})
                    </option>
                  ))}
              </select>

              <p className="mt-1 text-xs text-[#647086]">
                Available: {availableQuantity}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Adjustment *
              </label>
              <select
                value={direction}
                onChange={(event) =>
                  setDirection(
                    event.target.value as
                      | "increase"
                      | "decrease"
                      | "",
                  )
                }
                className="input w-full"
              >
                <option value="">Select adjustment</option>
                <option value="increase">Increase stock</option>
                <option value="decrease">Decrease stock</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Quantity *
              </label>
              <input
                type="number"
                min="0.01"
                step="any"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                className="input w-full"
                placeholder="e.g. 2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Reason Code *
              </label>
              <select
                value={reasonCode}
                onChange={(event) =>
                  setReasonCode(event.target.value)
                }
                className="input w-full"
              >
                <option value="">Select reason code</option>
                <option value="count-correction">
                  Count correction
                </option>
                <option value="damage-writeoff">
                  Damage write-off
                </option>
                <option value="found-stock">
                  Found stock
                </option>
                <option value="lost-stock">
                  Lost stock
                </option>
                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Reason *
              </label>
              <input
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="input w-full"
                placeholder="Explain why the stock is being adjusted"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="input min-h-24 w-full"
                placeholder="Optional adjustment notes"
              />
            </div>
          </div>

          <div className="rounded-md border border-[#dfe4ea] bg-[#f6f7f9] px-4 py-3 text-sm text-[#647086]">
            Stock adjustments are recorded as movements and cannot
            directly edit the derived stock balance. A decrease cannot
            make stock negative.
          </div>

          <div className="flex gap-3">
            <Button type="submit">
              Record Adjustment
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                router.push("/inventory/stock-overview")
              }
            >
              Cancel
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}