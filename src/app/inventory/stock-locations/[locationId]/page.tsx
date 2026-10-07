"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { Badge, Button } from "@/components/ui/design-system";

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
      <div className="stock-location-detail-page">
        <PageHeader
          eyebrow="Inventory / Stock Locations"
          title="Stock location not found"
          description="The requested stock location does not exist."
          action={
            <Link href="/inventory/stock-locations">
              <Button variant="secondary">Back to Stock Locations</Button>
            </Link>
          }
        />

        <section className="stock-location-detail-card">
          <h3>Unknown record</h3>
          <p>
            The stock location may have been removed or the link may be
            invalid.
          </p>
        </section>
      </div>
    );
  }

  const site = location.siteId
    ? getSiteById(location.siteId)
    : undefined;

  const parts = getSpareParts();

  const balances = getStockBalances().filter(
    (balance) => balance.locationId === location.id,
  );

  const locationType =
    location.type === "warehouse" ? "Warehouse" : "Technician";

  const linkedSite =
    location.type === "warehouse"
      ? site?.name ?? "Unknown site"
      : location.technicianName ?? "—";

  return (
    <div className="stock-location-detail-page">
      <PageHeader
        eyebrow="Inventory / Stock Locations"
        title={location.name}
        description={`Type: ${locationType} | ${
          location.type === "warehouse"
            ? `Linked Site: ${linkedSite}`
            : `Technician: ${linkedSite}`
        }`}
        action={
          <Link href={`/inventory/stock-locations/${location.id}/edit`}>
            <Button>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                
                <path
                  d="M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit Stock Location
            </Button>
          </Link>
        }
      />

      <div className="stock-location-detail-title-meta">
        <Badge
          tone={location.status === "active" ? "success" : "neutral"}
        >
          {location.status === "active" ? "Active" : "Inactive"}
        </Badge>

        <span className="stock-location-detail-code">
          {location.code}
        </span>
      </div>

      <div className="stock-location-detail-dashboard">
        <main className="stock-location-detail-main">
          <section className="stock-location-detail-card">
            <div className="stock-location-detail-card-header">
              <h3>Current Stock</h3>
              <p>
                Quantities are derived from opening balances and recorded
                movements.
              </p>
            </div>

            {balances.length === 0 ? (
              <div className="stock-location-detail-empty">
                No stock has been recorded at this location.
              </div>
            ) : (
              <div className="stock-location-detail-table-wrapper">
                <table className="stock-location-detail-table">
                  <thead>
                    <tr>
                      <th>Spare Part</th>
                      <th>Part Code</th>
                      <th>On Hand</th>
                      <th>Damaged</th>
                    </tr>
                  </thead>

                  <tbody>
                    {balances.map((balance) => {
                      const part = parts.find(
                        (item) => item.id === balance.itemId,
                      );

                      return (
                        <tr
                          key={`${balance.itemId}-${balance.locationId}`}
                        >
                          <td>
                            <Link
                              href={`/inventory/spare-parts/${balance.itemId}`}
                              className="stock-location-detail-part-link"
                            >
                              {part?.name ?? "Unknown spare part"}
                            </Link>
                          </td>

                          <td>
                            <span className="stock-location-detail-part-code">
                              {part?.partCode ?? "—"}
                            </span>
                          </td>

                          <td>
                            <span className="stock-location-detail-on-hand">
                              {balance.quantity}
                            </span>
                          </td>

                          <td>
                            <span className="stock-location-detail-damaged">
                              {balance.damagedQuantity}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>

        <aside className="stock-location-detail-sidebar">
          <section className="stock-location-detail-card">
            <div className="stock-location-detail-card-header">
              <h3>Location Overview</h3>
            </div>

            <div className="stock-location-detail-fields">
              <DetailField label="Location Code">
                <span className="stock-location-detail-part-code">
                  {location.code}
                </span>
              </DetailField>

              <DetailField label="Status">
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
              </DetailField>

              <DetailField label="Type">
                <span
                  className={`stock-location-detail-type-badge ${
                    location.type === "warehouse"
                      ? "stock-location-detail-type-warehouse"
                      : "stock-location-detail-type-technician"
                  }`}
                >
                  {locationType}
                </span>
              </DetailField>

              <DetailField
                label={
                  location.type === "warehouse"
                    ? "Linked Site"
                    : "Technician"
                }
              >
                {linkedSite}
              </DetailField>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="stock-location-detail-field">
      <span className="stock-location-detail-label">{label}</span>
      <div className="stock-location-detail-value">{children}</div>
    </div>
  );
}