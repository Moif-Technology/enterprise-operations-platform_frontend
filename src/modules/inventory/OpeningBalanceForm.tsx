"use client";

import { FormEvent, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";

import {
  getSpareParts,
  getStockLocations,
  saveOpeningBalance,
} from "@/modules/inventory/service";

type FieldErrors = {
  itemId?: boolean;
  locationId?: boolean;
  quantity?: boolean;
};

export default function OpeningBalanceForm() {
  const router = useRouter();

  const parts = useMemo(() => getSpareParts(), []);
  const locations = useMemo(() => getStockLocations(), []);

  const [itemId, setItemId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [submitError, setSubmitError] = useState("");

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

    if (!locationId) {
      errors.locationId = true;
    }

    if (
      !quantity ||
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      errors.quantity = true;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

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
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to save the opening balance.",
      );
    }
  }

  function handleCancel() {
    router.push("/inventory/stock-overview");
  }

  return (
    <div className="opening-balance-page">
      <PageHeader
        eyebrow="Inventory"
        title="Add Opening Balance"
        description="Seed the initial stock quantity for a spare part at a stock location."
        action={
          <div className="opening-balance-header-actions">
            <button
              type="button"
              className="opening-balance-cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              form="opening-balance-form"
              className="opening-balance-save-button"
            >
              Save Opening Balance
            </button>
          </div>
        }
      />

      <form
        id="opening-balance-form"
        onSubmit={handleSubmit}
        className="opening-balance-form-card"
      >
        <div className="opening-balance-card-header">
          <h3>Opening Balance Details</h3>
        </div>

        <div className="opening-balance-info">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path
              strokeLinecap="round"
              d="M12 10v6"
            />
            <path
              strokeLinecap="round"
              d="M12 7h.01"
            />
          </svg>

          <span>
            Opening balances serve as the initial baseline
            starting point for derived stock quantities and
            audit movements.
          </span>
        </div>

        {submitError && (
          <div className="opening-balance-submit-error">
            {submitError}
          </div>
        )}

        <div className="opening-balance-fields">
          {/* Spare Part */}
          <div className="opening-balance-field">
            <label htmlFor="opening-balance-item">
              Spare Part <span>*</span>
            </label>

            <select
              id="opening-balance-item"
              value={itemId}
              onChange={(event) => {
                setItemId(event.target.value);
                clearFieldError("itemId");
              }}
              className={`opening-balance-control ${
                fieldErrors.itemId
                  ? "opening-balance-control-error"
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
              <p className="opening-balance-field-error">
                Field is required.
              </p>
            )}
          </div>

          {/* Stock Location */}
          <div className="opening-balance-field">
            <label htmlFor="opening-balance-location">
              Stock Location <span>*</span>
            </label>

            <select
              id="opening-balance-location"
              value={locationId}
              onChange={(event) => {
                setLocationId(event.target.value);
                clearFieldError("locationId");
              }}
              className={`opening-balance-control ${
                fieldErrors.locationId
                  ? "opening-balance-control-error"
                  : ""
              }`}
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

            {fieldErrors.locationId && (
              <p className="opening-balance-field-error">
                Field is required.
              </p>
            )}
          </div>

          {/* Opening Quantity */}
          <div className="opening-balance-field">
            <label htmlFor="opening-balance-quantity">
              Opening Quantity <span>*</span>
            </label>

            <input
              id="opening-balance-quantity"
              type="number"
              min="0.01"
              step="any"
              value={quantity}
              onChange={(event) => {
                setQuantity(event.target.value);
                clearFieldError("quantity");
              }}
              className={`opening-balance-control ${
                fieldErrors.quantity
                  ? "opening-balance-control-error"
                  : ""
              }`}
              placeholder="e.g. 10"
            />

            {fieldErrors.quantity && (
              <p className="opening-balance-field-error">
                Field is required.
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="opening-balance-field opening-balance-field-wide">
            <label htmlFor="opening-balance-notes">
              Notes
            </label>

            <textarea
              id="opening-balance-notes"
              rows={3}
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              className="opening-balance-control opening-balance-textarea"
              placeholder="Optional notes about this opening balance adjustment..."
            />
          </div>
        </div>
      </form>
    </div>
  );
}