"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import {
  getMovements,
  getSpareParts,
  getStockLocations,
} from "@/modules/inventory/service";

import type { StockMovementType } from "@/modules/inventory/types";

export default function MovementHistory() {
  const movements = useMemo(() => getMovements(), []);
  const parts = useMemo(() => getSpareParts(), []);
  const locations = useMemo(() => getStockLocations(), []);

  const [itemId, setItemId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [type, setType] = useState<StockMovementType | "">("");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredMovements = useMemo(() => {
    return movements
      .filter((movement) => {
        const matchesItem =
          !itemId || movement.itemId === itemId;

        const matchesLocation =
          !locationId ||
          movement.sourceLocationId === locationId ||
          movement.destinationLocationId === locationId;

        const matchesType =
          !type || movement.type === type;

        const matchesReason =
          !reason ||
          movement.reason
            .toLowerCase()
            .includes(reason.toLowerCase());

        const matchesFromDate =
          !fromDate || movement.date >= fromDate;

        const matchesToDate =
          !toDate || movement.date <= toDate;

        return (
          matchesItem &&
          matchesLocation &&
          matchesType &&
          matchesReason &&
          matchesFromDate &&
          matchesToDate
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [
    movements,
    itemId,
    locationId,
    type,
    reason,
    fromDate,
    toDate,
  ]);

  function getPart(id: string) {
    return parts.find((part) => part.id === id);
  }

  function getLocation(id?: string) {
    if (!id) {
      return undefined;
    }

    return locations.find((location) => location.id === id);
  }

  function getMovementLabel(
    movementType: StockMovementType,
  ) {
    switch (movementType) {
      case "issue":
        return "Issue";
      case "return":
        return "Return";
      case "adjustment":
        return "Adjustment";
      default:
        return movementType;
    }
  }

  function getMovementBadgeClass(
    movementType: StockMovementType,
  ) {
    switch (movementType) {
      case "issue":
        return "movement-history-type movement-history-type-issue";

      case "return":
        return "movement-history-type movement-history-type-return";

      case "adjustment":
        return "movement-history-type movement-history-type-adjustment";

      default:
        return "movement-history-type movement-history-type-default";
    }
  }

  return (
    <div className="movement-history-page">
    <PageHeader
  eyebrow="Inventory"
  title="Movement History"
  description="Review the append-only history of stock issues, returns, and adjustments."
  secondaryAction={
    <button
      type="button"
      className="asset-refresh-button"
      onClick={() => window.location.reload()}
      aria-label="Refresh movement history"
      title="Refresh movement history"
    >
      ↻
    </button>
  }
/>

      {/* Filters */}
      <section className="movement-history-filters">
        

        <div className="movement-history-filter-grid">
          {/* Spare Part */}
          <div className="movement-history-field">
            <label htmlFor="movement-item">
              Spare Part
            </label>

            <select
              id="movement-item"
              value={itemId}
              onChange={(event) =>
                setItemId(event.target.value)
              }
              className="movement-history-control"
            >
              <option value="">All spare parts</option>

              {parts.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.name} ({part.partCode})
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="movement-history-field">
            <label htmlFor="movement-location">
              Location
            </label>

            <select
              id="movement-location"
              value={locationId}
              onChange={(event) =>
                setLocationId(event.target.value)
              }
              className="movement-history-control"
            >
              <option value="">All locations</option>

              {locations.map((location) => (
                <option
                  key={location.id}
                  value={location.id}
                >
                  {location.name} ({location.code})
                </option>
              ))}
            </select>
          </div>

          {/* Movement Type */}
          <div className="movement-history-field">
            <label htmlFor="movement-type">
              Movement Type
            </label>

            <select
              id="movement-type"
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value as
                    | StockMovementType
                    | "",
                )
              }
              className="movement-history-control"
            >
              <option value="">All types</option>
              <option value="issue">Issue</option>
              <option value="return">Return</option>
              <option value="adjustment">
                Adjustment
              </option>
            </select>
          </div>

          {/* Reason */}
          <div className="movement-history-field">
            <label htmlFor="movement-reason">
              Reason
            </label>

            <input
              id="movement-reason"
              type="search"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              className="movement-history-control"
              placeholder="Search reason..."
            />
          </div>

          {/* Date Range */}
          <div className="movement-history-date-range">
            <div className="movement-history-date-field">
              <label htmlFor="movement-from-date">
                From Date
              </label>

              <input
                id="movement-from-date"
                type="date"
                value={fromDate}
                onChange={(event) =>
                  setFromDate(event.target.value)
                }
                className="movement-history-control"
              />
            </div>

            <div className="movement-history-date-field">
              <label htmlFor="movement-to-date">
                To Date
              </label>

              <input
                id="movement-to-date"
                type="date"
                value={toDate}
                onChange={(event) =>
                  setToDate(event.target.value)
                }
                className="movement-history-control"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stock Movements */}
      <section className="movement-history-table-card">
        <div className="movement-history-table-header">
          <h3>Stock Movements</h3>

          <span className="movement-history-counter">
            {filteredMovements.length}{" "}
            {filteredMovements.length === 1
              ? "movement"
              : "movements"}{" "}
            found. Newest movements appear first.
          </span>
        </div>

        {filteredMovements.length === 0 ? (
          <div className="movement-history-empty">
            <p className="movement-history-empty-title">
              No movements found
            </p>

            <p className="movement-history-empty-description">
              There are no stock movements matching the
              selected filters.
            </p>
          </div>
        ) : (
          <div className="movement-history-table-wrapper">
            <table className="movement-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Item</th>
                  <th>Route</th>
                  <th>Qty</th>
                  <th>Reason</th>
                  <th>References</th>
                </tr>
              </thead>

              <tbody>
                {filteredMovements.map((movement) => {
                  const part = getPart(movement.itemId);
                  const source = getLocation(
                    movement.sourceLocationId,
                  );
                  const destination = getLocation(
                    movement.destinationLocationId,
                  );

                  return (
                    <tr key={movement.id}>
                      {/* Date */}
                      <td className="movement-history-date">
                        {movement.date}
                      </td>

                      {/* Type */}
                      <td>
                        <span
                          className={getMovementBadgeClass(
                            movement.type,
                          )}
                        >
                          {getMovementLabel(
                            movement.type,
                          )}
                        </span>
                      </td>

                      {/* Item */}
                      <td>
                        <div className="movement-history-item">
                          <Link
                            href={`/inventory/spare-parts/${movement.itemId}`}
                            className="movement-history-item-name"
                          >
                            {part?.name ?? "Unknown item"}
                          </Link>

                          <span className="movement-history-item-code">
                            {part?.partCode ?? "—"}
                          </span>
                        </div>
                      </td>

                      {/* Route */}
                      <td>
                        <div className="movement-history-route">
                          {source ? (
                            <Link
                              href={`/inventory/stock-locations/${source.id}`}
                              className="movement-history-route-link"
                            >
                              {source.name}
                            </Link>
                          ) : (
                            <span className="movement-history-route-empty">
                              —
                            </span>
                          )}

                          <span
                            className="movement-history-route-arrow"
                            aria-hidden="true"
                          >
                            →
                          </span>

                          {destination ? (
                            <Link
                              href={`/inventory/stock-locations/${destination.id}`}
                              className="movement-history-route-link"
                            >
                              {destination.name}
                            </Link>
                          ) : (
                            <span className="movement-history-route-empty">
                              —
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Quantity */}
                      <td>
                        <span className="movement-history-quantity">
                          {movement.quantity}
                        </span>
                      </td>

                      {/* Reason */}
                      <td>
                        <div className="movement-history-reason">
                          <span>
                            {movement.reason}
                          </span>

                          {movement.reasonCode && (
                            <span className="movement-history-reason-code">
                              {movement.reasonCode}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* References */}
                      <td>
                        <div className="movement-history-references">
                          {movement.workOrderReference && (
                            <div>
                              <span className="movement-history-reference-label">
                                Work Order:
                              </span>{" "}
                              <span className="movement-history-reference-workorder">
                                {movement.workOrderReference}
                              </span>
                            </div>
                          )}

                          {movement.assetId && (
                            <div>
                              <span className="movement-history-reference-label">
                                Asset:
                              </span>{" "}
                              <Link
                                href={`/assets/${movement.assetId}`}
                                className="movement-history-reference-asset"
                              >
                                {movement.assetId}
                              </Link>
                            </div>
                          )}

                          {movement.technicianName && (
                            <div className="movement-history-reference-muted">
                              Tech: {movement.technicianName}
                            </div>
                          )}

                          {movement.condition && (
                            <div className="movement-history-reference-muted">
                              Condition:{" "}
                              {movement.condition}
                            </div>
                          )}

                          {movement.actorName && (
                            <div className="movement-history-reference-muted">
                              Actor: {movement.actorName}
                            </div>
                          )}

                          {movement.adjustmentDirection && (
                            <div className="movement-history-reference-muted">
                              Direction:{" "}
                              {movement.adjustmentDirection}
                            </div>
                          )}

                          {!movement.workOrderReference &&
                            !movement.assetId &&
                            !movement.technicianName &&
                            !movement.condition &&
                            !movement.actorName &&
                            !movement.adjustmentDirection && (
                              <span className="movement-history-reference-empty">
                                —
                              </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}