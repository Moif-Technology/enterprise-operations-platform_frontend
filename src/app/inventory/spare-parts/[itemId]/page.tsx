import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { Badge, Button } from "@/components/ui/design-system";

import {
  getItemStockSummary,
  getMovements,
  getSparePartById,
  getStockBalances,
  getStockLocations,
} from "@/modules/inventory/service";

type SparePartDetailPageProps = {
  params: Promise<{
    itemId: string;
  }>;
};

function formatMovementType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default async function SparePartDetailPage({
  params,
}: SparePartDetailPageProps) {
  const { itemId } = await params;
  const item = getSparePartById(itemId);

  if (!item) {
    return (
      <main className="spare-part-detail-page">
        <PageHeader
          eyebrow="Inventory / Spare Parts"
          title="Spare part not found"
          description="The requested spare part does not exist."
          action={
            <Link href="/inventory/spare-parts">
              <Button variant="secondary">Back to Spare Parts</Button>
            </Link>
          }
        />

        <section className="spare-part-detail-card">
          <h3>Unknown record</h3>
          <p>
            The spare part may have been removed or the link may be invalid.
          </p>
        </section>
      </main>
    );
  }

  const stockSummary = getItemStockSummary(item.id);

  const balances = getStockBalances().filter(
    (balance) => balance.itemId === item.id,
  );

  const locations = getStockLocations();

  const recentMovements = getMovements()
    .filter((movement) => movement.itemId === item.id)
    .slice(0, 5);

  const preferredWarehouse = locations.find(
    (location) => location.id === item.preferredWarehouseId,
  );

  return (
    <main className="spare-part-detail-page">
      <PageHeader
        eyebrow="Inventory / Spare Parts"
        title={item.name}
        description={`Category: ${item.category} | Preferred Warehouse: ${
          preferredWarehouse?.name ?? "—"
        }`}
        action={
          <Link href={`/inventory/spare-parts/${item.id}/edit`}>
            <Button>
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
              
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
              </svg>
              Edit Spare Part
            </Button>
          </Link>
        }
      />

      <div className="spare-part-detail-title-meta">
        <Badge tone={item.status === "active" ? "success" : "neutral"}>
          {item.status === "active" ? "Active" : "Inactive"}
        </Badge>

        <span className="spare-part-detail-code">
          {item.partCode}
        </span>
      </div>

      <div className="spare-part-detail-dashboard">
        <div className="spare-part-detail-main">
          <section className="spare-part-stock-stats">
            <div className="spare-part-stat-card">
              <p>Total On Hand</p>
              <strong>
                {stockSummary?.totalQuantity ?? 0} {item.unitOfMeasure}
              </strong>
            </div>

            <div className="spare-part-stat-card">
              <p>Usable Stock</p>
              <strong className="spare-part-stat-usable">
                {stockSummary?.usableQuantity ?? 0} {item.unitOfMeasure}
              </strong>
            </div>

            <div className="spare-part-stat-card">
              <p>Damaged Stock</p>
              <strong className="spare-part-stat-damaged">
                {stockSummary?.damagedQuantity ?? 0} {item.unitOfMeasure}
              </strong>
            </div>
          </section>

          <section className="spare-part-detail-card">
            <div className="spare-part-detail-card-header">
              <h3>Stock Locations Breakdown</h3>
              <p>
                Stock quantities across warehouses and technician stock.
              </p>
            </div>

            {balances.length === 0 ? (
              <div className="spare-part-detail-empty">
                No stock has been recorded for this item.
              </div>
            ) : (
              <div className="spare-part-detail-table-wrapper">
                <table className="spare-part-detail-table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Type</th>
                      <th>On Hand</th>
                      <th>Damaged</th>
                    </tr>
                  </thead>

                  <tbody>
                    {balances.map((balance) => {
                      const location = locations.find(
                        (entry) => entry.id === balance.locationId,
                      );

                      return (
                        <tr
                          key={`${balance.itemId}-${balance.locationId}`}
                        >
                          <td className="spare-part-detail-location">
                            {location?.name ?? "Unknown location"}
                          </td>

                          <td className="spare-part-detail-type">
                            {location?.type === "technician"
                              ? "Technician"
                              : "Warehouse"}
                          </td>

                          <td className="spare-part-detail-on-hand">
                            {balance.quantity}
                          </td>

                          <td className="spare-part-detail-damaged">
                            {balance.damagedQuantity}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="spare-part-detail-card">
            <div className="spare-part-detail-card-header">
              <h3>Recent Movements</h3>
              <p>
                Audit trail of recent stock entries, transfers, and issues.
              </p>
            </div>

            {recentMovements.length === 0 ? (
              <div className="spare-part-detail-empty">
                No movements have been recorded for this item.
              </div>
            ) : (
              <div className="spare-part-detail-table-wrapper">
                <table className="spare-part-detail-table spare-part-movements-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Source / Destination</th>
                      <th>Quantity</th>
                      <th>Reason</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentMovements.map((movement) => {
                      const source = movement.sourceLocationId
                        ? locations.find(
                            (location) =>
                              location.id === movement.sourceLocationId,
                          )?.name
                        : undefined;

                      const destination = movement.destinationLocationId
                        ? locations.find(
                            (location) =>
                              location.id === movement.destinationLocationId,
                          )?.name
                        : undefined;

                      return (
                        <tr key={movement.id}>
                          <td>{movement.date}</td>

                          <td>
                            {formatMovementType(movement.type)}
                          </td>

                          <td>
                            {source ?? "—"} → {destination ?? "—"}
                          </td>

                          <td className="spare-part-detail-on-hand">
                            {movement.quantity}
                          </td>

                          <td>{movement.reason}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="spare-part-detail-sidebar">
          <section className="spare-part-detail-card">
            <div className="spare-part-detail-card-header">
              <h3>Part Overview</h3>
            </div>

            <div className="spare-part-detail-key-values">
              <DetailField
                label="Part Code"
                value={item.partCode}
              />

              <DetailField
                label="Category"
                value={item.category}
              />

              <DetailField
                label="Unit of Measure"
                value={item.unitOfMeasure}
              />

              <DetailField
                label="Manufacturer"
                value={item.manufacturer || "—"}
              />

              <DetailField
                label="MPN"
                value={item.manufacturerPartNumber || "—"}
              />

              <DetailField
                label="Reorder Level"
                value={String(item.reorderLevel)}
              />

              <DetailField
                label="Preferred Warehouse"
                value={preferredWarehouse?.name ?? "—"}
              />
            </div>
          </section>

          <section className="spare-part-detail-card">
            <div className="spare-part-detail-card-header">
              <h3>Description & Notes</h3>
            </div>

            <div className="spare-part-detail-key-values">
              <DetailField
                label="Description"
                value={item.description || "—"}
              />

              <DetailField
                label="Notes"
                value={item.notes || "—"}
              />
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="spare-part-detail-field">
      <p className="spare-part-detail-label">{label}</p>
      <p className="spare-part-detail-value">{value}</p>
    </div>
  );
}