"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Panel } from "@/components/ui/design-system";
import {
  getAssets,
  getContracts,
  getCustomers,
  getSitesByCustomerId,
  saveContract,
} from "@/modules/assets/service";

import type { Contract } from "@/modules/assets/types";

interface ContractFormProps {
  contract?: Contract;
}

export default function ContractForm({ contract }: ContractFormProps) {
  const router = useRouter();

  const customers = getCustomers();

  const [customerId, setCustomerId] = useState(
    contract?.customerId ?? "",
  );

  const [siteId, setSiteId] = useState(
    contract?.siteIds[0] ?? "",
  );

  const [assetId, setAssetId] = useState(
    contract?.assetIds[0] ?? "",
  );

  const [error, setError] = useState("");

  const sites = customerId
    ? getSitesByCustomerId(customerId)
    : [];

  const assets = getAssets().filter(
    (asset) =>
      asset.customerId === customerId &&
      (!siteId || asset.siteId === siteId),
  );

  const isEdit = Boolean(contract);

  return (
    <div>
      {/* Contract form will be moved here next */}
    </div>
  );
}