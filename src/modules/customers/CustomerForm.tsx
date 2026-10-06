"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/design-system";
import { getCustomers, saveCustomer } from "@/modules/assets/service";
import type { Customer, RecordStatus } from "@/modules/assets/types";

interface CustomerFormProps {
customer?: Customer;
}

export default function CustomerForm({ customer }: CustomerFormProps) {
const router = useRouter();
useEffect(() => {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);
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
const [errors, setErrors] = useState<{
  name?: string;
  code?: string;
  primaryContact?: string;
  status?: string;
  email?: string;
}>({});
const [saving, setSaving] = useState(false);


function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setErrors({});

  const trimmedName = name.trim();
  const trimmedCode = code.trim().toUpperCase();
  const trimmedContact = primaryContact.trim();
  const trimmedEmail = email.trim();
  const trimmedPhone = phone.trim();
  const trimmedAddress = address.trim();
  const trimmedNotes = notes.trim();

  const validationErrors: {
    name?: string;
    code?: string;
    primaryContact?: string;
    status?: string;
    email?: string;
  } = {};

  if (!trimmedName) {
    validationErrors.name = "Customer name is required.";
  }

  if (!trimmedCode) {
    validationErrors.code = "Customer code is required.";
  }

  if (!trimmedContact) {
    validationErrors.primaryContact = "Primary contact is required.";
  }

  if (!status) {
    validationErrors.status = "Status is required.";
  }

  const existingCodes = getCustomers()
    .filter((item) => item.id !== customer?.id)
    .map((item) => item.code.toLowerCase());

  if (
    trimmedCode &&
    existingCodes.includes(trimmedCode.toLowerCase())
  ) {
    validationErrors.code = "Customer code must be unique.";
  }

  if (
    trimmedEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
  ) {
    validationErrors.email = "Please enter a valid email address.";
  }

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
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
    setSaving(false);
  }
}
return (
  <div className="customer-form-page">
    <PageHeader
      title={isEdit ? "Edit Customer" : "Create Customer"}
      description={
        isEdit
          ? "Update customer details and service relationship information."
          : "Create a customer record for service management."
      }
      action={
        <div className="customer-form-header-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/customers")}
          >
            Cancel
          </Button>

          <Button type="submit" form="customer-form" loading={saving}>
            {isEdit ? "Save Changes" : "Create Customer"}
          </Button>
        </div>
      }
    />

    <form
      id="customer-form"
      onSubmit={handleSubmit}
      className="customer-form"
    >




      <div className="customer-form-grid">
        {/* Basic Information */}
        <section className="customer-form-card">
  <div className="customer-form-card-header">
    <h3>Basic Information</h3>
  </div>

  <div className="customer-form-fields">
    <label className="customer-form-field">
      <span className={errors.name ? "customer-form-label-error" : ""}>
        Customer Name{" "}
        <span className="customer-form-required">*</span>
      </span>

      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value);

          if (errors.name) {
            setErrors((current) => ({
              ...current,
              name: undefined,
            }));
          }
        }}
        placeholder="Enter customer name"
        required
        className={errors.name ? "customer-form-control-error" : ""}
      />

      {errors.name && (
        <span className="customer-form-field-error">
          {errors.name}
        </span>
      )}
    </label>

    <label className="customer-form-field">
      <span className={errors.code ? "customer-form-label-error" : ""}>
        Customer Code{" "}
        <span className="customer-form-required">*</span>
      </span>

      <input
        value={code}
        onChange={(event) => {
          setCode(event.target.value);

          if (errors.code) {
            setErrors((current) => ({
              ...current,
              code: undefined,
            }));
          }
        }}
        placeholder="e.g. HVM"
        required
        className={`customer-code-input ${
          errors.code ? "customer-form-control-error" : ""
        }`}
      />

      {errors.code && (
        <span className="customer-form-field-error">
          {errors.code}
        </span>
      )}
    </label>

    <label className="customer-form-field">
      <span
        className={
          errors.primaryContact
            ? "customer-form-label-error"
            : ""
        }
      >
        Primary Contact{" "}
        <span className="customer-form-required">*</span>
      </span>

      <input
        value={primaryContact}
        onChange={(event) => {
          setPrimaryContact(event.target.value);

          if (errors.primaryContact) {
            setErrors((current) => ({
              ...current,
              primaryContact: undefined,
            }));
          }
        }}
        placeholder="Enter primary contact"
        required
        className={
          errors.primaryContact
            ? "customer-form-control-error"
            : ""
        }
      />

      {errors.primaryContact && (
        <span className="customer-form-field-error">
          {errors.primaryContact}
        </span>
      )}
    </label>

    <label className="customer-form-field">
      <span
        className={
          errors.status ? "customer-form-label-error" : ""
        }
      >
        Status{" "}
        <span className="customer-form-required">*</span>
      </span>

      <select
        value={status}
        onChange={(event) => {
          setStatus(event.target.value as RecordStatus);

          if (errors.status) {
            setErrors((current) => ({
              ...current,
              status: undefined,
            }));
          }
        }}
        required
        className={
          errors.status
            ? "customer-form-control-error"
            : ""
        }
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {errors.status && (
        <span className="customer-form-field-error">
          {errors.status}
        </span>
      )}
    </label>
  </div>
</section>
        {/* Contact & Location */}
        <section className="customer-form-card">
          <div className="customer-form-card-header">
            <h3>Contact &amp; Location</h3>
          </div>

          <div className="customer-form-fields">
            <label className="customer-form-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
              />
            </label>

            <label className="customer-form-field">
              <span>Phone</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter phone number"
              />
            </label>

            <label className="customer-form-field customer-form-field-full">
              <span>Address</span>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={3}
                placeholder="Enter customer address"
              />
            </label>

            <label className="customer-form-field customer-form-field-full">
              <span>Notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="Optional notes"
              />
            </label>
          </div>
        </section>
      </div>
    </form>
  </div>
);
}
