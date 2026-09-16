
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Panel } from "@/components/ui/design-system";
import {
    getAssets,
    getCustomers,
    getSitesByCustomerId,
  } from "@/modules/assets/service";

export default function NewContractPage() {
    const customers = getCustomers();
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [siteId, setSiteId] = useState("");
  const sites = customerId ? getSitesByCustomerId(customerId) : [];
  const assets = getAssets().filter(
    (asset) =>
      asset.customerId === customerId &&
      (!siteId || asset.siteId === siteId),
  );

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
</div>
        </Panel>
      </div>
    </main>
  );
}

