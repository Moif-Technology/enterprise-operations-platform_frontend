"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { Button, Panel } from "@/components/ui/design-system";
import {
  getSpareParts,
  getStockBalances,
  getStockLocations,
  recordIssue,
} from "@/modules/inventory/service";
import { getAssets } from "@/modules/assets/service";

export default function IssueStockForm() {
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
  const [reason, setReason] = useState("");
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

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setError("Issue quantity must be greater than zero.");
      return;
    }

    if (parsedQuantity > availableQuantity) {
      setError(
        `Cannot issue more than the available stock (${availableQuantity}).`,
      );
      return;
    }

    if (!date) {
      setError("Issue date is required.");
      return;
    }

    if (!reason.trim()) {
      setError("Reason is required.");
      return;
    }

    if (
      destinationLocationId &&
      selectedDestination?.type !== "technician"
    ) {
      setError("Issue destination must be a technician stock location.");
      return;
    }

    try {
      recordIssue({
        id: `movement-${Date.now()}`,
        type: "issue",
        itemId,
        sourceLocationId,
        ...(destinationLocationId
          ? { destinationLocationId }
          : {}),
        quantity: parsedQuantity,
        date,
        reason: reason.trim(),
        ...(workOrderReference.trim()
          ? { workOrderReference: workOrderReference.trim() }
          : {}),
        ...(assetId ? { assetId } : {}),
        ...(selectedAsset
          ? {
              customerId: selectedAsset.customerId,
              siteId: selectedAsset.siteId,
            }
          : {}),
        ...(selectedDestination?.technicianName
          ? { technicianName: selectedDestination.technicianName }
          : {}),
        notes: notes.trim() || undefined,
      });

      router.push("/inventory/stock-overview");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to record the stock issue.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title="Issue Stock"
        description="Issue spare parts from a stock location, optionally moving them into technician stock."
      />

      <Panel
        title="Stock Issue"
        description="Issued quantities are recorded as stock movements and update derived stock balances."
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
                Source Location *
              </label>
              <select
                value={sourceLocationId}
                onChange={(event) =>
                  setSourceLocationId(event.target.value)
                }
                className="input w-full"
              >
                <option value="">Select source location</option>
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
                Quantity *
              </label>
              <input
                type="number"
                min="0.01"
                step="any"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
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
                Reason *
              </label>
              <input
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="input w-full"
                placeholder="e.g. Maintenance replacement"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Destination
              </label>
              <select
                value={destinationLocationId}
                onChange={(event) =>
                  setDestinationLocationId(event.target.value)
                }
                className="input w-full"
              >
                <option value="">No destination / consumption</option>
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
                Select technician stock when the issue is being transferred
                to a technician.
              </p>
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
                onChange={(event) => setAssetId(event.target.value)}
                className="input w-full"
              >
                <option value="">No asset reference</option>
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
                onChange={(event) => setNotes(event.target.value)}
                className="input min-h-24 w-full"
                placeholder="Optional issue notes"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit">
              Record Issue
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