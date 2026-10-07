"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import {
  getAllItemStockSummaries,
  getSpareParts,
} from "@/modules/inventory/service";

export default function LowStockList() {
  const parts = useMemo(() => getSpareParts(), []);
  const summaries = useMemo(
    () => getAllItemStockSummaries(),
    [],
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = useMemo(
    () =>
      Array.from(
        new Set(parts.map((part) => part.category)),
      ).sort(),
    [parts],
  );

  const lowStockItems = useMemo(() => {
    return parts
      .map((part) => {
        const summary = summaries.find(
          (item) => item.itemId === part.id,
        );

        return {
          part,
          summary,
        };
      })
      .filter(({ part, summary }) => {
        if (!summary || !summary.isLowStock) {
          return false;
        }

        const searchValue = search.toLowerCase();

        const matchesSearch =
          !search ||
          part.name.toLowerCase().includes(searchValue) ||
          part.partCode.toLowerCase().includes(searchValue);

        const matchesCategory =
          !category || part.category === category;

        return matchesSearch && matchesCategory;
      });
  }, [parts, summaries, search, category]);

  const outOfStockItems = lowStockItems.filter(
    ({ summary }) => summary?.isOutOfStock,
  );

  const reorderItems = lowStockItems.filter(
    ({ summary }) => !summary?.isOutOfStock,
  );

  return (
    <div className="low-stock-page">
      <PageHeader
        eyebrow="Inventory"
        title="Low Stock & Reorder"
        description="Review spare parts at or below their reorder level and see the quantity needed to reach that level."
      />

      {/* KPI Summary */}
      <div className="low-stock-kpi-grid">
        <div className="low-stock-kpi-card">
          <div>
            <p className="low-stock-kpi-label">
              Out of Stock
            </p>

            <p className="low-stock-kpi-value low-stock-kpi-value-danger">
              {outOfStockItems.length}
            </p>

            <p className="low-stock-kpi-subtext">
              Items with zero total stock.
            </p>
          </div>

          <div className="low-stock-kpi-icon low-stock-kpi-icon-danger">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.3 3.7 2.8 17a2 2 0 0 0 1.75 3h14.9a2 2 0 0 0 1.75-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>
        </div>

        <div className="low-stock-kpi-card">
          <div>
            <p className="low-stock-kpi-label">
              At or Below Reorder Level
            </p>

            <p className="low-stock-kpi-value low-stock-kpi-value-warning">
              {reorderItems.length}
            </p>

            <p className="low-stock-kpi-subtext">
              Items requiring stock attention.
            </p>
          </div>

          <div className="low-stock-kpi-icon low-stock-kpi-icon-warning">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v18m9-9H3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="low-stock-filter-card">
        <div className="low-stock-filter-header">
          <h3>Filters</h3>

          <p>
            Filter low-stock items by part or category.
          </p>
        </div>

        <div className="low-stock-filter-controls">
          <div className="low-stock-search">
            <svg
              className="low-stock-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path
                strokeLinecap="round"
                d="m20 20-4-4"
              />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search part name or code..."
              aria-label="Search part name or code"
            />
          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="low-stock-category-select"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>

            {categories.map((itemCategory) => (
              <option
                key={itemCategory}
                value={itemCategory}
              >
                {itemCategory}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Out of Stock */}
      <section className="low-stock-table-card low-stock-table-card-critical">
        <div className="low-stock-table-header low-stock-table-header-critical">
          <div>
            <h3>
              <span className="low-stock-critical-dot" />
              Out of Stock
            </h3>

            <p>
              These items currently have zero total stock.
            </p>
          </div>

          <span className="low-stock-count-badge low-stock-count-badge-critical">
            {outOfStockItems.length}
          </span>
        </div>

        {outOfStockItems.length === 0 ? (
          <div className="low-stock-empty low-stock-empty-critical">
            <p className="low-stock-empty-title">
              No items are out of stock.
            </p>

            <p className="low-stock-empty-description">
              All spare parts currently have available
              stock.
            </p>
          </div>
        ) : (
          <StockTable
            items={outOfStockItems}
            critical
          />
        )}
      </section>

      {/* Reorder Required */}
      <section className="low-stock-table-card">
        <div className="low-stock-table-header">
          <div>
            <h3>Reorder Required</h3>

            <p>
              These items are above zero stock but at or
              below their reorder level.
            </p>
          </div>

          <span className="low-stock-count-badge">
            {reorderItems.length}
          </span>
        </div>

        {reorderItems.length === 0 ? (
          <div className="low-stock-empty low-stock-empty-reorder">
            <p className="low-stock-empty-title">
              No additional reorder attention is required.
            </p>

            <p className="low-stock-empty-description">
              All other stock items are currently above
              their reorder thresholds.
            </p>
          </div>
        ) : (
          <StockTable items={reorderItems} />
        )}
      </section>
    </div>
  );
}

type StockTableItem = {
  part: ReturnType<typeof getSpareParts>[number];
  summary:
    | ReturnType<typeof getAllItemStockSummaries>[number]
    | undefined;
};

function StockTable({
  items,
  critical = false,
}: {
  items: StockTableItem[];
  critical?: boolean;
}) {
  return (
    <div className="low-stock-table-wrapper">
      <table className="low-stock-table">
        <thead>
          <tr>
            <th>Part</th>
            <th>Category</th>
            <th>Current Stock</th>
            <th>Reorder Level</th>
            <th>Suggested Reorder</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map(({ part, summary }) => (
            <tr key={part.id}>
              {/* Part */}
              <td>
                <div className="low-stock-part">
                  <Link
                    href={`/inventory/spare-parts/${part.id}`}
                    className="low-stock-part-name"
                  >
                    {part.name}
                  </Link>

                  <span className="low-stock-part-code">
                    {part.partCode}
                  </span>
                </div>
              </td>

              {/* Category */}
              <td>
                <span className="low-stock-category">
                  {part.category}
                </span>
              </td>

              {/* Current Stock */}
              <td>
                <span
                  className={
                    critical
                      ? "low-stock-current low-stock-current-critical"
                      : "low-stock-current"
                  }
                >
                  {summary?.totalQuantity ?? 0}{" "}
                  {part.unitOfMeasure}
                </span>
              </td>

              {/* Reorder Level */}
              <td>
                <span className="low-stock-reorder-level">
                  {summary?.reorderLevel ?? 0}{" "}
                  {part.unitOfMeasure}
                </span>
              </td>

              {/* Suggested Reorder */}
              <td>
                <span className="low-stock-suggested">
                  {summary?.reorderSuggestionQuantity ?? 0}{" "}
                  {part.unitOfMeasure}
                </span>
              </td>

              {/* Status */}
              <td>
                {summary?.isOutOfStock ? (
                  <span className="low-stock-status low-stock-status-critical">
                    Out of stock
                  </span>
                ) : (
                  <span className="low-stock-status low-stock-status-warning">
                    Low stock
                  </span>
                )}
              </td>

              {/* Actions */}
              <td>
                <button
                  type="button"
                  className="low-stock-reorder-button"
                  onClick={() => {
                    // Reorder workflow can be connected here
                    // when procurement/reorder functionality is available.
                  }}
                >
                  + Reorder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}