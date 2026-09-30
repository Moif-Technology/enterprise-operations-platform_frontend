"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/design-system";
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

        const matchesSearch =
          !search ||
          part.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          part.partCode
            .toLowerCase()
            .includes(search.toLowerCase());

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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title="Low Stock & Reorder"
        description="Review spare parts at or below their reorder level and see the quantity needed to reach that level."
      />

      <Panel
        title="Filters"
        description="Filter low-stock items by part or category."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#162033]">
              Search
            </label>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="input w-full"
              placeholder="Search part name or code"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#162033]">
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="input w-full"
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
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            Out of stock
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#162033]">
            {outOfStockItems.length}
          </p>

          <p className="mt-1 text-sm text-[#647086]">
            Items with zero total stock.
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-medium text-amber-700">
            At or below reorder level
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#162033]">
            {reorderItems.length}
          </p>

          <p className="mt-1 text-sm text-[#647086]">
            Items requiring stock attention.
          </p>
        </div>
      </div>

      <Panel
        title="Out of Stock"
        description="These items currently have zero total stock."
      >
        {outOfStockItems.length === 0 ? (
          <div className="rounded-md border border-[#dfe4ea] bg-[#f6f7f9] px-6 py-8 text-center">
            <p className="text-sm font-medium text-[#162033]">
              No items are out of stock.
            </p>
          </div>
        ) : (
          <StockTable items={outOfStockItems} />
        )}
      </Panel>

      <Panel
        title="Reorder Required"
        description="These items are above zero stock but at or below their reorder level."
      >
        {reorderItems.length === 0 ? (
          <div className="rounded-md border border-[#dfe4ea] bg-[#f6f7f9] px-6 py-8 text-center">
            <p className="text-sm font-medium text-[#162033]">
              No additional reorder attention is required.
            </p>
          </div>
        ) : (
          <StockTable items={reorderItems} />
        )}
      </Panel>
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
}: {
  items: StockTableItem[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
        <thead>
          <tr className="border-b border-[#dfe4ea] text-sm text-[#647086]">
            <th className="px-4 py-3 font-medium">
              Part
            </th>

            <th className="px-4 py-3 font-medium">
              Category
            </th>

            <th className="px-4 py-3 font-medium">
              Current Stock
            </th>

            <th className="px-4 py-3 font-medium">
              Reorder Level
            </th>

            <th className="px-4 py-3 font-medium">
              Suggested Reorder
            </th>

            <th className="px-4 py-3 font-medium">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map(({ part, summary }) => (
            <tr
              key={part.id}
              className="border-b border-[#eef1f4] last:border-b-0"
            >
              <td className="px-4 py-4">
                <Link
                  href={`/inventory/spare-parts/${part.id}`}
                  className="text-sm font-medium text-[#0f766e] hover:underline"
                >
                  {part.name}
                </Link>

                <div className="text-xs text-[#647086]">
                  {part.partCode}
                </div>
              </td>

              <td className="px-4 py-4 text-sm text-[#647086]">
                {part.category}
              </td>

              <td className="px-4 py-4 text-sm font-medium text-[#162033]">
                {summary?.totalQuantity ?? 0}{" "}
                {part.unitOfMeasure}
              </td>

              <td className="px-4 py-4 text-sm text-[#647086]">
                {summary?.reorderLevel ?? 0}{" "}
                {part.unitOfMeasure}
              </td>

              <td className="px-4 py-4 text-sm font-medium text-[#162033]">
                {summary?.reorderSuggestionQuantity ?? 0}{" "}
                {part.unitOfMeasure}
              </td>

              <td className="px-4 py-4">
                {summary?.isOutOfStock ? (
                  <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                    Out of stock
                  </span>
                ) : (
                  <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    Low stock
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}