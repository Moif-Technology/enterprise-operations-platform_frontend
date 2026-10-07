import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { Badge, Button, Panel } from "@/components/ui/design-system";

import {
  getAssetById,
  getCustomers,
  getDocumentsByAssetId,
  getMaintenancePlansByAssetId,
  getMockWorkOrdersByAssetId,
  getServiceHistoryByAssetId,
  getSites,
} from "@/modules/assets/service";

type AssetDetailPageProps = {
  params: Promise<{
    assetId: string;
  }>;
};

export default async function AssetDetailPage({
  params,
}: AssetDetailPageProps) {
  const { assetId } = await params;
  const asset = getAssetById(assetId);

  if (!asset) {
    return (
      <main className="w-full">
        <div className="w-full space-y-6 p-6">
          <PageHeader
            title="Asset not found"
            description="The requested asset could not be found."
            action={
              <Link href="/assets">
                <Button variant="secondary">Back to Assets</Button>
              </Link>
            }
          />

          <Panel title="Asset unavailable">
            <p className="text-sm text-[#5d6675]">
              This asset does not exist in the current demo data.
            </p>
          </Panel>
        </div>
      </main>
    );
  }

  const customers = getCustomers();
  const sites = getSites();

  const customer = customers.find(
    (item) => item.id === asset.customerId,
  );

  const site = sites.find((item) => item.id === asset.siteId);

  const plans = getMaintenancePlansByAssetId(asset.id);
  const history = getServiceHistoryByAssetId(asset.id);
  const documents = getDocumentsByAssetId(asset.id);
  const workOrders = getMockWorkOrdersByAssetId(asset.id);

  return (
    <main className="w-full">
      <div className="w-full p-6">
        {/* Header */}
        <div className="asset-detail-header">
          <div className="asset-detail-header-main">
            <div className="asset-detail-title-row">
              <h1>{asset.name}</h1>
  
              <Badge
                tone={
                  asset.status === "active"
                    ? "success"
                    : asset.status === "under-maintenance"
                      ? "warning"
                      : asset.status === "decommissioned"
                        ? "danger"
                        : "neutral"
                }
              >
                {asset.status}
              </Badge>
  
              <span className="asset-detail-code">{asset.assetCode}</span>
            </div>
  
            <div className="asset-detail-meta">
              <span>
                Customer: {customer?.name ?? "Unknown customer"}
              </span>
              <span aria-hidden="true">•</span>
              <span>
                Site: {site?.name ?? "Unknown site"}
              </span>
              <span aria-hidden="true">•</span>
              <span>Category: {asset.category}</span>
            </div>
          </div>
  
          <div className="asset-detail-header-actions">
            <Link href="/assets">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
  
            <Link href={`/assets/${asset.id}/edit`}>
              <Button type="button">
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
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </svg>
                Edit Asset
              </Button>
            </Link>
          </div>
        </div>
  
        {/* Dashboard */}
        <div className="asset-detail-dashboard">
          {/* Main column */}
          <div className="asset-detail-main-column">
            {/* Maintenance Plans */}
            <Panel title="Maintenance & Work Orders">
              {plans.length === 0 ? (
                <p className="text-sm text-[#5d6675]">
                  No maintenance plans are configured for this asset.
                </p>
              ) : (
                <div className="asset-detail-list">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="asset-detail-list-item"
                    >
                      <div>
                        <h3>{plan.planName}</h3>
                        <p>
                          {plan.frequency} · Next due{" "}
                          {plan.nextDueDate}
                        </p>
                      </div>

                      <Badge
                        tone={
                          plan.status === "active"
                            ? "success"
                            : "neutral"
                        }
                      >
                        {plan.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* Service History */}
            <Panel title="Service History">
              {history.length === 0 ? (
                <p className="text-sm text-[#5d6675]">
                  No service history is available.
                </p>
              ) : (
                <div className="asset-detail-table-wrapper">
                  <table className="asset-detail-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Technician</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {history.map((entry) => (
                        <tr key={entry.id}>
                          <td>{entry.performedOn}</td>
                          <td>{entry.summary}</td>
                          <td>{entry.performedBy}</td>
                          <td>
                            <Badge
                              tone={
                                entry.outcome === "completed"
                                  ? "success"
                                  : entry.outcome === "partial"
                                    ? "warning"
                                    : "neutral"
                              }
                            >
                              {entry.outcome}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>

            {/* Work Orders */}
            <Panel title="Work Order Handoff">
              {workOrders.length === 0 ? (
                <p className="text-sm text-[#5d6675]">
                  No work orders are linked to this asset.
                </p>
              ) : (
                <div className="asset-detail-list">
                  {workOrders.map((workOrder) => (
                    <div
                      key={workOrder.id}
                      className="asset-detail-list-item"
                    >
                      <div>
                        <span className="asset-detail-reference">
                          {workOrder.reference}
                        </span>

                        <h3>{workOrder.title}</h3>

                        <p>
                          Scheduled {workOrder.scheduledDate}
                        </p>
                      </div>

                      <Badge
                        tone={
                          workOrder.status === "completed"
                            ? "success"
                            : workOrder.status === "cancelled"
                              ? "danger"
                              : workOrder.status === "in-progress"
                                ? "info"
                                : "neutral"
                        }
                      >
                        {workOrder.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* Documents */}
            <Panel title="Documents & Attachments">
              {documents.length === 0 ? (
                <p className="text-sm text-[#5d6675]">
                  No documents are available.
                </p>
              ) : (
                <div className="asset-detail-documents">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="asset-detail-document"
                    >
                      <div className="asset-detail-document-icon">
                        📄
                      </div>

                      <div className="asset-detail-document-info">
                        <p>{document.name}</p>
                        <span>
                          {document.type} · {document.uploadedOn}
                        </span>
                      </div>

                      <span className="asset-detail-document-action">
                        Download
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* Notes */}
            {asset.notes && (
              <Panel title="Notes">
                <div className="asset-detail-notes">
                  {asset.notes}
                </div>
              </Panel>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="asset-detail-sidebar">
            {/* Asset Overview */}
            <Panel title="Quick Details">
              <div className="asset-detail-key-value-grid">
                <div>
                  <span>Asset Code</span>
                  <strong>{asset.assetCode}</strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>{asset.category}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{asset.location}</strong>
                </div>

                <div>
                  <span>Installation Date</span>
                  <strong>{asset.installationDate}</strong>
                </div>
              </div>
            </Panel>

            {/* Customer & Site */}
            <Panel title="Customer & Site">
              <div className="asset-detail-key-value-stack">
                <div>
                  <span>Customer</span>
                  <strong>
                    {customer?.name ?? "Unknown customer"}
                  </strong>
                </div>

                <div>
                  <span>Site</span>
                  <strong>
                    {site?.name ?? "Unknown site"}
                  </strong>
                </div>

                <div>
                  <span>Address</span>
                  <strong>
                    {site?.address ?? "No address available"}
                  </strong>
                </div>
              </div>
            </Panel>

            {/* Registration */}
            <Panel title="Serial & Warranty">
              <div className="asset-detail-key-value-stack">
                <div>
                  <span>Serial Number</span>
                  <strong>
                    {asset.serialNumber || "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>Model</span>
                  <strong>
                    {asset.model || "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>Warranty Expiry</span>
                  <strong>{asset.warrantyExpiry}</strong>
                </div>
              </div>
            </Panel>
          </aside>
        </div>
      </div>
    </main>
  );
}