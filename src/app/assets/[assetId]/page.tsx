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
      <main className="w-full max-w-full">
        <div className="w-full max-w-full">
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
    <main className="w-full max-w-full">
      <div className="w-full max-w-full space-y-6">
        <PageHeader
          title={asset.name}
          description={`${asset.assetCode} · ${asset.category}`}
          action={
            <div className="flex gap-3">
              <Link href="/assets">
                <Button variant="secondary">Back to Assets</Button>
              </Link>

              <Link href={`/assets/${asset.id}/edit`}>
                <Button>Edit Asset</Button>
              </Link>
            </div>
          }
        />

        <Panel title="Asset overview">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                Asset code
              </p>
              <p className="mt-1 text-sm font-semibold text-[#162033]">
                {asset.assetCode}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                Category
              </p>
              <p className="mt-1 text-sm font-semibold text-[#162033]">
                {asset.category}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                Status
              </p>
              <div className="mt-1">
                <Badge>{asset.status}</Badge>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                Location
              </p>
              <p className="mt-1 text-sm font-semibold text-[#162033]">
                {asset.location}
              </p>
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Customer and site">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                  Customer
                </p>
                <p className="mt-1 text-sm font-semibold text-[#162033]">
                  {customer?.name ?? "Unknown customer"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                  Site
                </p>
                <p className="mt-1 text-sm font-semibold text-[#162033]">
                  {site?.name ?? "Unknown site"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                  Address
                </p>
                <p className="mt-1 text-sm text-[#5d6675]">
                  {site?.address ?? "No address available"}
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="Registration details">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                  Serial number
                </p>
                <p className="mt-1 text-sm text-[#162033]">
                  {asset.serialNumber || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                  Model
                </p>
                <p className="mt-1 text-sm text-[#162033]">
                  {asset.model || "Not provided"}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                    Installation
                  </p>
                  <p className="mt-1 text-sm text-[#162033]">
                    {asset.installationDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                    Warranty expiry
                  </p>
                  <p className="mt-1 text-sm text-[#162033]">
                    {asset.warrantyExpiry}
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Maintenance plans">
          {plans.length === 0 ? (
            <p className="text-sm text-[#5d6675]">
              No maintenance plans are configured for this asset.
            </p>
          ) : (
            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-xl border border-[#dfe4ea] bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[#162033]">
                        {plan.planName}
                      </h3>
                      <p className="mt-1 text-xs text-[#5d6675]">
                        {plan.frequency} · Next due {plan.nextDueDate}
                      </p>
                    </div>

                    <Badge>{plan.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Service history">
          {history.length === 0 ? (
            <p className="text-sm text-[#5d6675]">
              No service history is available.
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-[#dfe4ea] bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[#162033]">
                        {entry.summary}
                      </h3>
                      <p className="mt-1 text-xs text-[#5d6675]">
                        {entry.performedOn} · {entry.performedBy}
                      </p>
                    </div>

                    <Badge>{entry.outcome}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Documents">
            {documents.length === 0 ? (
              <p className="text-sm text-[#5d6675]">
                No documents are available.
              </p>
            ) : (
              <div className="space-y-3">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between rounded-xl border border-[#dfe4ea] bg-white p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#162033]">
                        {document.name}
                      </p>
                      <p className="mt-1 text-xs text-[#5d6675]">
                        {document.type} · {document.uploadedOn}
                      </p>
                    </div>

                    <span className="text-xs text-[#7a8494]">
                      Placeholder
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Work order handoff">
            {workOrders.length === 0 ? (
              <p className="text-sm text-[#5d6675]">
                No mock work orders are linked to this asset.
              </p>
            ) : (
              <div className="space-y-3">
                {workOrders.map((workOrder) => (
                  <div
                    key={workOrder.id}
                    className="rounded-xl border border-[#dfe4ea] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[#7a8494]">
                          {workOrder.reference}
                        </p>
                        <h3 className="mt-1 text-sm font-semibold text-[#162033]">
                          {workOrder.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#5d6675]">
                          Scheduled {workOrder.scheduledDate}
                        </p>
                      </div>

                      <Badge>{workOrder.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {asset.notes && (
          <Panel title="Notes">
            <p className="text-sm leading-6 text-[#5d6675]">{asset.notes}</p>
          </Panel>
        )}
      </div>
    </main>
  );
}