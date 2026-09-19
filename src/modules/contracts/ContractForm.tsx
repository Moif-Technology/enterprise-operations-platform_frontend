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
  mode?: "edit" | "renew";
}

export default function ContractForm({
  contract,
  mode = "edit",
}: ContractFormProps) {
  const router = useRouter();
  const customers = getCustomers().filter(
    (customer) => customer.status === "active",
  );

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sites = customerId
  ? getSitesByCustomerId(customerId).filter(
      (site) =>
        site.status === "active" ||
        site.id === contract?.siteIds[0],
    )
  : [];

  const assets = getAssets().filter(
    (asset) =>
      asset.status === "active" &&
      asset.customerId === customerId &&
      (!siteId || asset.siteId === siteId),
  );
  
  

  const isEdit = Boolean(contract) && mode === "edit";
const isRenew = Boolean(contract) && mode === "renew";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const enteredContractNumber = String(
      formData.get("contractNumber") ?? "",
    ).trim();
    
    const contractNumber = isRenew
      ? `${enteredContractNumber}-R1`
      : enteredContractNumber;
      
    const title = String(formData.get("title") ?? "").trim();
    const type = String(formData.get("type") ?? "AMC");
    const status = isRenew
  ? "draft"
  : String(formData.get("status") ?? "draft");
    const startDate = String(formData.get("startDate") ?? "");
    const endDate = String(formData.get("endDate") ?? "");

    const serviceScope = String(
      formData.get("serviceScope") ?? "",
    ).trim();

    if (
      !contractNumber ||
      !title ||
      !customerId ||
      !startDate ||
      !endDate
    ) {
      setError(
        "Contract number, title, customer, start date, and end date are required.",
      );
      setIsSubmitting(false);
      return;
    }

    if (endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }

    if (!serviceScope) {
      setError("Service scope is required.");
      return;
    }
    if (
      isRenew &&
      contract &&
      getContracts().some((item) => item.originalContractId === contract.id)
    ) {
      setError("A renewal draft already exists for this contract.");
      return;
    }
    
    const contractNumberExists = getContracts().some(
      (item) =>
        item.id !== contract?.id &&
        item.contractNumber.toLowerCase() ===
          contractNumber.toLowerCase(),
    );

    if (contractNumberExists) {
      setError("Contract number must be unique.");
      return;
    }

    const selectedSite = sites.find(
      (site) => site.id === siteId,
    );

    if (siteId && !selectedSite) {
      setError(
        "Selected site does not belong to the selected customer.",
      );
      return;
    }

    const selectedAsset = assets.find(
      (asset) => asset.id === assetId,
    );

    if (assetId && !selectedAsset) {
      setError(
        "Selected asset does not match the selected customer or site.",
      );
      return;
    }

    const valueInput = String(
      formData.get("value") ?? "",
    ).trim();

    const responseInput = String(
      formData.get("responseHours") ?? "",
    ).trim();

    const resolutionInput = String(
      formData.get("resolutionHours") ?? "",
    ).trim();

    const value = valueInput
      ? Number(valueInput)
      : undefined;

    const responseHours = responseInput
      ? Number(responseInput)
      : undefined;

    const resolutionHours = resolutionInput
      ? Number(resolutionInput)
      : undefined;

    if (
      value !== undefined &&
      (!Number.isFinite(value) || value < 0)
    ) {
      setError(
        "Contract value must be a valid non-negative number.",
      );
      return;
    }

    if (
      responseHours !== undefined &&
      (!Number.isFinite(responseHours) || responseHours < 0)
    ) {
      setError(
        "Response time must be a valid non-negative number.",
      );
      return;
    }

    if (
      resolutionHours !== undefined &&
      (!Number.isFinite(resolutionHours) || resolutionHours < 0)
    ) {
      setError(
        "Resolution time must be a valid non-negative number.",
      );
      return;
    }

    if (
      responseHours !== undefined &&
      resolutionHours !== undefined &&
      responseHours > resolutionHours
    ) {
      setError(
        "Response time must be less than or equal to resolution time.",
      );
      return;
    }

    const savedContract: Contract = {
      id: isRenew
  ? `contract-${Date.now()}`
  : contract?.id ?? `contract-${Date.now()}`,
      contractNumber,
      title,
      customerId,
      siteIds: siteId ? [siteId] : [],
      assetIds: assetId ? [assetId] : [],
      type: type as "AMC" | "Warranty" | "Service",
      startDate,
      endDate,
      status: status as "draft" | "active" | "cancelled",
      serviceScope,
      exclusions:
        String(formData.get("exclusions") ?? "").trim() ||
        undefined,
      visitFrequency:
        String(formData.get("visitFrequency") ?? "").trim() ||
        undefined,
      value,
      currency: String(
        formData.get("currency") ?? "INR",
      ) as "INR" | "USD",
      responseHours,
      resolutionHours,
      notes:
        String(formData.get("notes") ?? "").trim() ||
        undefined,
       
...(isRenew && contract
  ? { originalContractId: contract.id }
  : contract?.originalContractId
    ? { originalContractId: contract.originalContractId }
    : {}),


    };
    const saved = saveContract(savedContract);

    console.log("SAVED CONTRACT:", saved);
    console.log("ALL CONTRACTS:", getContracts());
    
    router.push(`/contracts/${saved.id}`);
  };

  return (
    <div className="space-y-6">
    <Panel
  title={
    isRenew
      ? "Renew Contract"
      : isEdit
        ? "Edit Contract"
        : "Create Contract"
  }
>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {error && (
              <p
                className="mb-4 text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}

<div className="grid gap-4 md:grid-cols-2">
  <label className="text-sm font-medium text-slate-700">
    Contract Number
    <input
      name="contractNumber"
      defaultValue={contract?.contractNumber ?? ""}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    />
  </label>

  <label className="text-sm font-medium text-slate-700">
    Title
    <input
      name="title"
      defaultValue={contract?.title ?? ""}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    />
  </label>

  <label className="text-sm font-medium text-slate-700">
    Type
    <select
      name="type"
      defaultValue={contract?.type ?? "AMC"}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    >
      <option value="AMC">AMC</option>
      <option value="Warranty">Warranty</option>
      <option value="Service">Service</option>
    </select>
  </label>

  <label className="text-sm font-medium text-slate-700">
    Status
    <select
      name="status"
      defaultValue={contract?.status ?? "draft"}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    >
      <option value="draft">Draft</option>
      <option value="active">Active</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </label>
</div>
<div className="grid gap-4 md:grid-cols-2">
  <label className="text-sm font-medium text-slate-700">
    Customer
    <select
      name="customerId"
      value={customerId}
      onChange={(event) => {
        setCustomerId(event.target.value);
        setSiteId("");
        setAssetId("");
      }}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    >
      <option value="">Select customer</option>
      {customers.map((customer) => (
        <option key={customer.id} value={customer.id}>
          {customer.name} ({customer.code})
        </option>
      ))}
    </select>
  </label>

  <label className="text-sm font-medium text-slate-700">
    Site
    <select
      name="siteId"
      value={siteId}
      onChange={(event) => {
        setSiteId(event.target.value);
        setAssetId("");
      }}
      disabled={!customerId}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 disabled:bg-slate-100"
    >
      <option value="">Site-wide coverage</option>
      {sites.map((site) => (
        <option key={site.id} value={site.id}>
          {site.name} ({site.code})
        </option>
      ))}
    </select>
  </label>
</div>
<div>
  <label className="text-sm font-medium text-slate-700">
    Asset
    <select
      name="assetId"
      value={assetId}
      onChange={(event) => setAssetId(event.target.value)}
      disabled={!customerId}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 disabled:bg-slate-100"
    >
      <option value="">Site-wide coverage / No specific asset</option>
      {assets.map((asset) => (
        <option key={asset.id} value={asset.id}>
          {asset.name} ({asset.assetCode})
        </option>
      ))}
    </select>
  </label>

  <p className="mt-1 text-xs text-slate-500">
    Leave empty when the contract covers the selected site rather than specific assets.
  </p>
</div>
<div className="grid gap-4 md:grid-cols-2">
  <label className="text-sm font-medium text-slate-700">
    Start Date
    <input
      name="startDate"
      type="date"
      defaultValue={isRenew ? "" : contract?.startDate ?? ""}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    />
  </label>

  <label className="text-sm font-medium text-slate-700">
    End Date
    <input
      name="endDate"
      type="date"
      defaultValue={isRenew ? "" : contract?.endDate ?? ""}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    />
  </label>
</div>

<div>
  <label
    htmlFor="serviceScope"
    className="mb-2 block text-sm font-medium text-slate-700"
  >
    Service Scope
  </label>
  <textarea
    id="serviceScope"
    name="serviceScope"
    rows={4}
    defaultValue={contract?.serviceScope ?? ""}
    placeholder="Describe the services covered by this contract"
    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
  />
</div>
<div className="grid gap-4 md:grid-cols-2">
  <div>
    <label
      htmlFor="exclusions"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Exclusions
    </label>
    <textarea
      id="exclusions"
      name="exclusions"
      rows={4}
      defaultValue={contract?.exclusions ?? ""}
      placeholder="Describe any excluded services or items"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
    />
  </div>

  <div>
    <label
      htmlFor="visitFrequency"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Visit Frequency
    </label>
    <input
      id="visitFrequency"
      name="visitFrequency"
      type="text"
      defaultValue={contract?.visitFrequency ?? ""}
      placeholder="e.g. Monthly"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
    />
  </div>
</div>
<div className="grid gap-4 md:grid-cols-2">
  <label className="text-sm font-medium text-slate-700">
    Contract Value
    <input
      name="value"
      type="number"
      min="0"
      step="0.01"
      defaultValue={contract?.value ?? ""}
      placeholder="e.g. 120000"
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    />
  </label>

  <label className="text-sm font-medium text-slate-700">
    Currency
    <select
      name="currency"
      defaultValue={contract?.currency ?? "INR"}
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    >
      <option value="INR">INR</option>
      <option value="USD">USD</option>
    </select>
  </label>
</div>
<div className="grid gap-4 md:grid-cols-2">
  <label className="text-sm font-medium text-slate-700">
    Response Time (hours)
    <input
      name="responseHours"
      type="number"
      min="0"
      step="0.5"
      defaultValue={contract?.responseHours ?? ""}
      placeholder="e.g. 4"
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    />
  </label>

  <label className="text-sm font-medium text-slate-700">
    Resolution Time (hours)
    <input
      name="resolutionHours"
      type="number"
      min="0"
      step="0.5"
      defaultValue={contract?.resolutionHours ?? ""}
      placeholder="e.g. 24"
      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
    />
  </label>
</div>
<div>
  <label
    htmlFor="notes"
    className="mb-2 block text-sm font-medium text-slate-700"
  >
    Notes
  </label>
  <textarea
    id="notes"
    name="notes"
    rows={4}
    defaultValue={contract?.notes ?? ""}
    placeholder="Add any additional contract notes"
    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
  />
</div>
          </div>

          <div className="flex justify-end border-t border-slate-200 p-6">
          <Button type="submit">
  {isRenew
    ? "Create Renewal"
    : isEdit
      ? "Save Changes"
      : "Create Contract"}
</Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}