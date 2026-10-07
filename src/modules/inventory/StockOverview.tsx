"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import {
  getAllItemStockSummaries,
  getSpareParts,
  getStockBalances,
  getStockLocations,
} from "@/modules/inventory/service";

import type {
  SparePartItem,
  StockBalance,
  StockLocation,
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
      Array.from(new Set(parts.map((part) => part.category))).sort(),
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
    <div className="stock-overview-page">
    <PageHeader
  eyebrow="Inventory"
  title="Stock Overview"
  description="View derived stock quantities across warehouses and technician locations."
  action={
    <div className="stock-overview-header-actions">
    <div className="stock-overview-header-actions">
  <Link
    href="/inventory/opening-balances/new"
    className="stock-overview-action-button"
  >
    + Add Opening Balance
  </Link>

  <Link
    href="/inventory/issues/new"
    className="stock-overview-action-button"
  >
    − Issue Stock
  </Link>

  <Link
    href="/inventory/returns/new"
    className="stock-overview-action-button"
  >
    ↩ Return Stock
  </Link>

  <Link
    href="/inventory/adjustments/new"
    className="stock-overview-action-button stock-overview-action-primary"
  >
    ⚙ Adjust Stock
  </Link>
</div>
    </div>
  }
/>

      {/* KPI Cards */}
      <section className="stock-overview-kpis">
        <div className="stock-overview-kpi-card">
          <div>
            <p className="stock-overview-kpi-label">
              Total SKUs Tracked
            </p>
            <p className="stock-overview-kpi-value">
              {summaries.length}
            </p>
          </div>

          <div className="stock-overview-kpi-icon stock-overview-kpi-icon-neutral">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="m4 7.5 8 4.5 8-4.5M12 12v9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="stock-overview-kpi-card stock-overview-kpi-card-warning">
          <div>
            <p className="stock-overview-kpi-label">
              Low Stock Items
            </p>
            <p className="stock-overview-kpi-value stock-overview-kpi-value-warning">
              {lowStockItems.length}
            </p>
          </div>

          <div className="stock-overview-kpi-icon stock-overview-kpi-icon-warning">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 3 2.8 20h18.4L12 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M12 9v5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="17"
                r="1"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <div className="stock-overview-kpi-card stock-overview-kpi-card-danger">
          <div>
            <p className="stock-overview-kpi-label">
              Out of Stock Items
            </p>
            <p className="stock-overview-kpi-value stock-overview-kpi-value-danger">
              {outOfStockItems.length}
            </p>
          </div>

          <div className="stock-overview-kpi-icon stock-overview-kpi-icon-danger">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 8v5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="16.5"
                r="1"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="stock-overview-filter-card">
        <div className="stock-overview-filter-row">
          <div className="stock-overview-search">
            <svg
              className="stock-overview-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="m16 16 4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search part code or name..."
              aria-label="Search part code or name"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="stock-overview-filter-control"
            aria-label="Filter by category"
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
            className="stock-overview-filter-control"
            aria-label="Filter by location"
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
            className="stock-overview-filter-control"
            aria-label="Filter by location type"
          >
            <option value="">All Location Types</option>
            <option value="warehouse">Warehouse</option>
            <option value="technician">Technician</option>
          </select>

          <label className="stock-overview-toggle">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(event) =>
                setLowStockOnly(event.target.checked)
              }
            />
            <span className="stock-overview-toggle-track">
              <span className="stock-overview-toggle-thumb" />
            </span>
            <span>Show low-stock items only</span>
          </label>
        </div>
      </section>

      {/* Stock by Location */}
      <section className="stock-overview-table-card">
        <div className="stock-overview-table-header">
          <h3>Stock by Location</h3>

          <span className="stock-overview-record-count">
            {filteredBalances.length} stock record
            {filteredBalances.length === 1 ? "" : "s"} found.
          </span>
        </div>

        {filteredBalances.length === 0 ? (
          <div className="stock-overview-empty">
            No stock records match the current filters.
          </div>
        ) : (
          <div className="stock-overview-table-wrapper">
            <table className="stock-overview-table">
              <thead>
                <tr>
                  <th>Spare Part</th>
                  <th>Part Code</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th className="stock-overview-number-header">
                    On Hand
                  </th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
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
                    <tr
                      key={`${balance.itemId}-${balance.locationId}`}
                    >
                      <td>
                        <a
                          href={`/inventory/spare-parts/${balance.itemId}`}
                          className="stock-overview-part-link"
                        >
                          {part.name}
                        </a>
                      </td>

                      <td>
                        <span className="stock-overview-part-code">
                          {part.partCode}
                        </span>
                      </td>

                      <td>
                        <span className="stock-overview-category">
                          {part.category}
                        </span>
                      </td>

                      <td>
                        <span className="stock-overview-location">
                          {location.name}
                        </span>
                      </td>

                      <td>
                        <span className="stock-overview-location-type">
                          {location.type === "warehouse"
                            ? "Warehouse"
                            : "Technician"}
                        </span>
                      </td>

                      <td className="stock-overview-number">
                        {balance.quantity}
                      </td>

                      <td>
                        {summary.isOutOfStock ? (
                          <span className="stock-overview-status stock-overview-status-danger">
                            Out of Stock
                          </span>
                        ) : summary.isLowStock ? (
                          <span className="stock-overview-status stock-overview-status-warning">
                            Low Stock
                          </span>
                        ) : (
                          <span className="stock-overview-status stock-overview-status-success">
                            Healthy
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Item Totals */}
      <section className="stock-overview-table-card stock-overview-item-totals">
        <div className="stock-overview-item-totals-header">
          <h3>Item Totals</h3>
          <p>Totals are derived across all stock locations.</p>
        </div>

        <div className="stock-overview-table-wrapper">
          <table className="stock-overview-table">
            <thead>
              <tr>
                <th>Spare Part</th>
                <th>Part Code</th>
                <th>Category</th>
                <th className="stock-overview-number-header">
                  Total On Hand
                </th>
                <th className="stock-overview-number-header">
                  Damaged
                </th>
                <th className="stock-overview-number-header">
                  Reorder Level
                </th>
              </tr>
            </thead>

            <tbody>
              {summaries.map((summary) => {
                const part = parts.find(
                  (item) => item.id === summary.itemId,
                );

                if (!part) {
                  return null;
                }

                return (
                  <tr key={summary.itemId}>
                    <td>
                      <a
                        href={`/inventory/spare-parts/${summary.itemId}`}
                        className="stock-overview-part-link"
                      >
                        {part.name}
                      </a>
                    </td>

                    <td>
                      <span className="stock-overview-part-code">
                        {part.partCode}
                      </span>
                    </td>

                    <td>
                      <span className="stock-overview-category">
                        {part.category}
                      </span>
                    </td>

                    <td className="stock-overview-number">
                      {summary.totalQuantity}
                    </td>

                    <td className="stock-overview-number stock-overview-number-muted">
                      {summary.damagedQuantity}
                    </td>

                    <td className="stock-overview-number stock-overview-number-muted">
                      {summary.reorderLevel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}