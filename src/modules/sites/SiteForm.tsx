"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/design-system";

import {
  getAssets,
  getCustomers,
  getContracts,
  getSites,
  saveSite,
} from "@/modules/assets/service";

import type { Customer, Site } from "@/modules/assets/types";

interface SiteFormProps {
  site?: Site;
}

interface SiteFormErrors {
  name?: string;
  code?: string;
  customerId?: string;
  address?: string;
}

export default function SiteForm({ site }: SiteFormProps) {
  const router = useRouter();

  const customers = useMemo(() => {
    const allCustomers = getCustomers();

    return allCustomers.filter(
      (customer) =>
        customer.status === "active" ||
        customer.id === site?.customerId,
    );
  }, [site?.customerId]);

  const sites = useMemo(() => getSites(), []);

  const [name, setName] = useState(site?.name ?? "");
  const [code, setCode] = useState(site?.code ?? "");
  const [customerId, setCustomerId] = useState(site?.customerId ?? "");
  const [address, setAddress] = useState(site?.address ?? "");
  const [status, setStatus] = useState<"active" | "inactive">(
    site?.status ?? "active",
  );
  const [location, setLocation] = useState(site?.location ?? "");
  const [contactName, setContactName] = useState(site?.contactName ?? "");
  const [contactPhone, setContactPhone] = useState(
    site?.contactPhone ?? "",
  );

  const [errors, setErrors] = useState<SiteFormErrors>({});
  const [formError, setFormError] = useState("");

  const isEdit = Boolean(site);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrors({});
    setFormError("");

    const trimmedName = name.trim();
    const trimmedCode = code.trim();
    const trimmedAddress = address.trim();

    const validationErrors: SiteFormErrors = {};

    if (!trimmedName) {
      validationErrors.name = "Site name is required.";
    }

    if (!trimmedCode) {
      validationErrors.code = "Site code is required.";
    }

    if (!customerId) {
      validationErrors.customerId = "Customer is required.";
    }

    if (!trimmedAddress) {
      validationErrors.address = "Address is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const duplicate = sites.some(
      (item) =>
        item.id !== site?.id &&
        item.customerId === customerId &&
        item.code.toLowerCase() === trimmedCode.toLowerCase(),
    );

    if (duplicate) {
      setErrors({
        code: "Site code must be unique within the selected customer.",
      });
      return;
    }

    const customer = customers.find(
      (item) => item.id === customerId,
    );

    if (!customer) {
      setErrors({
        customerId: "Please select a valid customer.",
      });
      return;
    }

    if (site && site.customerId !== customerId) {
      const linkedAssets = getAssets().filter(
        (asset) => asset.siteId === site.id,
      );

      const linkedContracts = getContracts().filter((contract) =>
        contract.siteIds.includes(site.id),
      );

      if (linkedAssets.length > 0 || linkedContracts.length > 0) {
        setFormError(
          "Customer cannot be changed because this site is linked to assets or contracts.",
        );
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

    try {
      const result = saveSite(savedSite);
      router.push(`/sites/${result.id}`);
    } catch {
      setFormError("Unable to save the site. Please try again.");
    }
  }

  return (
    <div className="site-form-page">
      <PageHeader
        title={isEdit ? "Edit Site" : "Create Site"}
        description={
          isEdit
            ? "Update site information."
            : "Create a new customer site."
        }
        action={
          <div className="site-form-header-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/sites")}
            >
              Cancel
            </Button>

            <Button type="submit" form="site-form">
              {isEdit ? "Save Changes" : "Create Site"}
            </Button>
          </div>
        }
      />

      {formError && (
        <div className="site-form-error">
          {formError}
        </div>
      )}

      <form
        id="site-form"
        onSubmit={handleSubmit}
        className="site-form"
      >
        <div className="site-form-grid">
          {/* Site Information */}
          <section className="site-form-card">
            <div className="site-form-card-header">
              <h3>Site Information</h3>
            </div>

            <div className="site-form-fields">
              {/* Site Name */}
              <label className="site-form-field">
                <span>
                  Site Name{" "}
                  <span className="site-form-required">*</span>
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
                  placeholder="Enter site name"
                  className={
                    errors.name
                      ? "site-form-control-error"
                      : ""
                  }
                />

                {errors.name && (
                  <span className="site-form-field-error">
                    {errors.name}
                  </span>
                )}
              </label>

              {/* Site Code */}
              <label className="site-form-field">
                <span>
                  Site Code{" "}
                  <span className="site-form-required">*</span>
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
                  placeholder="e.g. HVM-C"
                  className={`site-code-input ${
                    errors.code
                      ? "site-form-control-error"
                      : ""
                  }`}
                />

                {errors.code && (
                  <span className="site-form-field-error">
                    {errors.code}
                  </span>
                )}
              </label>

              {/* Customer */}
              <label className="site-form-field">
                <span>
                  Customer{" "}
                  <span className="site-form-required">*</span>
                </span>

                <select
                  value={customerId}
                  onChange={(event) => {
                    setCustomerId(event.target.value);

                    if (errors.customerId) {
                      setErrors((current) => ({
                        ...current,
                        customerId: undefined,
                      }));
                    }
                  }}
                  className={
                    errors.customerId
                      ? "site-form-control-error"
                      : ""
                  }
                >
                  <option value="">Select customer</option>

                  {customers.map((customer: Customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name} ({customer.code})
                    </option>
                  ))}
                </select>

                {errors.customerId && (
                  <span className="site-form-field-error">
                    {errors.customerId}
                  </span>
                )}
              </label>

              {/* Status */}
              <label className="site-form-field">
                <span>
                  Status{" "}
                  <span className="site-form-required">*</span>
                </span>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as
                        | "active"
                        | "inactive",
                    )
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>
          </section>

          {/* Location & Contact */}
          <section className="site-form-card">
            <div className="site-form-card-header">
              <h3>Location &amp; Contact</h3>
            </div>

            <div className="site-form-fields">
              {/* Contact Name */}
              <label className="site-form-field">
                <span>Contact Name</span>

                <input
                  value={contactName}
                  onChange={(event) =>
                    setContactName(event.target.value)
                  }
                  placeholder="Enter contact name"
                />
              </label>

              {/* Contact Phone */}
              <label className="site-form-field">
                <span>Contact Phone</span>

                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(event) =>
                    setContactPhone(event.target.value)
                  }
                  placeholder="Enter contact phone"
                />
              </label>

              {/* Address */}
              <label className="site-form-field site-form-field-full">
                <span>
                  Address{" "}
                  <span className="site-form-required">*</span>
                </span>

                <textarea
                  rows={2}
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);

                    if (errors.address) {
                      setErrors((current) => ({
                        ...current,
                        address: undefined,
                      }));
                    }
                  }}
                  placeholder="Enter site address"
                  className={
                    errors.address
                      ? "site-form-control-error"
                      : ""
                  }
                />

                {errors.address && (
                  <span className="site-form-field-error">
                    {errors.address}
                  </span>
                )}
              </label>

              {/* Location */}
              <label className="site-form-field site-form-field-full">
                <span>Location</span>

                <input
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="e.g. Building A, Floor 2"
                />
              </label>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}