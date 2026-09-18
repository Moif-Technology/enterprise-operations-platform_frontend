
"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { Button, Panel } from "@/components/ui/design-system";
import { getAssets, getCustomers, getSites, saveSite, } from "@/modules/assets/service";
import type { Customer, Site } from "@/modules/assets/types";

interface SiteFormProps {
  site?: Site;
}

export default function SiteForm({ site }: SiteFormProps) {
  const router = useRouter();

  const customers = useMemo(() => getCustomers(), []);
  const sites = useMemo(() => getSites(), []);

  const [name, setName] = useState(site?.name ?? "");
  const [code, setCode] = useState(site?.code ?? "");
  const [customerId, setCustomerId] = useState(site?.customerId ?? "");
  const [address, setAddress] = useState(site?.address ?? "");
  const [status, setStatus] = useState<"active" | "inactive">(
    site?.status ?? "active"
  );
  const [location, setLocation] = useState(site?.location ?? "");
  const [contactName, setContactName] = useState(site?.contactName ?? "");
  const [contactPhone, setContactPhone] = useState(
    site?.contactPhone ?? ""
  );
  const [error, setError] = useState("");

  const isEdit = Boolean(site);

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setError("");

  const trimmedName = name.trim();
  const trimmedCode = code.trim();
  const trimmedAddress = address.trim();


  if (!trimmedName || !trimmedCode || !customerId || !trimmedAddress) {
    setError(
      "Site name, site code, customer, and address are required."
    );
    return;
  }

  const duplicate = sites.some(
    (item) =>
      item.id !== site?.id &&
      item.customerId === customerId &&
      item.code.toLowerCase() === trimmedCode.toLowerCase()
  );

  
  if (duplicate) {
    setError("Site code must be unique within the selected customer.");
    return;
  }

  const customer = customers.find(
    (item) => item.id === customerId
  );

  if (!customer) {
    setError("Please select a valid customer.");
    return;
  }

if (site && site.customerId !== customerId) {
  const linkedAssets = getAssets().filter(
    (asset) => asset.siteId === site.id
  );

  if (linkedAssets.length > 0) {
    setError("Customer cannot be changed because this site has linked assets.");
    return;
  }
}


  const savedSite: Site = {
    id: site?.id ?? `site-${Date.now()}`,
    customerId,
    name: trimmedName,
    code: trimmedCode,
    address: trimmedAddress,
    status,
    ...(location.trim()
      ? { location: location.trim() }
      : {}),
    ...(contactName.trim()
      ? { contactName: contactName.trim() }
      : {}),
    ...(contactPhone.trim()
      ? { contactPhone: contactPhone.trim() }
      : {}),
  };

  

  const result = saveSite(savedSite);

 

  router.push(`/sites/${result.id}`);
}



  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Site" : "Create Site"}
        description={
          isEdit
            ? "Update site information."
            : "Create a new customer site."
        }
      />

      <Panel
        title="Site Details"
        description="Enter the site and customer information."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Site Name *
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="input w-full"
                placeholder="Enter site name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Site Code *
              </label>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="input w-full"
                placeholder="Enter site code"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Customer *
              </label>
              <select
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                className="input w-full"
              >
                <option value="">Select customer</option>

                {customers.map((customer: Customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "active" | "inactive")
                }
                className="input w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address *
              </label>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="input w-full"
                placeholder="Enter site address"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Location
              </label>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="input w-full"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Contact Name
              </label>
              <input
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                className="input w-full"
                placeholder="Enter contact name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Contact Phone
              </label>
              <input
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
                className="input w-full"
                placeholder="Enter contact phone"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Site"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/sites")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

