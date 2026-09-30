"use client";

import { useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import { Badge, Panel } from "@/components/ui/design-system";
import {
  getAllItemStockSummaries,
  getSpareParts,
  getStockBalances,
  getStockLocations,
} from "@/modules/inventory/service";
import type {
  SparePartItem,
  StockLocation,
  StockBalance,
} from "@/modules/inventory/types";

export default function StockOverview() {
  const [parts, setParts] = useState<SparePartItem[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [balances, setBalances] = useState<StockBalance[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locationType, setLocationType] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => {
    setParts(getSpareParts());
    setLocations(getStockLocations());
    setBalances(getStockBalances());
  }, []);

  const summaries = useMemo(
    () => getAllItemStockSummaries(),
    [parts, balances],
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(parts.map((part) => part.category)),
      ).sort(),
    [parts],
  );

  const filteredBalances = useMemo(() => {
    const query = search.trim().toLowerCase();

    return balances.filter((balance) => {
      const part = parts.find((item) => item.id === balance.itemId);
      const location = locations.find(
        (item) => item.id === balance.locationId,
      );
      const summary = summaries.find(
        (item) => item.itemId === balance.itemId,
      );

      if (!part || !location || !summary) {
        return false;
      }

      const matchesSearch =
        !query ||
        part.name.toLowerCase().includes(query) ||
        part.partCode.toLowerCase().includes(query);

      const matchesCategory =
        !category || part.category === category;

      const matchesLocation =
        !locationId || location.id === locationId;

      const matchesLocationType =
        !locationType || location.type === locationType;

      const matchesLowStock =
        !lowStockOnly || summary.isLowStock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesLocationType &&
        matchesLowStock
      );
    });
  }, [
    balances,
    parts,
    locations,
    summaries,
    search,
    category,
    locationId,
    locationType,
    lowStockOnly,
  ]);

  const outOfStockItems = summaries.filter(
    (summary) => summary.isOutOfStock,
  );

  const lowStockItems = summaries.filter(
    (summary) =>
      summary.isLowStock && !summary.isOutOfStock,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Overview"
        description="View derived stock quantities across warehouses and technician locations."
      />

      <Panel
        title="Stock status"
        description="Low stock means total quantity is at or below the reorder level."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#dfe4ea] bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
              Out of stock
            </p>

            <p className="mt-1 text-2xl font-semibold text-[#b91c1c]">
              {outOfStockItems.length}
            </p>
          </div>

          <div className="rounded-lg border border-[#dfe4ea] bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
              Low stock
            </p>

            <p className="mt-1 text-2xl font-semibold text-[#b45309]">
              {lowStockItems.length}
            </p>
          </div>
        </div>
      </Panel>
      {outOfStockItems.length > 0 && (
        <Panel
          title="Out of stock"
          description="Items with zero total quantity are shown separately from other low-stock items."
        >
          <div className="table-shell overflow-x-auto">
            <div
              className="table-head"
              style={{
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                minWidth: 650,
              }}
            >
              <span>Spare part</span>
              <span>Part code</span>
              <span>Category</span>
              <span>Reorder level</span>
            </div>

            {outOfStockItems.map((summary) => {
              const part = parts.find(
                (item) => item.id === summary.itemId,
              );

              if (!part) {
                return null;
              }

              return (
                <div
                  key={summary.itemId}
                  className="table-row"
                  style={{
                    gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                    minWidth: 650,
                  }}
                >
                  <span className="font-medium text-[#162033]">
                    {part.name}
                  </span>

                  <span>{part.partCode}</span>

                  <span>{part.category}</span>

                  <span>{summary.reorderLevel}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
      <Panel
        title="Filters"
        description="Filter the derived stock view by item, category, location, or stock status."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search part code or name..."
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="input"
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={locationId}
            onChange={(event) => setLocationId(event.target.value)}
            className="input"
          >
            <option value="">All Locations</option>

            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>

          <select
            value={locationType}
            onChange={(event) =>
              setLocationType(event.target.value)
            }
            className="input"
          >
            <option value="">All Location Types</option>
            <option value="warehouse">Warehouse</option>
            <option value="technician">Technician</option>
          </select>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-[#162033]">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(event) =>
              setLowStockOnly(event.target.checked)
            }
          />

          Show low-stock items only
        </label>
      </Panel>

      <Panel
        title="Stock by location"
        description={`${filteredBalances.length} stock record${
          filteredBalances.length === 1 ? "" : "s"
        } found.`}
      >
        {filteredBalances.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#647086]">
            No stock records match the current filters.
          </div>
        ) : (
          <div className="table-shell overflow-x-auto">
            <div
              className="table-head"
              style={{
                gridTemplateColumns:
                  "1.3fr 1fr 1fr 1fr 0.8fr 0.8fr 1fr",
                minWidth: 1000,
              }}
            >
              <span>Spare part</span>
              <span>Part code</span>
              <span>Category</span>
              <span>Location</span>
              <span>Type</span>
              <span>On hand</span>
              <span>Status</span>
            </div>

            {filteredBalances.map((balance) => {
              const part = parts.find(
                (item) => item.id === balance.itemId,
              );

              const location = locations.find(
                (item) => item.id === balance.locationId,
              );

              const summary = summaries.find(
                (item) => item.itemId === balance.itemId,
              );

              if (!part || !location || !summary) {
                return null;
              }

              return (
                <div
                  key={`${balance.itemId}-${balance.locationId}`}
                  className="table-row"
                  style={{
                    gridTemplateColumns:
                      "1.3fr 1fr 1fr 1fr 0.8fr 0.8fr 1fr",
                    minWidth: 1000,
                  }}
                >
                  <span className="font-medium text-[#162033]">
                    {part.name}
                  </span>

                  <span>{part.partCode}</span>

                  <span>{part.category}</span>

                  <span>{location.name}</span>

                  <span>
                    {location.type === "warehouse"
                      ? "Warehouse"
                      : "Technician"}
                  </span>

                  <span>{balance.quantity}</span>

                  <span>
                    {summary.isOutOfStock ? (
                      <Badge tone="danger">Out of stock</Badge>
                    ) : summary.isLowStock ? (
                      <Badge tone="warning">Low stock</Badge>
                    ) : (
                      <Badge tone="success">Healthy</Badge>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel
        title="Item totals"
        description="Totals are derived across all stock locations."
      >
        <div className="table-shell overflow-x-auto">
          <div
            className="table-head"
            style={{
              gridTemplateColumns:
                "1.4fr 1fr 1fr 0.8fr 0.8fr 1fr",
              minWidth: 850,
            }}
          >
            <span>Spare part</span>
            <span>Part code</span>
            <span>Category</span>
            <span>Total</span>
            <span>Damaged</span>
            <span>Reorder level</span>
          </div>

          {summaries.map((summary) => {
            const part = parts.find(
              (item) => item.id === summary.itemId,
            );

            if (!part) {
              return null;
            }

            return (
              <div
                key={summary.itemId}
                className="table-row"
                style={{
                  gridTemplateColumns:
                    "1.4fr 1fr 1fr 0.8fr 0.8fr 1fr",
                  minWidth: 850,
                }}
              >
                <span className="font-medium text-[#162033]">
                  {part.name}
                </span>

                <span>{part.partCode}</span>

                <span>{part.category}</span>

                <span>{summary.totalQuantity}</span>

                <span>{summary.damagedQuantity}</span>

                <span>{summary.reorderLevel}</span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}