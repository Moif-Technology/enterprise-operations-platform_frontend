"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";

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

  function handleCancel() {
    router.push("/inventory/stock-overview");
  }

  return (
    <div className="adjust-stock-page">
      <PageHeader
        eyebrow="Inventory"
        title="Adjust Stock"
        description="Record an auditable stock increase or decrease without directly editing the derived balance."
        action={
          <div className="adjust-stock-header-actions">
            <button
              type="button"
              className="adjust-stock-cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              form="adjust-stock-form"
              className="adjust-stock-record-button"
            >
              Record Adjustment
            </button>
          </div>
        }
      />

      <form
        id="adjust-stock-form"
        onSubmit={handleSubmit}
        className="adjust-stock-form"
      >
        {error && (
          <div className="adjust-stock-submit-error">
            {error}
          </div>
        )}

        <div className="adjust-stock-card-grid">
          {/* Left Card */}
          <section className="adjust-stock-card">
            <div className="adjust-stock-card-header">
              <h3>Stock Adjustment Information</h3>
            </div>

            <div className="adjust-stock-card-fields">
              <div className="adjust-stock-field">
                <label htmlFor="adjust-stock-part">
                  Spare Part <span>*</span>
                </label>

                <select
                  id="adjust-stock-part"
                  value={itemId}
                  onChange={(event) =>
                    setItemId(event.target.value)
                  }
                  className="adjust-stock-control"
                >
                  <option value="">
                    Select spare part
                  </option>

                  {parts
                    .filter(
                      (part) => part.status === "active",
                    )
                    .map((part) => (
                      <option
                        key={part.id}
                        value={part.id}
                      >
                        {part.name} ({part.partCode})
                      </option>
                    ))}
                </select>
              </div>

              <div className="adjust-stock-field">
                <label htmlFor="adjust-stock-location">
                  Stock Location <span>*</span>
                </label>

                <select
                  id="adjust-stock-location"
                  value={locationId}
                  onChange={(event) =>
                    setLocationId(event.target.value)
                  }
                  className="adjust-stock-control"
                >
                  <option value="">
                    Select stock location
                  </option>

                  {locations
                    .filter(
                      (location) =>
                        location.status === "active",
                    )
                    .map((location) => (
                      <option
                        key={location.id}
                        value={location.id}
                      >
                        {location.name} ({location.code})
                      </option>
                    ))}
                </select>

                <div className="adjust-stock-availability">
                  <span>Available Stock</span>

                  <span className="adjust-stock-availability-value">
                    Available: {availableQuantity}
                  </span>
                </div>
              </div>

              <div className="adjust-stock-field">
                <label htmlFor="adjust-stock-direction">
                  Adjustment <span>*</span>
                </label>

                <select
                  id="adjust-stock-direction"
                  value={direction}
                  onChange={(event) =>
                    setDirection(
                      event.target.value as
                        | "increase"
                        | "decrease"
                        | "",
                    )
                  }
                  className="adjust-stock-control"
                >
                  <option value="">
                    Select adjustment
                  </option>

                  <option value="increase">
                    Increase stock
                  </option>

                  <option value="decrease">
                    Decrease stock
                  </option>
                </select>
              </div>

              <div className="adjust-stock-field">
                <label htmlFor="adjust-stock-quantity">
                  Quantity <span>*</span>
                </label>

                <input
                  id="adjust-stock-quantity"
                  type="number"
                  min="0.01"
                  step="any"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(event.target.value)
                  }
                  className="adjust-stock-control"
                  placeholder="e.g. 2"
                />
              </div>

              <div className="adjust-stock-field">
                <label htmlFor="adjust-stock-date">
                  Date <span>*</span>
                </label>

                <input
                  id="adjust-stock-date"
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  className="adjust-stock-control"
                />
              </div>
            </div>
          </section>

          {/* Right Card */}
          <section className="adjust-stock-card adjust-stock-reason-card">
            <div className="adjust-stock-card-header">
              <h3>Reason &amp; Notes</h3>
            </div>

            <div className="adjust-stock-card-fields adjust-stock-reason-fields">
              <div className="adjust-stock-field">
                <label htmlFor="adjust-stock-reason-code">
                  Reason Code <span>*</span>
                </label>

                <select
                  id="adjust-stock-reason-code"
                  value={reasonCode}
                  onChange={(event) =>
                    setReasonCode(event.target.value)
                  }
                  className="adjust-stock-control"
                >
                  <option value="">
                    Select reason code
                  </option>

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

              <div className="adjust-stock-field">
                <label htmlFor="adjust-stock-reason">
                  Reason <span>*</span>
                </label>

                <input
                  id="adjust-stock-reason"
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                  className="adjust-stock-control"
                  placeholder="Explain why the stock is being adjusted"
                />
              </div>

              <div className="adjust-stock-field adjust-stock-notes-field">
                <label htmlFor="adjust-stock-notes">
                  Notes
                </label>

                <textarea
                  id="adjust-stock-notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  className="adjust-stock-control adjust-stock-textarea"
                  placeholder="Optional adjustment notes"
                />
              </div>

              <div className="adjust-stock-helper">
                Stock adjustments are recorded as movements and
                cannot directly edit the derived stock balance. A
                decrease cannot make stock negative.
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}