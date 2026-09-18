
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Panel } from "@/components/ui/design-system";
import {
  getAssets,
  getContracts,
  getCustomers,
  getSitesByCustomerId,
  saveContract,
} from "@/modules/assets/service";

export default function NewContractPage() {
    const customers = getCustomers();
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [assetId, setAssetId] = useState("");
const [error, setError] = useState("");
  const sites = customerId ? getSitesByCustomerId(customerId) : [];
  const assets = getAssets().filter(
    (asset) =>
      asset.customerId === customerId &&
      (!siteId || asset.siteId === siteId),
  );
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError("");

  const formData = new FormData(event.currentTarget);

  const contractNumber = String(
    formData.get("contractNumber") ?? "",
  ).trim();
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "AMC");
  const status = String(formData.get("status") ?? "draft");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const serviceScope = String(
    formData.get("serviceScope") ?? "",
  ).trim();

  if (!contractNumber || !title || !customerId || !startDate || !endDate) {
    setError(
      "Contract number, title, customer, start date, and end date are required.",
    );
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

  const contractNumberExists = getContracts().some(
    (contract) =>
      contract.contractNumber.toLowerCase() ===
      contractNumber.toLowerCase(),
  );

  if (contractNumberExists) {
    setError("Contract number must be unique.");
    return;
  }

  const selectedSite = sites.find((site) => site.id === siteId);
  if (siteId && !selectedSite) {
    setError("Selected site does not belong to the selected customer.");
    return;
  }

  const selectedAsset = assets.find((asset) => asset.id === assetId);
  if (assetId && !selectedAsset) {
    setError("Selected asset does not match the selected customer or site.");
    return;
  }

  const valueInput = String(formData.get("value") ?? "").trim();
  const responseInput = String(
    formData.get("responseHours") ?? "",
  ).trim();
  const resolutionInput = String(
    formData.get("resolutionHours") ?? "",
  ).trim();

  const value = valueInput ? Number(valueInput) : undefined;
  const responseHours = responseInput
    ? Number(responseInput)
    : undefined;
  const resolutionHours = resolutionInput
    ? Number(resolutionInput)
    : undefined;

  if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
    setError("Contract value must be a valid non-negative number.");
    return;
  }

  if (
    responseHours !== undefined &&
    (!Number.isFinite(responseHours) || responseHours < 0)
  ) {
    setError("Response time must be a valid non-negative number.");
    return;
  }

  if (
    resolutionHours !== undefined &&
    (!Number.isFinite(resolutionHours) || resolutionHours < 0)
  ) {
    setError("Resolution time must be a valid non-negative number.");
    return;
  }

  if (
    responseHours !== undefined &&
    resolutionHours !== undefined &&
    responseHours > resolutionHours
  ) {
    setError("Response time must be less than or equal to resolution time.");
    return;
  }

  saveContract({
    id: `contract-${Date.now()}`,
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
      String(formData.get("exclusions") ?? "").trim() || undefined,
    visitFrequency:
      String(formData.get("visitFrequency") ?? "").trim() || undefined,
    value,
    currency: String(formData.get("currency") ?? "INR") as "INR" | "USD",
    responseHours,
    resolutionHours,
    notes: String(formData.get("notes") ?? "").trim() || undefined,
  });

  router.push("/contracts");
};

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Create Contract
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Create a new contract or AMC record.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => router.push("/contracts")}
          >
            Cancel
          </Button>
        </div>

      <Panel title="Contract Form">
  <form onSubmit={handleSubmit}>
    <div className="grid gap-6 p-6 md:grid-cols-2">
  <div>
    <label
      htmlFor="contractNumber"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Contract Number
    </label>
    <input
      id="contractNumber"
      name="contractNumber"
      type="text"
      placeholder="e.g. AMC-2026-002"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label
      htmlFor="title"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Title
    </label>
    <input
      id="title"
      name="title"
      type="text"
      placeholder="Contract title"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label
      htmlFor="type"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Contract Type
    </label>
    <select
      id="type"
      name="type"
      defaultValue="AMC"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    >
      <option value="AMC">AMC</option>
      <option value="Warranty">Warranty</option>
      <option value="Service">Service</option>
    </select>
  </div>
  <div>
  <label
    htmlFor="customerId"
    className="mb-2 block text-sm font-medium text-slate-700"
  >
    Customer
  </label>
  <select
  id="customerId"
  name="customerId"
  value={customerId}
  onChange={(event) => setCustomerId(event.target.value)}
    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
  >
    <option value="">Select customer</option>
    {customers.map((customer) => (
      <option key={customer.id} value={customer.id}>
        {customer.name} ({customer.code})
      </option>
    ))}
  </select>
