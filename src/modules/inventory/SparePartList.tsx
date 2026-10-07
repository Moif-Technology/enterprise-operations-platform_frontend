"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import FormField from "@/components/ui/FormField";
import { Button } from "@/components/ui/design-system";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/States";
import {
  getAllItemStockSummaries,
  getSpareParts,
} from "@/modules/inventory/service";
import type {
  InventoryRecordStatus,
  SparePartItem,
} from "@/modules/inventory/types";

type ListStatus = "loading" | "ready" | "error";

const ITEM_STATUSES: InventoryRecordStatus[] = ["active", "inactive"];

function formatStatusLabel(status: InventoryRecordStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function SparePartList() {
  const router = useRouter();

  const [listStatus, setListStatus] = useState<ListStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [items, setItems] = useState<SparePartItem[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [stockLevel, setStockLevel] = useState("all");

  const loadSpareParts = () => {
    setListStatus("loading");
    setErrorMessage(undefined);

    try {
      setItems(getSpareParts());
      getAllItemStockSummaries();
      setListStatus("ready");
    } catch (error) {
      setListStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The spare parts list could not be loaded.",
      );
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadSpareParts();
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category))).sort();
  }, [items]);

  const stockSummaryByItemId = useMemo(() => {
    return new Map(
      getAllItemStockSummaries().map((summary) => [
        summary.itemId,
        summary,
      ]),
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      if (category !== "all" && item.category !== category) {
        return false;
      }

      if (status !== "all" && item.status !== status) {
        return false;
      }

      const stockSummary = stockSummaryByItemId.get(item.id);
      const quantity = stockSummary?.totalQuantity ?? 0;

      if (stockLevel === "low" && !stockSummary?.isLowStock) {
        return false;
      }

      if (stockLevel === "out" && quantity > 0) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        item.name.toLowerCase().includes(query) ||
        item.partCode.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.manufacturer?.toLowerCase().includes(query) === true ||
        item.manufacturerPartNumber?.toLowerCase().includes(query) === true
      );
    });
  }, [
    items,
    search,
    category,
    status,
    stockLevel,
    stockSummaryByItemId,
  ]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setStockLevel("all");
  };

  return (
    <section className="spare-parts-page">
      <PageHeader
        eyebrow="Inventory"
        title="Spare Parts"
        description="Manage the spare part item master and monitor current stock levels."
        action={
          <Button
            onClick={() => router.push("/inventory/spare-parts/new")}
          >
            <span aria-hidden="true">+</span>
            Add Spare Part
          </Button>
        }
      />

      <section className="spare-parts-filters">
        <div className="spare-parts-filter-grid">
          <div className="spare-parts-search">
            <label htmlFor="spare-part-search">Search</label>

            <div className="spare-parts-search-wrapper">
              <svg
                aria-hidden="true"
                className="spare-parts-search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                id="spare-part-search"
                type="search"
                placeholder="Search name, code, category..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search spare parts"
              />
            </div>
          </div>

          <FormField
            label="Category"
            name="spare-part-filter-category"
            type="select"
            selectProps={{
              value: category,
              onChange: (event) => setCategory(event.target.value),
            }}
          >
            <option value="all">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FormField>

          <FormField
            label="Status"
            name="spare-part-filter-status"
            type="select"
            selectProps={{
              value: status,
              onChange: (event) => setStatus(event.target.value),
            }}
          >
            <option value="all">All statuses</option>

            {ITEM_STATUSES.map((item) => (
              <option key={item} value={item}>
                {formatStatusLabel(item)}
              </option>
            ))}
          </FormField>

          <FormField
            label="Stock Level"
            name="spare-part-filter-stock"
            type="select"
            selectProps={{
              value: stockLevel,
              onChange: (event) => setStockLevel(event.target.value),
            }}
          >
            <option value="all">All stock levels</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </FormField>

          <button
            type="button"
            className="spare-parts-clear-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </section>

      {listStatus === "loading" && (
        <LoadingState message="Loading spare parts..." />
      )}

      {listStatus === "error" && (
        <ErrorState
          title="Unable to load spare parts"
          message={
            errorMessage ??
            "The sample spare parts data could not be loaded."
          }
          onRetry={loadSpareParts}
        />
      )}

      {listStatus === "ready" && items.length === 0 && (
        <EmptyState
          title="No spare parts yet"
          description="Add the first spare part to start the item master."
          actionLabel="Add Spare Part"
          onAction={() =>
            router.push("/inventory/spare-parts/new")
          }
        />
      )}

      {listStatus === "ready" &&
        items.length > 0 &&
        filteredItems.length === 0 && (
          <EmptyState
            title="No matching spare parts"
            description="No spare parts match the current search and filters."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        )}

      {listStatus === "ready" && filteredItems.length > 0 && (
        <section className="spare-parts-table-card">
          <div className="spare-parts-table-wrapper">
            <table className="spare-parts-table">
              <thead>
                <tr>
                  <th>Part Code</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>On Hand</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => {
                  const stockSummary =
                    stockSummaryByItemId.get(item.id);

                  const quantity =
                    stockSummary?.totalQuantity ?? 0;

                  const isOutOfStock = quantity <= 0;

                  return (
                    <tr key={item.id}>
                      <td>
                        <span className="spare-parts-code">
                          {item.partCode}
                        </span>
                      </td>

                      <td>
                        <Link
                          href={`/inventory/spare-parts/${item.id}`}
                          className="spare-parts-name"
                        >
                          {item.name}
                        </Link>
                      </td>

                      <td>
                        <span className="spare-parts-category">
                          {item.category}
                        </span>
                      </td>

                      <td>
                        <span className="spare-parts-unit">
                          {item.unitOfMeasure}
                        </span>
                      </td>

                      <td>
                        <div className="spare-parts-stock">
                          <span className="spare-parts-quantity">
                            {quantity}
                          </span>

                          {isOutOfStock && (
                            <span className="spare-parts-out-badge">
                              Out
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className="spare-parts-reorder">
                          {item.reorderLevel}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            item.status === "active"
                              ? "spare-parts-status spare-parts-status-active"
                              : "spare-parts-status spare-parts-status-inactive"
                          }
                        >
                          {formatStatusLabel(item.status)}
                        </span>
                      </td>

                      <td>
                        <div className="spare-parts-actions">
                          <Link
                            href={`/inventory/spare-parts/${item.id}`}
                            className="spare-parts-icon-button"
                            aria-label={`View ${item.name}`}
                            title="View"
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                              <circle cx="12" cy="12" r="2.5" />
                            </svg>
                          </Link>

                          <Link
                            href={`/inventory/spare-parts/${item.id}/edit`}
                            className="spare-parts-icon-button"
                            aria-label={`Edit ${item.name}`}
                            title="Edit"
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                            
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}