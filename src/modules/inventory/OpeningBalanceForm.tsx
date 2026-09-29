"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { Button, Panel } from "@/components/ui/design-system";
import {
  getSpareParts,
  getStockLocations,
  saveOpeningBalance,
} from "@/modules/inventory/service";

export default function OpeningBalanceForm() {
  const router = useRouter();

  const parts = useMemo(() => getSpareParts(), []);
  const locations = useMemo(() => getStockLocations(), []);

  const [itemId, setItemId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedQuantity = Number(quantity);

    if (!itemId || !locationId) {
      setError("Spare part and stock location are required.");
      return;
    }

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      setError("Opening quantity must be greater than zero.");
      return;
    }

    try {
      saveOpeningBalance({
        id: `opening-${Date.now()}`,
        itemId,
        locationId,
        quantity: parsedQuantity,
        ...(notes.trim()
          ? { notes: notes.trim() }
          : {}),
      });

      router.push("/inventory/stock-overview");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save the opening balance.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title="Add Opening Balance"
        description="Seed the initial stock quantity for a spare part at a stock location."
      />

      <Panel
        title="Opening Balance"
        description="Opening balances are used as the starting point for derived stock quantities."
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
                  .filter(
                    (location) => location.status === "active",
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
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Opening Quantity *
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
                placeholder="e.g. 10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Notes
              </label>

              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="input w-full"
                placeholder="Optional opening balance note"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit">
              Save Opening Balance
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