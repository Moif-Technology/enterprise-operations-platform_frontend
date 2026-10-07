"use client";

import { useParams } from "next/navigation";

import {
  getAssetById,
  getContractById,
  getCustomerById,
  getSiteById,
} from "@/modules/assets/service";

import ContractDetail from "@/modules/contracts/ContractDetail";

export default function ContractDetailPage() {
  const params = useParams<{ contractId: string }>();
  const contractId = params.contractId;

  const contract = getContractById(contractId);

  if (!contract) {
    return (
      <main className="contract-detail-page">
        <div className="contract-detail-not-found">
          <h1>Contract Not Found</h1>
          <p>The requested contract could not be found.</p>
        </div>
      </main>
    );
  }

  const customer = getCustomerById(contract.customerId);

  const sites = contract.siteIds
    .map((siteId) => getSiteById(siteId))
    .filter(
      (site): site is NonNullable<typeof site> =>
        Boolean(site),
    );

  const assets = contract.assetIds
    .map((assetId) => getAssetById(assetId))
    .filter(
      (asset): asset is NonNullable<typeof asset> =>
        Boolean(asset),
    );

  return (
    <ContractDetail
      contract={contract}
      customer={customer}
      sites={sites}
      assets={assets}
    />
  );
}