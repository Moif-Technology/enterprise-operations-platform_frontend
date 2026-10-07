import Link from "next/link";

import { Badge, Button } from "@/components/ui/design-system";

import type {
  Asset,
  Contract,
  Customer,
  Site,
} from "@/modules/assets/types";

interface ContractDetailProps {
  contract: Contract;
  customer?: Customer;
  sites: Site[];
  assets: Asset[];
}

export default function ContractDetail({
  contract,
  customer,
  sites,
  assets,
}: ContractDetailProps) {
  const statusLabel =
    contract.status.charAt(0).toUpperCase() +
    contract.status.slice(1);

  const customerName = customer?.name ?? "Unknown customer";

  const formatDate = (value: string) => {
    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = () => {
    if (contract.value == null) {
      return "Not specified";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: contract.currency ?? "INR",
      maximumFractionDigits: 0,
    }).format(contract.value);
  };

  const getSiteForAsset = (asset: Asset) =>
    sites.find((site) => site.id === asset.siteId);

  return (
    <main className="contract-detail-page">
      <header className="contract-detail-header">
        <div className="contract-detail-header-content">
          <div className="contract-detail-title-row">
            <h1>{contract.title}</h1>

            <Badge
              tone={
                contract.status === "active"
                  ? "success"
                  : contract.status === "cancelled"
                    ? "danger"
                    : "neutral"
              }
            >
              {statusLabel}
            </Badge>

            <span className="contract-detail-code">
              {contract.contractNumber}
            </span>
          </div>

          <p className="contract-detail-subtitle">
            Customer: {customerName} | Valid:{" "}
            {formatDate(contract.startDate)} –{" "}
            {formatDate(contract.endDate)}
          </p>
        </div>

        <div className="contract-detail-header-actions">
          <Link href={`/contracts/${contract.id}/renew`}>
            <Button variant="secondary">Renew Contract</Button>
          </Link>

          <Link href={`/contracts/${contract.id}/edit`}>
            <Button>
              <span
                aria-hidden="true"
                className="contract-detail-pencil-icon"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </svg>
              </span>
              Edit Contract
            </Button>
          </Link>
        </div>
      </header>

      <div className="contract-detail-dashboard">
        <div className="contract-detail-main-column">
          <section className="contract-detail-card">
            <div className="contract-detail-card-header">
              <h2>Service Scope &amp; Coverage</h2>
            </div>

            <div className="contract-detail-key-value-stack">
              <div>
                <span>Service Scope</span>
                <p className="contract-detail-body-text">
                  {contract.serviceScope || "No service scope specified."}
                </p>
              </div>

              <div>
                <span>Exclusions</span>
                <p className="contract-detail-body-text">
                  {contract.exclusions || "None specified."}
                </p>
              </div>
            </div>
          </section>

          <section className="contract-detail-card">
            <div className="contract-detail-card-header">
              <h2>Covered Assets &amp; Sites</h2>
            </div>

            <div className="contract-detail-table-wrapper">
              <table className="contract-detail-table">
                <thead>
                  <tr>
                    <th>Covered Assets</th>
                    <th>Asset Code</th>
                    <th>Site</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {assets.length > 0 ? (
                    assets.map((asset) => {
                      const site = getSiteForAsset(asset);

                      return (
                        <tr key={asset.id}>
                          <td>
                            <span className="contract-detail-asset-name">
                              {asset.name}
                            </span>
                          </td>

                          <td>
                            <span className="contract-detail-asset-code">
                              {asset.assetCode}
                            </span>
                          </td>

                          <td>
                            {site?.name ?? "Site-wide"}
                          </td>

                          <td>
                            <Badge
                              tone={
                                asset.status === "active"
                                  ? "success"
                                  : "neutral"
                              }
                            >
                              {asset.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
                  ) : sites.length > 0 ? (
                    sites.map((site) => (
                      <tr key={site.id}>
                        <td>
                          <span className="contract-detail-asset-name">
                            Site-wide coverage
                          </span>
                        </td>

                        <td>—</td>

                        <td>{site.name}</td>

                        <td>
                          <Badge
                            tone={
                              site.status === "active"
                                ? "success"
                                : "neutral"
                            }
                          >
                            {site.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="contract-detail-empty-cell"
                      >
                        No covered assets or sites linked.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="contract-detail-sidebar">
          <section className="contract-detail-card">
            <div className="contract-detail-card-header">
              <h2>Contract Information</h2>
            </div>

            <div className="contract-detail-key-value-stack">
              <div>
                <span>Customer</span>
                {customer ? (
                  <Link
                    href={`/customers/${customer.id}`}
                    className="contract-detail-value-link"
                  >
                    {customer.name}
                  </Link>
                ) : (
                  <strong>Unknown customer</strong>
                )}
              </div>

              <div>
                <span>Type</span>
                <strong>{contract.type}</strong>
              </div>

              <div>
                <span>Start Date</span>
                <strong>{contract.startDate}</strong>
              </div>

              <div>
                <span>End Date</span>
                <strong>{contract.endDate}</strong>
              </div>

              <div>
                <span>Contract Value</span>
                <strong>{formatCurrency()}</strong>
              </div>
            </div>
          </section>

          <section className="contract-detail-card">
            <div className="contract-detail-card-header">
              <h2>SLA Terms</h2>
            </div>

            <div className="contract-detail-key-value-stack">
              <div>
                <span>Visit Frequency</span>
                <strong>
                  {contract.visitFrequency || "Not specified"}
                </strong>
              </div>

              <div>
                <span>Response Time</span>
                <strong>
                  {contract.responseHours != null
                    ? `${contract.responseHours} hours`
                    : "Not specified"}
                </strong>
              </div>

              <div>
                <span>Resolution Time</span>
                <strong>
                  {contract.resolutionHours != null
                    ? `${contract.resolutionHours} hours`
                    : "Not specified"}
                </strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
      
    </main>
  );
}