"use client";

import { Button, Panel } from "@/components/ui/design-system";

import {
  getAssetById,
  getContractById,
  getCustomerById,
  getSiteById,
} from "@/modules/assets/service";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ContractDetailPage() {
  const params = useParams<{ contractId: string }>();
  const contractId = params.contractId;
  const contract = getContractById(contractId);

  const customer = contract
    ? getCustomerById(contract.customerId)
    : undefined;
  const sites = contract
  ? contract.siteIds
      .map((siteId) => getSiteById(siteId))
      .filter((site): site is NonNullable<typeof site> => Boolean(site))
  : [];
  const assets = contract
  ? contract.assetIds
      .map((assetId) => getAssetById(assetId))
      .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset))
  : [];
  if (!contract) {
    return (
      <main className="w-full max-w-full">
        <div className="w-full max-w-full space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Contract Not Found
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              The requested contract could not be found.
            </p>
          </div>

          <Link href="/contracts">
  <Button>
    Cancel
  </Button>
</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-full">
      <div className="w-full max-w-full space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {contract.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {contract.contractNumber}
            </p>
          </div>
<div>
  <p className="text-sm text-slate-500">Customer</p>
  <p className="mt-1 font-medium text-slate-900">
    {customer?.name ?? "Unknown customer"}
  </p>
</div>
<div className="flex items-center gap-2">
  <Link href={`/contracts/${contract.id}/edit`}>
    <Button>Edit Contract</Button>
  </Link>

<Link href={`/contracts/${contract.id}/renew`}>
  <Button variant="secondary">
    Renew
  </Button>
</Link>


  <Link href="/contracts">
    <Button variant="secondary">
      Back to Contracts
    </Button>
  </Link>
</div>
        </div>

        <Panel title="Contract Details">
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Contract Number</p>
              <p className="mt-1 font-medium text-slate-900">
                {contract.contractNumber}
              </p>
            </div>
        
            
            <div>
              <p className="text-sm text-slate-500">Sites</p>
              <div className="mt-1 space-y-1">
                {sites.length > 0 ? (
                  sites.map((site) => (
                    <p key={site.id} className="font-medium text-slate-900">
                      {site.name} ({site.code})
                    </p>
                  ))
                ) : (
                  <p className="text-slate-500">No sites linked</p>
                )}
              </div>
            </div>

     



            <div>
              <p className="text-sm text-slate-500">Assets</p>
              <div className="mt-1 space-y-1">
                {assets.length > 0 ? (
                  assets.map((asset) => (
                    <p key={asset.id} className="font-medium text-slate-900">
                      {asset.name} ({asset.assetCode})
                    </p>
                  ))
                ) : (
                  <p className="text-slate-500">No assets linked</p>
                )}
              </div>
            </div>

        


            <div>
              <p className="text-sm text-slate-500">Type</p>
              <p className="mt-1 font-medium text-slate-900">
                {contract.type}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Start Date</p>
              <p className="mt-1 font-medium text-slate-900">
                {contract.startDate}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">End Date</p>
              <p className="mt-1 font-medium text-slate-900">
                {contract.endDate}
              </p>
            </div>
          



<div className="grid gap-4 md:grid-cols-2">
  <div>
    <label
      htmlFor="responseHours"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Response Time (hours)
    </label>
    <input
      id="responseHours"
      name="responseHours"
      type="number"
      min="0"
      placeholder="e.g. 4"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
    />
  </div>

  <div>
    <label
      htmlFor="resolutionHours"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Resolution Time (hours)
    </label>
    <input
      id="resolutionHours"
      name="resolutionHours"
      type="number"
      min="0"
      placeholder="e.g. 24"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
    />
  </div>
</div>

            <div>
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-1 font-medium text-slate-900">
                {contract.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Currency</p>
              <p className="mt-1 font-medium text-slate-900">
                {contract.currency}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-slate-500">Service Scope</p>
              <p className="mt-1 text-slate-900">
                {contract.serviceScope}
              </p>
            </div>
          </div>
        </Panel>
        <Panel title="Coverage & SLA">
  <div className="grid gap-6 md:grid-cols-2">
    <div>
      <p className="text-sm text-slate-500">Covered Sites</p>
      <div className="mt-1 space-y-1">
        {sites.length > 0 ? (
          sites.map((site) => (
            <p key={site.id} className="font-medium text-slate-900">
              {site.name} ({site.code})
            </p>
          ))
        ) : (
          <p className="text-slate-500">No sites covered</p>
        )}
      </div>
    </div>

    <div>
      <p className="text-sm text-slate-500">Covered Assets</p>
      <div className="mt-1 space-y-1">
        {assets.length > 0 ? (
          assets.map((asset) => (
            <p key={asset.id} className="font-medium text-slate-900">
              {asset.name} ({asset.assetCode})
            </p>
          ))
        ) : (
          <p className="text-slate-500">Site-wide coverage</p>
        )}
      </div>
    </div>
  </div>
  <div className="mt-6 grid gap-6 md:grid-cols-2">
  <div>
    <p className="text-sm text-slate-500">Visit Frequency</p>
    <p className="mt-1 font-medium text-slate-900">
      {contract.visitFrequency ?? "Not specified"}
    </p>
  </div>

  <div>
    <p className="text-sm text-slate-500">Response Time</p>
    <p className="mt-1 font-medium text-slate-900">
      {contract.responseHours != null
        ? `${contract.responseHours} hours`
        : "Not specified"}
    </p>
  </div>

  <div>
    <p className="text-sm text-slate-500">Resolution Time</p>
    <p className="mt-1 font-medium text-slate-900">
      {contract.resolutionHours != null
        ? `${contract.resolutionHours} hours`
        : "Not specified"}
    </p>
  </div>

  <div>
    <p className="text-sm text-slate-500">Exclusions</p>
    <p className="mt-1 font-medium text-slate-900">
      {contract.exclusions ?? "None specified"}
    </p>
  </div>
</div>
</Panel>
      </div>
    </main>
  );
}