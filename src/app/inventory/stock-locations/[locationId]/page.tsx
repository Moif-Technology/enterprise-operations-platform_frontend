"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import PageHeader from "@/components/ui/PageHeader";
import { Badge, Button, Panel } from "@/components/ui/design-system";
import { getSiteById } from "@/modules/assets/service";
import {
  getSpareParts,
  getStockBalances,
  getStockLocationById,
} from "@/modules/inventory/service";

export default function StockLocationDetailPage() {
  const params = useParams<{ locationId: string }>();
  const locationId = params.locationId;

  const location = useMemo(
    () => getStockLocationById(locationId),
    [locationId],
  );

  if (!location) {
    return (
      <main className="min-h-screen bg-[#f6f7f9] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <PageHeader
            title="Stock location not found"
            description="The requested stock location does not exist."
            action={
              <Link href="/inventory/stock-locations">
                <Button variant="secondary">
                  Back to Stock Locations
                </Button>
              </Link>
            }
          />

          <Panel title="Unknown record">
            <p className="text-sm text-[#647086]">
              The stock location may have been removed or the link may be
              invalid.
            </p>
          </Panel>
        </div>
      </main>
    );
  }

  const site = location.siteId
    ? getSiteById(location.siteId)
    : undefined;

  const parts = getSpareParts();

  const balances = getStockBalances().filter(
    (balance) => balance.locationId === location.id,
  );

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          eyebrow="Inventory"
          title={location.name}
          description={`${location.code} · ${
            location.type === "warehouse"
              ? "Warehouse"
              : "Technician Stock"
          }`}
          action={
            <div className="flex gap-3">
              <Link href="/inventory/stock-locations">
                <Button variant="secondary">Back</Button>
              </Link>

              <Link
                href={`/inventory/stock-locations/${location.id}/edit`}
              >
                <Button>Edit Stock Location</Button>
              </Link>
            </div>
          }
        />

        <Panel title="Location information">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Location code
              </p>
              <p className="mt-1 text-sm text-[#162033]">
                {location.code}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Status
              </p>

              <div className="mt-1">
                <Badge
                  tone={
                    location.status === "active"
                      ? "success"
                      : "neutral"
                  }
                >
                  {location.status === "active"
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Type
              </p>

              <p className="mt-1 text-sm text-[#162033]">
                {location.type === "warehouse"
                  ? "Warehouse"
                  : "Technician"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                {location.type === "warehouse"
                  ? "Linked site"
                  : "Technician"}
              </p>

              <p className="mt-1 text-sm text-[#162033]">
                {location.type === "warehouse"
                  ? site?.name ?? "Unknown site"
                  : location.technicianName ?? "—"}
              </p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Current stock"
          description="Quantities are derived from opening balances and recorded movements."
        >
          {balances.length === 0 ? (
            <p className="text-sm text-[#647086]">
              No stock has been recorded at this location.
            </p>
          ) : (
            <div className="table-shell overflow-x-auto">
              <div
                className="table-head"
                style={{
                  gridTemplateColumns:
                    "1.3fr 1fr 0.8fr 0.8fr",
                  minWidth: 700,
                }}
              >
                <span>Spare part</span>
                <span>Part code</span>
                <span>On hand</span>
                <span>Damaged</span>
              </div>

              {balances.map((balance) => {
                const part = parts.find(
                  (item) => item.id === balance.itemId,
                );

                return (
                  <div
                    key={`${balance.itemId}-${balance.locationId}`}
                    className="table-row"
                    style={{
                      gridTemplateColumns:
                        "1.3fr 1fr 0.8fr 0.8fr",
                      minWidth: 700,
                    }}
                  >
                    <Link
                      href={`/inventory/spare-parts/${balance.itemId}`}
                      className="font-medium text-[#0f766e] hover:underline"
                    >
                      {part?.name ?? "Unknown spare part"}
                    </Link>

                    <span>
                      {part?.partCode ?? "—"}
                    </span>

                    <span>{balance.quantity}</span>

                    <span>{balance.damagedQuantity}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    </main>
  );
}