"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { Button, Panel } from "@/components/ui/design-system";
import {
  getSpareParts,
  getStockBalances,
  getStockLocations,
  recordReturn,
} from "@/modules/inventory/service";
import { getAssets } from "@/modules/assets/service";

export default function ReturnStockForm() {
  const router = useRouter();

  const parts = useMemo(() => getSpareParts(), []);
  const locations = useMemo(() => getStockLocations(), []);
  const assets = useMemo(() => getAssets(), []);
  const balances = useMemo(() => getStockBalances(), []);

  const [itemId, setItemId] = useState("");
  const [sourceLocationId, setSourceLocationId] = useState("");
  const [destinationLocationId, setDestinationLocationId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [condition, setCondition] = useState<"usable" | "damaged" | "">("");
  const [reason, setReason] = useState("");
  const [originalIssueReference, setOriginalIssueReference] = useState("");
  const [workOrderReference, setWorkOrderReference] = useState("");
  const [assetId, setAssetId] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === assetId),
    [assets, assetId],
  );

  const availableQuantity = useMemo(() => {
    if (!itemId || !sourceLocationId) {
      return 0;
    }

    return (
      balances.find(
        (balance) =>
          balance.itemId === itemId &&
          balance.locationId === sourceLocationId,
      )?.quantity ?? 0
    );
  }, [balances, itemId, sourceLocationId]);

  const selectedSource = sourceLocationId
    ? locations.find((location) => location.id === sourceLocationId)
    : undefined;

  const selectedDestination = destinationLocationId
    ? locations.find((location) => location.id === destinationLocationId)
    : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedQuantity = Number(quantity);

    if (!itemId) {
      setError("Spare part is required.");
      return;
    }

    if (!sourceLocationId) {
      setError("Source location is required.");
      return;
    }

    if (selectedSource?.type !== "technician") {
      setError("Return source must be a technician stock location.");
      return;
    }

    if (!destinationLocationId) {
      setError("Destination warehouse is required.");
      return;
    }

    if (selectedDestination?.type !== "warehouse") {
      setError("Return destination must be a warehouse.");
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError("Return quantity must be greater than zero.");
      return;
    }

    if (parsedQuantity > availableQuantity) {
      setError(
        `Cannot return more than the available stock (${availableQuantity}).`,
      );
      return;
    }

    if (!date) {
      setError("Return date is required.");
      return;
    }

    if (!condition) {
      setError("Return condition is required.");
      return;
    }

    if (!reason.trim()) {
      setError("Reason is required.");
      return;
    }

    try {
      recordReturn({
        id: `movement-${Date.now()}`,
        type: "return",
        itemId,
        sourceLocationId,
        destinationLocationId,
        quantity: parsedQuantity,
        date,
        condition,
        reason: reason.trim(),
        ...(originalIssueReference.trim()
          ? {
              originalIssueReference:
                originalIssueReference.trim(),
            }
          : {}),
        ...(workOrderReference.trim()
          ? {
              workOrderReference:
                workOrderReference.trim(),
            }
          : {}),
        ...(assetId ? { assetId } : {}),
        ...(selectedAsset
          ? {
              customerId: selectedAsset.customerId,
              siteId: selectedAsset.siteId,
            }
          : {}),
        ...(selectedSource?.technicianName
          ? {
              technicianName:
                selectedSource.technicianName,
            }
          : {}),
        notes: notes.trim() || undefined,
      });

      router.push("/inventory/stock-overview");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to record the stock return.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title="Return Stock"
        description="Return spare parts from technician stock to a warehouse and record their condition."
      />

      <Panel
        title="Stock Return"
        description="Returned quantities are recorded as stock movements and update derived stock balances."
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
                onChange={(event) => {
                  setItemId(event.target.value);
                  setQuantity("");
                }}
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
                Source Technician Stock *
              </label>
              <select
                value={sourceLocationId}
                onChange={(event) =>
                  setSourceLocationId(event.target.value)
                }
                className="input w-full"
              >
                <option value="">
                  Select technician stock
                </option>
                {locations
                  .filter(
                    (location) =>
                      location.status === "active" &&
                      location.type === "technician",
                  )
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
                Destination Warehouse *
              </label>
              <select
                value={destinationLocationId}
                onChange={(event) =>
                  setDestinationLocationId(event.target.value)
                }
                className="input w-full"
              >
                <option value="">
                  Select destination warehouse
                </option>
                {locations
                  .filter(
                    (location) =>
                      location.status === "active" &&
                      location.type === "warehouse",
                  )
                  .map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({location.code})
                    </option>
                  ))}
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
                placeholder="e.g. 1"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="input w-full"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(event) =>
                  setCondition(
                    event.target.value as
                      | "usable"
                      | "damaged"
                      | "",
                  )
                }
                className="input w-full"
              >
                <option value="">Select condition</option>
                <option value="usable">
                  Usable
                </option>
                <option value="damaged">
                  Damaged
                </option>
              </select>

              <p className="mt-1 text-xs text-[#647086]">
                Damaged returns remain visible in total stock but
                are excluded from usable stock.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Reason *
              </label>
              <input
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                className="input w-full"
                placeholder="e.g. Unused part returned after maintenance"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Original Issue Reference
              </label>
              <input
                value={originalIssueReference}
                onChange={(event) =>
                  setOriginalIssueReference(
                    event.target.value,
                  )
                }
                className="input w-full"
                placeholder="e.g. movement-123456789"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Work Order Reference
              </label>
              <input
                value={workOrderReference}
                onChange={(event) =>
                  setWorkOrderReference(event.target.value)
                }
                className="input w-full"
                placeholder="e.g. WO-2026-001"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Asset
              </label>
              <select
                value={assetId}
                onChange={(event) =>
                  setAssetId(event.target.value)
                }
                className="input w-full"
              >
                <option value="">
                  No asset reference
                </option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.assetCode} — {asset.name}
                  </option>
                ))}
              </select>

              {selectedAsset && (
                <p className="mt-1 text-xs text-[#647086]">
                  Site/customer are derived from the selected asset.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                className="input min-h-24 w-full"
                placeholder="Optional return notes"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit">
              Record Return
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