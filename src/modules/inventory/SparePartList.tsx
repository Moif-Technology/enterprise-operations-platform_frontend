"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import SearchInput from "@/components/ui/SearchInput";
import FormField from "@/components/ui/FormField";
import { Badge, Button, Panel } from "@/components/ui/design-system";
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

const TABLE_COLUMNS = "1fr 1.4fr 1fr 0.9fr 0.8fr 0.8fr 0.9fr 0.8fr";

function statusTone(
  status: InventoryRecordStatus,
): "neutral" | "success" | "warning" | "danger" | "info" {
  return status === "active" ? "success" : "neutral";
}

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
  const [lowStockOnly, setLowStockOnly] = useState(false);

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
    return Array.from(
      new Set(items.map((item) => item.category)),
    ).sort();
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

      if (lowStockOnly && !stockSummary?.isLowStock) {
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
    lowStockOnly,
    stockSummaryByItemId,
  ]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setLowStockOnly(false);
  };

  const openItem = (itemId: string) => {
    router.push(`/inventory/spare-parts/${itemId}`);
  };

  return (
    <section>
      <PageHeader
        eyebrow="Inventory"
        title="Spare parts"
        description="Search and filter spare parts by code, category, status, and stock level."
        action={
          <Button onClick={() => router.push("/inventory/spare-parts/new")}>
            Add Spare Part
          </Button>
        }
      />

      <Panel
        title="Spare parts"
        description="Manage the spare part item master and monitor current stock levels."
      >
        <FilterBar
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          }
        >
          <SearchInput
            id="spare-part-search"
            label="Search"
            placeholder="Search name, code, category, or manufacturer..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search spare parts by name, code, category, or manufacturer"
          />

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
            label="Stock"
            name="spare-part-filter-stock"
            type="select"
            selectProps={{
              value: lowStockOnly ? "low" : "all",
              onChange: (event) =>
                setLowStockOnly(event.target.value === "low"),
            }}
          >
            <option value="all">All stock levels</option>
            <option value="low">Low stock only</option>
          </FormField>
        </FilterBar>

        <div style={{ marginTop: 16 }}>
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
            <div
              className="table-shell"
              style={{ overflowX: "auto" }}
            >
              <div
                className="table-head"
                style={{
                  gridTemplateColumns: TABLE_COLUMNS,
                  minWidth: 900,
                }}
              >
                <span>Part code</span>
                <span>Name</span>
                <span>Category</span>
                <span>Unit</span>
                <span>On hand</span>
                <span>Reorder level</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {filteredItems.map((item) => {
                const stockSummary = stockSummaryByItemId.get(item.id);

                return (
                  <div
                    key={item.id}
                    className="table-row"
                    role="link"
                    tabIndex={0}
                    style={{
                      gridTemplateColumns: TABLE_COLUMNS,
                      minWidth: 900,
                      cursor: "pointer",
                    }}
                    onClick={() => openItem(item.id)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        openItem(item.id);
                      }
                    }}
                    aria-label={`View details for ${item.name}`}
                  >
                    <span>{item.partCode}</span>
                    <span>{item.name}</span>
                    <span>{item.category}</span>
                    <span>{item.unitOfMeasure}</span>

                    <span>
                      {stockSummary?.totalQuantity ?? 0}
                      {stockSummary?.isOutOfStock && (
                        <span style={{ marginLeft: 6 }}>
                          <Badge tone="danger">Out</Badge>
                        </span>
                      )}
                    </span>

                    <span>{item.reorderLevel}</span>

                    <span>
                      <Badge tone={statusTone(item.status)}>
                        {formatStatusLabel(item.status)}
                      </Badge>
                    </span>

                    <span
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openItem(item.id)}
                      >
                        Details
                      </Button>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Panel>
    </section>
  );
}