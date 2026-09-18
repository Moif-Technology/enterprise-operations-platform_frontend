"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import { Button, Panel } from "@/components/ui/design-system";
import { getCustomers, saveCustomer } from "@/modules/assets/service";
import type { Customer, RecordStatus } from "@/modules/assets/types";

interface CustomerFormProps {
customer?: Customer;
}

export default function CustomerForm({ customer }: CustomerFormProps) {
const router = useRouter();
const isEdit = Boolean(customer);

const [name, setName] = useState(customer?.name ?? "");
const [code, setCode] = useState(customer?.code ?? "");
const [status, setStatus] = useState<RecordStatus>(
customer?.status ?? "active",
);
const [primaryContact, setPrimaryContact] = useState(
customer?.primaryContact ?? "",
);
const [email, setEmail] = useState(customer?.email ?? "");
const [phone, setPhone] = useState(customer?.phone ?? "");
const [address, setAddress] = useState(customer?.address ?? "");
const [notes, setNotes] = useState(customer?.notes ?? "");
const [error, setError] = useState("");
const [saving, setSaving] = useState(false);



function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();
setError("");


const trimmedName = name.trim();
const trimmedCode = code.trim().toUpperCase();
const trimmedContact = primaryContact.trim();
const trimmedEmail = email.trim();
const trimmedPhone = phone.trim();
const trimmedAddress = address.trim();
const trimmedNotes = notes.trim();

if (!trimmedName || !trimmedCode || !trimmedContact) {
  setError("Name, code, and primary contact are required.");
  return;
}

const existingCodes = getCustomers()
  .filter((item) => item.id !== customer?.id)
  .map((item) => item.code.toLowerCase());

if (existingCodes.includes(trimmedCode.toLowerCase())) {
  setError("Customer code must be unique.");
  return;
}

if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
  setError("Please enter a valid email address.");
  return;
}

setSaving(true);

const savedCustomer: Customer = {
  id: customer?.id ?? `cust-${Date.now()}`,
  name: trimmedName,
  code: trimmedCode,
  status,
  primaryContact: trimmedContact,
  ...(trimmedEmail ? { email: trimmedEmail } : {}),
  ...(trimmedPhone ? { phone: trimmedPhone } : {}),
  ...(trimmedAddress ? { address: trimmedAddress } : {}),
  ...(trimmedNotes ? { notes: trimmedNotes } : {}),
};

try {
  saveCustomer(savedCustomer);
  router.push(`/customers/${savedCustomer.id}`);
} catch {
  setError("Unable to save the customer. Please try again.");
  setSaving(false);
}

}

return ( <div className="space-y-6">
<PageHeader
title={isEdit ? "Edit Customer" : "Create Customer"}
description={
isEdit
? "Update customer details and service relationship information."
: "Create a customer record for service management."
}
/>


  <Panel
    title="Customer Details"
    description="Enter the customer information below."
  >
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700">
            Customer Name *
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
            placeholder="Enter customer name"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700">
            Customer Code *
          </span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm uppercase"
            placeholder="e.g. HVM"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700">
            Primary Contact *
          </span>
          <input
            value={primaryContact}
            onChange={(event) => setPrimaryContact(event.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
            placeholder="Enter primary contact"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700">
            Status
          </span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as RecordStatus)
            }
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
            placeholder="name@example.com"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Phone</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
            placeholder="Enter phone number"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-gray-700">Address</span>
        <textarea
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Enter customer address"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-gray-700">Notes</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          placeholder="Optional notes"
        />
      </label>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/customers")}
        >
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {isEdit ? "Save Changes" : "Create Customer"}
        </Button>
      </div>
    </form>
  </Panel>
</div>


);
}
