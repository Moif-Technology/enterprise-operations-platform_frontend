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
    (customer) =>
      customer.status === "active" ||
      customer.id === contract?.customerId,
  );
  
  const [customerId, setCustomerId] = useState(
    contract?.customerId ?? "",
  );

  const [siteIds, setSiteIds] = useState<string[]>(
    contract?.siteIds ?? [],
  );
  
  const [assetIds, setAssetIds] = useState<string[]>(
    contract?.assetIds ?? [],
  );

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const sites = customerId
  ? getSitesByCustomerId(customerId).filter(
      (site) =>
        site.status === "active" ||
      contract?.siteIds.includes(site.id)
    )
  : [];

  const assets = getAssets().filter(
    (asset) =>
      asset.status === "active" &&
      asset.customerId === customerId &&
      (!siteIds.length || siteIds.includes(asset.siteId)),
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
      getContracts().some(
        item =>
          item.originalContractId === contract.id ||
          item.id === contract.id ||
          item.originalContractId === contract.originalContractId,
      )
    ) {
      setError("A renewal draft already exists for this contract.");
      setIsSubmitting(false);
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

    if (!siteIds.length) {
      setError("At least one site is required.");
      return;
    }
    
    const invalidSite = siteIds.some(
      (siteId) => !sites.some((site) => site.id === siteId),
    );
    
    if (invalidSite) {
      setError(
        "One or more selected sites do not belong to the selected customer.",
      );
      return;
    }
    const invalidAsset = assetIds.some(
      (assetId) => !assets.some((asset) => asset.id === assetId),
    );
    
    if (invalidAsset) {
      setError(
        "One or more selected assets do not match the selected customer or site.",
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
      (!Number.isFinite(responseHours) || responseHours <= 0)
    ) {
      setError(
        "Response time must be a valid non-negative number.",
      );
      return;
    }

    if (
      resolutionHours !== undefined &&
      (!Number.isFinite(resolutionHours) || resolutionHours <= 0)
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
      siteIds: siteIds.length ? siteIds : [],
      assetIds: assetIds.length ? assetIds : [],
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
            </div>

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
        setSiteIds([]);
        setAssetIds([]);
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

  <div className="text-sm font-medium text-slate-700">
  <label>Site</label>

  <div className="relative mt-1">
    <button
      type="button"
      onClick={() => setIsSiteDropdownOpen((open) => !open)}
      disabled={!customerId}
      aria-expanded={isSiteDropdownOpen}
      className="flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-left disabled:bg-slate-100"
    >
      <span>
        {siteIds.length > 0
          ? `${siteIds.length} site${siteIds.length > 1 ? "s" : ""} selected`
          : "Select sites"}
      </span>

      <span>{isSiteDropdownOpen ? "▲" : "▼"}</span>
    </button>

    {isSiteDropdownOpen && customerId && (
      <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-md border border-slate-300 bg-white p-2 shadow-lg">
        {sites.map((site) => (
          <label
            key={site.id}
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 font-normal hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={siteIds.includes(site.id)}
              onChange={(event) => {
                setSiteIds((currentSiteIds) =>
                  event.target.checked
                    ? [...currentSiteIds, site.id]
                    : currentSiteIds.filter((id) => id !== site.id),
                );
                setAssetIds([]);
              }}
            />

            <span>
              {site.name} ({site.code})
            </span>
          </label>
        ))}
      </div>
    )}
  </div>
</div>
<div>
<div className="text-sm font-medium text-slate-700">
  <label>Asset</label>

  <div className="relative mt-1">
    <button
      type="button"
      onClick={() => setIsAssetDropdownOpen((open) => !open)}
      disabled={!customerId}
      aria-expanded={isAssetDropdownOpen}
      className="flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-left disabled:bg-slate-100"
    >
      <span>
        {assetIds.length > 0
          ? `${assetIds.length} asset${assetIds.length > 1 ? "s" : ""} selected`
          : "Select assets"}
      </span>

      <span>{isAssetDropdownOpen ? "▲" : "▼"}</span>
    </button>

    {isAssetDropdownOpen && customerId && (
      <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-md border border-slate-300 bg-white p-2 shadow-lg">
        {assets.length > 0 ? (
          assets.map((asset) => (
            <label
              key={asset.id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 font-normal hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={assetIds.includes(asset.id)}
                onChange={(event) => {
                  setAssetIds((currentAssetIds) =>
                    event.target.checked
                      ? [...currentAssetIds, asset.id]
                      : currentAssetIds.filter(
                          (id) => id !== asset.id,
                        ),
                  );
                }}
              />

              <span>
                {asset.name} ({asset.assetCode})
              </span>
            </label>
          ))
        ) : (
          <p className="px-2 py-2 text-sm text-slate-500">
            No eligible assets for the selected customer and site.
          </p>
        )}
      </div>
    )}

   
  </div>
</div>

<p className="mt-1 text-xs text-slate-500">
  {assetIds.length === 0
    ? "Coverage: Site-wide"
    : "Select specific assets covered by this contract."}
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