</div>
  <div>
    <label
      htmlFor="siteId"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Site
    </label>
    <select
      id="siteId"
      name="siteId"
      value={siteId}
      onChange={(event) => setSiteId(event.target.value)}
      disabled={!customerId}
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none disabled:bg-slate-100"
    >
      <option value="">
        {customerId ? "Select site" : "Select customer first"}
      </option>
      {sites.map((site) => (
        <option key={site.id} value={site.id}>
          {site.name} ({site.code})
        </option>
      ))}
    </select>
  </div>
    <div>
    <label
      htmlFor="assetId"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Asset
    </label>
<select
  id="assetId"
  name="assetId"
  value={assetId}
  onChange={(event) => setAssetId(event.target.value)}
      disabled={!customerId}
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none disabled:bg-slate-100"
    >
      <option value="">
        {customerId ? "Select asset" : "Select customer first"}
      </option>
      {assets.map((asset) => (
        <option key={asset.id} value={asset.id}>
          {asset.name} ({asset.assetCode})
        </option>
      ))}
    </select>
  </div>
  <div>
    <label
      htmlFor="status"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Status
    </label>
    <select
      id="status"
      name="status"
      defaultValue="draft"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    >
      <option value="draft">Draft</option>
      <option value="active">Active</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </div>

  <div>
    <label
      htmlFor="startDate"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Start Date
    </label>
    <input
      id="startDate"
      name="startDate"
      type="date"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label
      htmlFor="endDate"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      End Date
    </label>
    <input
      id="endDate"
      name="endDate"
      type="date"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>
    <div className="md:col-span-2">
    <label
      htmlFor="serviceScope"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Service Scope
    </label>
    <textarea
      id="serviceScope"
      name="serviceScope"
      rows={3}
      placeholder="Describe the services covered by this contract."
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div className="md:col-span-2">
    <label
      htmlFor="exclusions"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Exclusions
    </label>
    <textarea
      id="exclusions"
      name="exclusions"
      rows={3}
      placeholder="Describe services or items excluded from the contract."
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
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
      placeholder="e.g. Monthly"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label
      htmlFor="value"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Contract Value
    </label>
    <input
      id="value"
      name="value"
      type="number"
      min="0"
      step="0.01"
      placeholder="e.g. 120000"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label
      htmlFor="currency"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Currency
    </label>
    <select
      id="currency"
      name="currency"
      defaultValue="INR"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    >
      <option value="INR">INR</option>
      <option value="USD">USD</option>
    </select>
  </div>

  <div>
    <label
      htmlFor="responseHours"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Response Time (Hours)
    </label>
    <input
      id="responseHours"
      name="responseHours"
      type="number"
      min="0"
      step="1"
      placeholder="e.g. 4"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div>
    <label
      htmlFor="resolutionHours"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Resolution Time (Hours)
    </label>
    <input
      id="resolutionHours"
      name="resolutionHours"
      type="number"
      min="0"
      step="1"
      placeholder="e.g. 24"
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>

  <div className="md:col-span-2">
    <label
      htmlFor="notes"
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      Notes
    </label>
    <textarea
      id="notes"
      name="notes"
      rows={3}
      placeholder="Additional contract notes."
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
    />
  </div>
    </div>

    {error && (
      <p className="px-6 pb-4 text-sm text-red-600" role="alert">
        {error}
      </p>
    )}

    <div className="flex justify-end border-t border-slate-200 p-6">
      <Button type="submit">
        Create Contract
      </Button>
    </div>
  </form>
</Panel>
      </div>
    </main>
  );
}

