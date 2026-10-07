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
    <div className="return-stock-page">
      {/* =====================================================
          Header
          ===================================================== */}
  
      <div className="return-stock-header">
        <div className="return-stock-title-section">
          <p className="return-stock-eyebrow">
            Inventory
          </p>
  
          <h1>Return Stock</h1>
  
          <p className="return-stock-description">
            Return spare parts from technician stock to a
            warehouse and record their condition.
          </p>
        </div>
  
        <div className="return-stock-header-actions">
          <button
            type="button"
            className="return-stock-cancel-button"
            onClick={() =>
              router.push("/inventory/stock-overview")
            }
          >
            Cancel
          </button>
  
          <button
            type="submit"
            form="return-stock-form"
            className="return-stock-record-button"
          >
            Record Return
          </button>
        </div>
      </div>
  
      {/* =====================================================
          Form
          ===================================================== */}
  
      <form
        id="return-stock-form"
        onSubmit={handleSubmit}
        className="return-stock-form"
      >
        {error && (
          <div className="return-stock-submit-error">
            {error}
          </div>
        )}
  
        <div className="return-stock-card-grid">
          {/* =================================================
              Left Card — Stock Return Information
              ================================================= */}
  
          <section className="return-stock-card">
            <div className="return-stock-card-header">
              <h3>Stock Return Information</h3>
            </div>
  
            <div className="return-stock-card-fields">
              {/* Spare Part */}
              <div className="return-stock-field">
                <label htmlFor="return-stock-part">
                  Spare Part <span>*</span>
                </label>
  
                <select
                  id="return-stock-part"
                  value={itemId}
                  onChange={(event) => {
                    setItemId(event.target.value);
                    setQuantity("");
                  }}
                  className="return-stock-control"
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
  
              {/* Source Technician Stock */}
              <div className="return-stock-field">
                <label htmlFor="return-stock-source">
                  Source Technician Stock <span>*</span>
                </label>
  
                <select
                  id="return-stock-source"
                  value={sourceLocationId}
                  onChange={(event) =>
                    setSourceLocationId(
                      event.target.value,
                    )
                  }
                  className="return-stock-control"
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
                      <option
                        key={location.id}
                        value={location.id}
                      >
                        {location.name} ({location.code})
                      </option>
                    ))}
                </select>
  
                <div className="return-stock-availability">
                  <span>Available Stock</span>
  
                  <span className="return-stock-availability-value">
                    Available: {availableQuantity}
                  </span>
                </div>
              </div>
  
              {/* Destination Warehouse */}
              <div className="return-stock-field">
                <label htmlFor="return-stock-destination">
                  Destination Warehouse <span>*</span>
                </label>
  
                <select
                  id="return-stock-destination"
                  value={destinationLocationId}
                  onChange={(event) =>
                    setDestinationLocationId(
                      event.target.value,
                    )
                  }
                  className="return-stock-control"
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
                      <option
                        key={location.id}
                        value={location.id}
                      >
                        {location.name} ({location.code})
                      </option>
                    ))}
                </select>
              </div>
  
              {/* Quantity */}
              <div className="return-stock-field">
                <label htmlFor="return-stock-quantity">
                  Quantity <span>*</span>
                </label>
  
                <input
                  id="return-stock-quantity"
                  type="number"
                  min="0.01"
                  step="any"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(event.target.value)
                  }
                  className="return-stock-control"
                  placeholder="e.g. 1"
                />
              </div>
  
              {/* Date */}
              <div className="return-stock-field">
                <label htmlFor="return-stock-date">
                  Date <span>*</span>
                </label>
  
                <input
                  id="return-stock-date"
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  className="return-stock-control"
                />
              </div>
  
              {/* Condition */}
              <div className="return-stock-field">
                <label htmlFor="return-stock-condition">
                  Condition <span>*</span>
                </label>
  
                <select
                  id="return-stock-condition"
                  value={condition}
                  onChange={(event) =>
                    setCondition(
                      event.target.value as
                        | "usable"
                        | "damaged"
                        | "",
                    )
                  }
                  className="return-stock-control"
                >
                  <option value="">
                    Select condition
                  </option>
  
                  <option value="usable">
                    Usable
                  </option>
  
                  <option value="damaged">
                    Damaged
                  </option>
                </select>
  
                <p className="return-stock-helper">
                  Damaged returns remain visible in total
                  stock but are excluded from usable stock.
                </p>
              </div>
  
              {/* Reason */}
              <div className="return-stock-field">
                <label htmlFor="return-stock-reason">
                  Reason <span>*</span>
                </label>
  
                <input
                  id="return-stock-reason"
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                  className="return-stock-control"
                  placeholder="e.g. Unused part returned after maintenance"
                />
              </div>
            </div>
          </section>
  
          {/* =================================================
              Right Card — References & Asset Links
              ================================================= */}
  
          <section className="return-stock-card return-stock-reference-card">
            <div className="return-stock-card-header">
              <h3>References &amp; Asset Links</h3>
            </div>
  
            <div className="return-stock-card-fields return-stock-reference-fields">
              {/* Original Issue Reference */}
              <div className="return-stock-field">
                <label htmlFor="return-stock-original-reference">
                  Original Issue Reference
                </label>
  
                <input
                  id="return-stock-original-reference"
                  value={originalIssueReference}
                  onChange={(event) =>
                    setOriginalIssueReference(
                      event.target.value,
                    )
                  }
                  className="return-stock-control"
                  placeholder="e.g. movement-123456789"
                />
              </div>
  
              {/* Work Order Reference */}
              <div className="return-stock-field">
                <label htmlFor="return-stock-work-order">
                  Work Order Reference
                </label>
  
                <input
                  id="return-stock-work-order"
                  value={workOrderReference}
                  onChange={(event) =>
                    setWorkOrderReference(
                      event.target.value,
                    )
                  }
                  className="return-stock-control"
                  placeholder="e.g. WO-2026-001"
                />
              </div>
  
              {/* Asset */}
              <div className="return-stock-field">
                <label htmlFor="return-stock-asset">
                  Asset
                </label>
  
                <select
                  id="return-stock-asset"
                  value={assetId}
                  onChange={(event) =>
                    setAssetId(event.target.value)
                  }
                  className="return-stock-control"
                >
                  <option value="">
                    No asset reference
                  </option>
  
                  {assets.map((asset) => (
                    <option
                      key={asset.id}
                      value={asset.id}
                    >
                      {asset.assetCode} — {asset.name}
                    </option>
                  ))}
                </select>
  
                {selectedAsset && (
                  <p className="return-stock-helper">
                    Site/customer are derived from the
                    selected asset.
                  </p>
                )}
              </div>
  
              {/* Notes */}
              <div className="return-stock-field return-stock-notes-field">
                <label htmlFor="return-stock-notes">
                  Notes
                </label>
  
                <textarea
                  id="return-stock-notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  className="return-stock-control return-stock-textarea"
                  placeholder="Optional return notes"
                />
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}