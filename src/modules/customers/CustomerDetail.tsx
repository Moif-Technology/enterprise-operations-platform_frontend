"use client";

import Link from "next/link";

import { Badge, Button } from "@/components/ui/design-system";
import {
  getCustomerById,
  getSitesByCustomerId,
} from "@/modules/assets/service";

interface CustomerDetailProps {
  customerId: string;
}

export default function CustomerDetail({
  customerId,
}: CustomerDetailProps) {
  const customer = getCustomerById(customerId);

  if (!customer) {
    return (
      <main className="customer-detail-page">
        <div className="customer-detail-not-found">
          <h1>Customer Not Found</h1>
          <p>The requested customer record could not be found.</p>

          <Link href="/customers">
            <Button variant="secondary">Back to Customers</Button>
          </Link>
        </div>
      </main>
    );
  }

  const sites = getSitesByCustomerId(customer.id);

  const activeSites = sites.filter(
    (site) => site.status === "active",
  ).length;

  return (
    <main className="customer-detail-page">
      {/* Header */}
      <header className="customer-detail-header">
        <div className="customer-detail-header-content">
          <div className="customer-detail-title-row">
            <h1>{customer.name}</h1>

            <Badge
              tone={
                customer.status === "active"
                  ? "success"
                  : "neutral"
              }
            >
              {customer.status === "active" ? "Active" : "Inactive"}
            </Badge>

            <span className="customer-detail-code">
              {customer.code}
            </span>
          </div>

          <p className="customer-detail-subtitle">
            Primary Contact: {customer.primaryContact || "—"}
            <span aria-hidden="true"> | </span>
            Sites: {activeSites} Active Sites
          </p>
        </div>

        <div className="customer-detail-header-actions">
  <Link href="/customers">
    <Button variant="secondary">
      Cancel
    </Button>
  </Link>

  <Link href={`/customers/${customer.id}/edit`}>
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
      Edit Customer
    </Button>
  </Link>
</div>
      </header>

      {/* Two-column dashboard */}
      <div className="customer-detail-dashboard">
        {/* LEFT COLUMN */}
        <div className="customer-detail-main-column">
          {/* Associated Sites */}
          <section className="customer-detail-card">
            <div className="customer-detail-card-header">
              <div className="customer-detail-card-title">
                <h2>Associated Sites</h2>

                <span className="customer-detail-count">
                  {sites.length}
                </span>
              </div>
            </div>

            {sites.length === 0 ? (
              <div className="customer-detail-empty">
                <p>No sites are associated with this customer.</p>
              </div>
            ) : (
              <div className="customer-detail-table-wrapper">
                <table className="customer-detail-table">
                  <thead>
                    <tr>
                      <th>SITE</th>
                      <th>CODE</th>
                      <th>ADDRESS</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sites.map((site) => (
                      <tr key={site.id}>
                        <td>
                          <span className="customer-detail-site-name">
                            {site.name}
                          </span>
                        </td>

                        <td>{site.code}</td>

                        <td>{site.address || "—"}</td>

                        <td>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Active Assets / Contracts */}
          <section className="customer-detail-card">
            <div className="customer-detail-card-header">
              <div className="customer-detail-card-title">
                <h2>Active Assets / Contracts</h2>
              </div>
            </div>

            <div className="customer-detail-empty">
              <p>
                Asset and contract relationships will appear here.
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <aside className="customer-detail-sidebar">
          {/* Customer Information */}
          <section className="customer-detail-card">
            <div className="customer-detail-sidebar-header">
              <h2>Customer Information</h2>
            </div>

            <div className="customer-detail-key-value-grid">
              <div>
                <span>CUSTOMER CODE</span>
                <strong>{customer.code}</strong>
              </div>

              <div>
                <span>PRIMARY CONTACT</span>
                <strong>{customer.primaryContact || "—"}</strong>
              </div>

              <div>
                <span>STATUS</span>

                <div className="customer-detail-value-badge">
                  <Badge
                    tone={
                      customer.status === "active"
                        ? "success"
                        : "neutral"
                    }
                  >
                    {customer.status === "active"
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Contact & Address */}
          <section className="customer-detail-card">
            <div className="customer-detail-sidebar-header">
              <h2>Contact &amp; Address</h2>
            </div>

            <div className="customer-detail-key-value-stack">
              <div>
                <span>EMAIL</span>
                <strong>{customer.email || "—"}</strong>
              </div>

              <div>
                <span>PHONE</span>
                <strong>{customer.phone || "—"}</strong>
              </div>

              <div>
                <span>ADDRESS</span>
                <strong>{customer.address || "—"}</strong>
              </div>

              <div>
                <span>NOTES</span>
                <strong>{customer.notes || "—"}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}