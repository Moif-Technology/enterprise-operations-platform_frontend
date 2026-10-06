"use client";

import Link from "next/link";

import { Badge, Button } from "@/components/ui/design-system";

import {
  getAssets,
  getCustomerById,
  getSiteById,
} from "@/modules/assets/service";

interface SiteDetailProps {
  siteId: string;
}

export default function SiteDetail({ siteId }: SiteDetailProps) {
  const site = getSiteById(siteId);

  if (!site) {
    return (
      <main className="site-detail-page">
        <div className="site-detail-not-found">
          <h1>Site Not Found</h1>
          <p>The requested site record could not be found.</p>

          <Link href="/sites">
            <Button variant="secondary">Back to Sites</Button>
          </Link>
        </div>
      </main>
    );
  }

  const customer = getCustomerById(site.customerId);

  const siteAssets = getAssets().filter(
    (asset) => asset.siteId === site.id,
  );

  return (
    <main className="site-detail-page">
      {/* Header */}
      <header className="site-detail-header">
        <div className="site-detail-header-content">
          <div className="site-detail-title-row">
            <h1>{site.name}</h1>

            <Badge
              tone={
                site.status === "active"
                  ? "success"
                  : "neutral"
              }
            >
              {site.status === "active" ? "Active" : "Inactive"}
            </Badge>

            <span className="site-detail-code">
              {site.code}
            </span>
          </div>

          <p className="site-detail-subtitle">
            Customer: {customer?.name || "—"}
            <span aria-hidden="true"> | </span>
            Total Assets: {siteAssets.length}
          </p>
        </div>

        <div className="site-detail-header-actions">
  <Link href="/sites">
    <Button variant="secondary" type="button">
      Cancel
    </Button>
  </Link>

  <Link href={`/sites/${site.id}/edit`}>
    <Button>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1-1-4Z" />
      </svg>
      Edit Site
    </Button>
  </Link>
</div>
      </header>

      {/* Dashboard */}
      <div className="site-detail-dashboard">
        {/* Left column */}
        <div className="site-detail-main-column">
          <section className="site-detail-card">
            <div className="site-detail-card-header">
              <div className="site-detail-card-title">
                <h2>Assets at this Site</h2>

                <span className="site-detail-count">
                  {siteAssets.length}
                </span>
              </div>
            </div>

            {siteAssets.length === 0 ? (
              <div className="site-detail-empty">
                <p>No assets are associated with this site.</p>
              </div>
            ) : (
              <div className="site-detail-table-wrapper">
                <table className="site-detail-table">
                  <thead>
                    <tr>
                      <th>ASSET NAME</th>
                      <th>CODE</th>
                      <th>CATEGORY</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {siteAssets.map((asset) => (
                      <tr key={asset.id}>
                        <td>
                          <span className="site-detail-asset-name">
                            {asset.name}
                          </span>
                        </td>

                        <td>
                          <span className="site-detail-asset-code">
                            {asset.assetCode}
                          </span>
                        </td>

                        <td>{asset.category || "—"}</td>

                        <td>
                          <Badge
                            tone={
                              asset.status === "active"
                                ? "success"
                                : "neutral"
                            }
                          >
                            {asset.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </td>

                        <td>
                          <div className="site-detail-row-actions">
                            <Link
                              href={`/assets/${asset.id}`}
                              className="site-detail-icon-button"
                              aria-label={`View ${asset.name}`}
                              title="View asset"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="2.5"
                                />
                              </svg>
                            </Link>

                            <Link
                              href={`/assets/${asset.id}/edit`}
                              className="site-detail-icon-button"
                              aria-label={`Edit ${asset.name}`}
                              title="Edit asset"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1-1-4Z" />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Right column */}
        <aside className="site-detail-sidebar">
          {/* Site Overview */}
          <section className="site-detail-card">
            <div className="site-detail-sidebar-header">
              <h2>Site Overview</h2>
            </div>

            <div className="site-detail-key-value-stack">
              <div>
                <span>CUSTOMER</span>

                {customer ? (
                  <Link
                    href={`/customers/${customer.id}`}
                    className="site-detail-value-link"
                  >
                    {customer.name}
                  </Link>
                ) : (
                  <strong>—</strong>
                )}
              </div>

              <div>
                <span>SITE CODE</span>
                <strong>{site.code}</strong>
              </div>

              <div>
                <span>STATUS</span>

                <div className="site-detail-value-badge">
                  <Badge
                    tone={
                      site.status === "active"
                        ? "success"
                        : "neutral"
                    }
                  >
                    {site.status === "active"
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Location & Contact */}
          <section className="site-detail-card">
            <div className="site-detail-sidebar-header">
              <h2>Location &amp; Contact</h2>
            </div>

            <div className="site-detail-key-value-stack">
              <div>
                <span>ADDRESS</span>
                <strong>{site.address || "—"}</strong>
              </div>

              <div>
                <span>SPECIFIC LOCATION</span>
                <strong>{site.location || "—"}</strong>
              </div>

              <div>
                <span>CONTACT NAME</span>
                <strong>{site.contactName || "—"}</strong>
              </div>

              <div>
                <span>CONTACT PHONE</span>
                <strong>{site.contactPhone || "—"}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}