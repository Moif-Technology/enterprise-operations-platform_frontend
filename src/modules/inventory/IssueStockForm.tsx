"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import {
  getSpareParts,
  getStockBalances,
  getStockLocations,
  recordIssue,
} from "@/modules/inventory/service";
import { getAssets } from "@/modules/assets/service";

type FieldErrors = {
  itemId?: boolean;
  sourceLocationId?: boolean;
  quantity?: boolean;
  date?: boolean;
  reason?: boolean;
};

export default function IssueStockForm() {
  const router = useRouter();

  const parts = useMemo(() => getSpareParts(), []);
  const locations = useMemo(() => getStockLocations(), []);
  const assets = useMemo(() => getAssets(), []);
  const balances = useMemo(() => getStockBalances(), []);

  const [itemId, setItemId] = useState("");
  const [sourceLocationId, setSourceLocationId] =
    useState("");
  const [destinationLocationId, setDestinationLocationId] =
    useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [reason, setReason] = useState("");
  const [workOrderReference, setWorkOrderReference] =
    useState("");
  const [assetId, setAssetId] = useState("");
  const [notes, setNotes] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");

  const selectedPart = useMemo(
    () => parts.find((part) => part.id === itemId),
    [parts, itemId],
  );

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
    ? locations.find(
        (location) =>
          location.id === destinationLocationId,
      )
    : undefined;

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((current) => ({
      ...current,
      [field]: false,
    }));

    setSubmitError("");
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitError("");

    const parsedQuantity = Number(quantity);
    const errors: FieldErrors = {};

    if (!itemId) {
      errors.itemId = true;
    }

    if (!sourceLocationId) {
      errors.sourceLocationId = true;
    }

    if (
      !quantity ||
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      errors.quantity = true;
    }

    if (!date) {
      errors.date = true;
    }

    if (!reason.trim()) {
      errors.reason = true;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    if (parsedQuantity > availableQuantity) {
      setSubmitError(
        `Cannot issue more than the available stock (${availableQuantity}).`,
      );
      return;
    }

    if (
      destinationLocationId &&
      selectedDestination?.type !== "technician"
    ) {
      setSubmitError(
        "Issue destination must be a technician stock location.",
      );
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
        ...(selectedDestination?.technicianName
          ? {
              technicianName:
                selectedDestination.technicianName,
            }
          : {}),
        notes: notes.trim() || undefined,
      });

      router.push("/inventory/stock-overview");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to record the stock issue.",
      );
    }
  }

  function handleCancel() {
    router.push("/inventory/stock-overview");
  }

  return (
    <div className="issue-stock-page">
      {/* =====================================================
          Page Header
          ===================================================== */}
  
      <div className="issue-stock-header">
        <div className="issue-stock-title-section">
          <p className="issue-stock-eyebrow">
            Inventory
          </p>
  
          <h1>Issue Stock</h1>
  
          <p className="issue-stock-description">
            Issue spare parts from a stock location, optionally
            moving them into technician stock.
          </p>
        </div>
  
        <div className="issue-stock-header-actions">
          <button
            type="button"
            className="issue-stock-cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
  
          <button
            type="submit"
            form="issue-stock-form"
            className="issue-stock-record-button"
          >
            Record Issue
          </button>
        </div>
      </div>
  
      <form
        id="issue-stock-form"
        onSubmit={handleSubmit}
        className="issue-stock-form"
      >
        {/* =====================================================
            Two Card Horizontal Layout
            ===================================================== */}
  
        <div className="issue-stock-card-grid">
          {/* =================================================
              Left Card — Stock Issue Information
              ================================================= */}
  
          <section className="issue-stock-card">
            <div className="issue-stock-card-header">
              <h3>Stock Issue Information</h3>
            </div>
  
            <div className="issue-stock-card-fields">
              {/* Spare Part */}
              <div className="issue-stock-field">
                <label htmlFor="issue-stock-part">
                  Spare Part <span>*</span>
                </label>
  
                <select
                  id="issue-stock-part"
                  value={itemId}
                  onChange={(event) => {
                    setItemId(event.target.value);
                    setQuantity("");
                    clearFieldError("itemId");
                    clearFieldError("quantity");
                  }}
                  className={`issue-stock-control ${
                    fieldErrors.itemId
                      ? "issue-stock-control-error"
                      : ""
                  }`}
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
  
                {fieldErrors.itemId && (
                  <p className="issue-stock-field-error">
                    Field is required.
                  </p>
                )}
              </div>
  
              {/* Source Location */}
              <div className="issue-stock-field">
                <label htmlFor="issue-stock-source">
                  Source Location <span>*</span>
                </label>
  
                <select
                  id="issue-stock-source"
                  value={sourceLocationId}
                  onChange={(event) => {
                    setSourceLocationId(
                      event.target.value,
                    );
                    clearFieldError(
                      "sourceLocationId",
                    );
                  }}
                  className={`issue-stock-control ${
                    fieldErrors.sourceLocationId
                      ? "issue-stock-control-error"
                      : ""
                  }`}
                >
                  <option value="">
                    Select source location
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
  
                {fieldErrors.sourceLocationId && (
                  <p className="issue-stock-field-error">
                    Field is required.
                  </p>
                )}
  
                {itemId && sourceLocationId && (
                  <div className="issue-stock-availability">
                    <span>
                      Available stock
                    </span>
  
                    <span className="issue-stock-availability-value">
                      {availableQuantity}{" "}
                      {selectedPart?.unitOfMeasure ??
                        "unit"}{" "}
                      available
                    </span>
                  </div>
                )}
              </div>
  
              {/* Quantity */}
              <div className="issue-stock-field">
                <label htmlFor="issue-stock-quantity">
                  Quantity <span>*</span>
                </label>
  
                <input
                  id="issue-stock-quantity"
                  type="number"
                  min="0.01"
                  step="any"
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(event.target.value);
                    clearFieldError("quantity");
                  }}
                  className={`issue-stock-control ${
                    fieldErrors.quantity
                      ? "issue-stock-control-error"
                      : ""
                  }`}
                  placeholder="e.g. 2"
                />
  
                {fieldErrors.quantity && (
                  <p className="issue-stock-field-error">
                    Field is required.
                  </p>
                )}
              </div>
  
              {/* Date */}
              <div className="issue-stock-field">
                <label htmlFor="issue-stock-date">
                  Date <span>*</span>
                </label>
  
                <input
                  id="issue-stock-date"
                  type="date"
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    clearFieldError("date");
                  }}
                  className={`issue-stock-control ${
                    fieldErrors.date
                      ? "issue-stock-control-error"
                      : ""
                  }`}
                />
  
                {fieldErrors.date && (
                  <p className="issue-stock-field-error">
                    Field is required.
                  </p>
                )}
              </div>
  
              {/* Destination */}
              <div className="issue-stock-field">
                <label htmlFor="issue-stock-destination">
                  Destination
                </label>
  
                <select
                  id="issue-stock-destination"
                  value={destinationLocationId}
                  onChange={(event) =>
                    setDestinationLocationId(
                      event.target.value,
                    )
                  }
                  className="issue-stock-control"
                >
                  <option value="">
                    No destination / consumption
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
              </div>
  
              {/* Reason */}
              <div className="issue-stock-field">
                <label htmlFor="issue-stock-reason">
                  Reason <span>*</span>
                </label>
  
                <input
                  id="issue-stock-reason"
                  value={reason}
                  onChange={(event) => {
                    setReason(event.target.value);
                    clearFieldError("reason");
                  }}
                  className={`issue-stock-control ${
                    fieldErrors.reason
                      ? "issue-stock-control-error"
                      : ""
                  }`}
                  placeholder="e.g. Maintenance replacement"
                />
  
                {fieldErrors.reason && (
                  <p className="issue-stock-field-error">
                    Field is required.
                  </p>
                )}
              </div>
            </div>
          </section>
  
          {/* =================================================
              Right Card — References & Asset Links
              ================================================= */}
  
          <section className="issue-stock-card issue-stock-reference-card">
            <div className="issue-stock-card-header">
              <h3>References &amp; Asset Links</h3>
            </div>
  
            <div className="issue-stock-card-fields issue-stock-reference-fields">
              {/* Work Order Reference */}
              <div className="issue-stock-field">
                <label htmlFor="issue-stock-work-order">
                  Work Order Reference
                </label>
  
                <input
                  id="issue-stock-work-order"
                  value={workOrderReference}
                  onChange={(event) =>
                    setWorkOrderReference(
                      event.target.value,
                    )
                  }
                  className="issue-stock-control"
                  placeholder="e.g. WO-2026-001"
                />
              </div>
  
              {/* Asset */}
              <div className="issue-stock-field">
                <label htmlFor="issue-stock-asset">
                  Asset
                </label>
  
                <select
                  id="issue-stock-asset"
                  value={assetId}
                  onChange={(event) =>
                    setAssetId(event.target.value)
                  }
                  className="issue-stock-control"
                >
                  <option value="">
                    Select asset reference
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
                  <p className="issue-stock-helper">
                    Site/customer are derived from the
                    selected asset.
                  </p>
                )}
              </div>
  
              {/* Notes */}
              <div className="issue-stock-field issue-stock-notes-field">
                <label htmlFor="issue-stock-notes">
                  Notes
                </label>
  
                <textarea
                  id="issue-stock-notes"
                  rows={3}
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  className="issue-stock-control issue-stock-textarea"
                  placeholder="Optional issue notes..."
                />
              </div>
            </div>
          </section>
        </div>
  
        {/* Business Rule Error */}
        {submitError && (
          <div className="issue-stock-submit-error">
            {submitError}
          </div>
        )}
      </form>
    </div>
  );
}