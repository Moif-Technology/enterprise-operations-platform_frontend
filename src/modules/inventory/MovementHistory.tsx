"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import { EmptyState, Panel } from "@/components/ui/design-system";
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
    return movements.filter((movement) => {
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
    });
  }, [
    movements,
    itemId,
    locationId,
    type,
    reason,
    fromDate,
    toDate,
  ]);

  function getPartName(id: string) {
    return (
      parts.find((part) => part.id === id)?.name ??
      "Unknown item"
    );
  }

  function getPartCode(id: string) {
    return (
      parts.find((part) => part.id === id)?.partCode ??
      "—"
    );
  }

  function getLocationName(id?: string) {
    if (!id) {
      return "—";
    }

    return (
      locations.find((location) => location.id === id)
        ?.name ?? "Unknown location"
    );
  }

  function getMovementLabel(movementType: StockMovementType) {
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
        return "bg-red-50 text-red-700 border-red-200";
      case "return":
        return "bg-green-50 text-green-700 border-green-200";
      case "adjustment":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title="Movement History"
        description="Review the append-only history of stock issues, returns, and adjustments."
      />

      <Panel
        title="Filters"
        description="Filter stock movements by item, location, type, reason, or date range."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#162033]">
              Spare Part
            </label>

            <select
              value={itemId}
              onChange={(event) =>
                setItemId(event.target.value)
              }
              className="input w-full"
            >
              <option value="">All spare parts</option>

              {parts.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.name} ({part.partCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#162033]">
              Location
            </label>

            <select
              value={locationId}
              onChange={(event) =>
                setLocationId(event.target.value)
              }
              className="input w-full"
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

          <div>
            <label className="mb-2 block text-sm font-medium text-[#162033]">
              Movement Type
            </label>

            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value as
                    | StockMovementType
                    | "",
                )
              }
              className="input w-full"
            >
              <option value="">All types</option>
              <option value="issue">Issue</option>
              <option value="return">Return</option>
              <option value="adjustment">
                Adjustment
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#162033]">
              Reason
            </label>

            <input
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              className="input w-full"
              placeholder="Search reason"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#162033]">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(event) =>
                setFromDate(event.target.value)
              }
              className="input w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#162033]">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(event) =>
                setToDate(event.target.value)
              }
              className="input w-full"
            />
          </div>
        </div>
      </Panel>

      <Panel
        title="Stock Movements"
        description={`${filteredMovements.length} movement${
          filteredMovements.length === 1 ? "" : "s"
        } found. Newest movements appear first.`}
      >
        {filteredMovements.length === 0 ? (
        <div className="rounded-md border border-[#dfe4ea] bg-white px-6 py-10 text-center">
        <p className="text-sm font-medium text-[#162033]">
          No movements found
        </p>
      
        <p className="mt-1 text-sm text-[#647086]">
          There are no stock movements matching the selected filters.
        </p>
      </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-[#dfe4ea] text-sm text-[#647086]">
                  <th className="px-4 py-3 font-medium">
                    Date
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Type
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Item
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Source
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Destination
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Quantity
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Reason
                  </th>

                  <th className="px-4 py-3 font-medium">
                    References
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredMovements.map((movement) => (
                  <tr
                    key={movement.id}
                    className="border-b border-[#eef1f4] last:border-b-0"
                  >
                    <td className="px-4 py-4 text-sm text-[#162033]">
                      {movement.date}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getMovementBadgeClass(
                          movement.type,
                        )}`}
                      >
                        {getMovementLabel(
                          movement.type,
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-4">
  <Link
    href={`/inventory/spare-parts/${movement.itemId}`}
    className="text-sm font-medium text-[#0f766e] hover:underline"
  >
    {getPartName(movement.itemId)}
  </Link>

  <div className="text-xs text-[#647086]">
    {getPartCode(movement.itemId)}
  </div>
</td>

<td className="px-4 py-4 text-sm">
  {movement.sourceLocationId ? (
    <Link
      href={`/inventory/stock-locations/${movement.sourceLocationId}`}
      className="text-[#0f766e] hover:underline"
    >
      {getLocationName(movement.sourceLocationId)}
    </Link>
  ) : (
    "—"
  )}
</td>
<td className="px-4 py-4 text-sm">
  {movement.destinationLocationId ? (
    <Link
      href={`/inventory/stock-locations/${movement.destinationLocationId}`}
      className="text-[#0f766e] hover:underline"
    >
      {getLocationName(
        movement.destinationLocationId,
      )}
    </Link>
  ) : (
    "—"
  )}
</td>

                    <td className="px-4 py-4 text-sm font-medium text-[#162033]">
                      {movement.quantity}
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-sm text-[#162033]">
                        {movement.reason}
                      </div>

                      {movement.reasonCode && (
                        <div className="text-xs text-[#647086]">
                          {movement.reasonCode}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1 text-xs text-[#647086]">
                        {movement.workOrderReference && (
                          <div>
                            WO:{" "}
                            {movement.workOrderReference}
                          </div>
                        )}

{movement.assetId && (
  <div>
    Asset:{" "}
    <Link
      href={`/assets/${movement.assetId}`}
      className="text-[#0f766e] hover:underline"
    >
      {movement.assetId}
    </Link>
  </div>
)}

                        {movement.technicianName && (
                          <div>
                            Technician:{" "}
                            {movement.technicianName}
                          </div>
                        )}

                        {movement.actorName && (
                          <div>
                            Actor:{" "}
                            {movement.actorName}
                          </div>
                        )}

                        {movement.condition && (
                          <div>
                            Condition:{" "}
                            {movement.condition}
                          </div>
                        )}

                        {movement.adjustmentDirection && (
                          <div>
                            Direction:{" "}
                            {movement.adjustmentDirection}
                          </div>
                        )}

                        {!movement.workOrderReference &&
                          !movement.assetId &&
                          !movement.technicianName &&
                          !movement.actorName &&
                          !movement.condition &&
                          !movement.adjustmentDirection && (
                            <span>—</span>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}