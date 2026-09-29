import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { Badge, Button, Panel } from "@/components/ui/design-system";
import { getItemStockSummary, getSparePartById, getStockBalances, getStockLocations } from "@/modules/inventory/service";
import { getAssets } from "@/modules/assets/service";

type SparePartDetailPageProps = {
  params: Promise<{
    itemId: string;
  }>;
};

export default async function SparePartDetailPage({
  params,
}: SparePartDetailPageProps) {
  const { itemId } = await params;

  const item = getSparePartById(itemId);

  if (!item) {
    return (
      <main className="min-h-screen bg-[#f6f7f9] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <PageHeader
            title="Spare part not found"
            description="The requested spare part does not exist."
            action={
              <Link href="/inventory/spare-parts">
                <Button variant="secondary">
                  Back to Spare Parts
                </Button>
              </Link>
            }
          />

          <Panel title="Unknown record">
            <p className="text-sm text-[#647086]">
              The spare part may have been removed or the link may be
              invalid.
            </p>
          </Panel>
        </div>
      </main>
    );
  }

  const stockSummary = getItemStockSummary(item.id);
  const balances = getStockBalances().filter(
    (balance) => balance.itemId === item.id,
  );
  const locations = getStockLocations();
  const assets = getAssets().filter(
    (asset) => asset.category === item.category,
  );

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          eyebrow="Inventory"
          title={item.name}
          description={`${item.partCode} · ${item.category}`}
          action={
            <div className="flex gap-3">
              <Link href="/inventory/spare-parts">
                <Button variant="secondary">
                  Back
                </Button>
              </Link>

              <Link
                href={`/inventory/spare-parts/${item.id}/edit`}
              >
                <Button>Edit Spare Part</Button>
              </Link>
            </div>
          }
        />

        <Panel title="Item information">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Part code
              </p>
              <p className="mt-1 text-sm text-[#162033]">
                {item.partCode}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Status
              </p>
              <div className="mt-1">
                <Badge
                  tone={
                    item.status === "active"
                      ? "success"
                      : "neutral"
                  }
                >
                  {item.status === "active"
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Category
              </p>
              <p className="mt-1 text-sm text-[#162033]">
                {item.category}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Unit of measure
              </p>
              <p className="mt-1 text-sm text-[#162033]">
                {item.unitOfMeasure}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Manufacturer
              </p>
              <p className="mt-1 text-sm text-[#162033]">
                {item.manufacturer || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Manufacturer part number
              </p>
              <p className="mt-1 text-sm text-[#162033]">
                {item.manufacturerPartNumber || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Reorder level
              </p>
              <p className="mt-1 text-sm text-[#162033]">
                {item.reorderLevel}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Preferred warehouse
              </p>
              <p className="mt-1 text-sm text-[#162033]">
                {locations.find(
                  (location) =>
                    location.id === item.preferredWarehouseId,
                )?.name ?? "—"}
              </p>
            </div>
          </div>

          {(item.description || item.notes) && (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {item.description && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                    Description
                  </p>
                  <p className="mt-1 text-sm text-[#162033]">
                    {item.description}
                  </p>
                </div>
              )}

              {item.notes && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                    Notes
                  </p>
                  <p className="mt-1 text-sm text-[#162033]">
                    {item.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </Panel>

        <Panel
          title="Current stock"
          description="Stock quantities are derived from opening balances and recorded movements."
        >
          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#dfe4ea] bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Total on hand
              </p>
              <p className="mt-1 text-xl font-semibold text-[#162033]">
                {stockSummary?.totalQuantity ?? 0}
              </p>
            </div>

            <div className="rounded-lg border border-[#dfe4ea] bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Usable
              </p>
              <p className="mt-1 text-xl font-semibold text-[#162033]">
                {stockSummary?.usableQuantity ?? 0}
              </p>
            </div>

            <div className="rounded-lg border border-[#dfe4ea] bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#647086]">
                Damaged
              </p>
              <p className="mt-1 text-xl font-semibold text-[#b91c1c]">
                {stockSummary?.damagedQuantity ?? 0}
              </p>
            </div>
          </div>

          <div className="table-shell overflow-x-auto">
            <div
              className="table-head"
              style={{
                gridTemplateColumns: "1.2fr 1fr 0.8fr 0.8fr",
                minWidth: 700,
              }}
            >
              <span>Location</span>
              <span>Type</span>
              <span>On hand</span>
              <span>Damaged</span>
            </div>

            {balances.length === 0 ? (
              <div className="p-5 text-sm text-[#647086]">
                No stock has been recorded for this item.
              </div>
            ) : (
              balances.map((balance) => {
                const location = locations.find(
                  (entry) => entry.id === balance.locationId,
                );

                return (
                  <div
                    key={`${balance.itemId}-${balance.locationId}`}
                    className="table-row"
                    style={{
                      gridTemplateColumns:
                        "1.2fr 1fr 0.8fr 0.8fr",
                      minWidth: 700,
                    }}
                  >
                    <span>
                      {location?.name ?? "Unknown location"}
                    </span>
                    <span>
                      {location?.type === "technician"
                        ? "Technician"
                        : "Warehouse"}
                    </span>
                    <span>{balance.quantity}</span>
                    <span>{balance.damagedQuantity}</span>
                  </div>
                );
              })
            )}
          </div>
        </Panel>

        <Panel
          title="Applicable assets"
          description="Assets using the same category are shown as a practical reference."
        >
          {assets.length === 0 ? (
            <p className="text-sm text-[#647086]">
              No matching assets are currently recorded.
            </p>
          ) : (
            <div className="space-y-3">
              {assets.map((asset) => (
                <Link
                  key={asset.id}
                  href={`/assets/${asset.id}`}
                  className="block rounded-lg border border-[#dfe4ea] bg-white p-4 hover:border-[#0f766e]"
                >
                  <p className="text-sm font-medium text-[#162033]">
                    {asset.name}
                  </p>
                  <p className="mt-1 text-xs text-[#647086]">
                    {asset.assetCode} · {asset.category}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </main>
  );
}