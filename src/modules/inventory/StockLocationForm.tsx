"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/design-system";

import { getSites } from "@/modules/assets/service";
import {
  getStockBalances,
  getStockLocations,
  saveStockLocation,
} from "@/modules/inventory/service";

import type {
  StockLocation,
  StockLocationType,
} from "@/modules/inventory/types";

interface StockLocationFormProps {
  location?: StockLocation;
}

type FormErrors = {
  code?: string;
  name?: string;
  type?: string;
  status?: string;
  siteOrTechnician?: string;
  form?: string;
};

export default function StockLocationForm({
  location,
}: StockLocationFormProps) {
  const router = useRouter();

  const sites = useMemo(() => getSites(), []);
  const locations = useMemo(() => getStockLocations(), []);

  const [code, setCode] = useState(location?.code ?? "");
  const [name, setName] = useState(location?.name ?? "");
  const [type, setType] = useState<StockLocationType>(
    location?.type ?? "warehouse",
  );
  const [siteId, setSiteId] = useState(location?.siteId ?? "");
  const [technicianName, setTechnicianName] = useState(
    location?.technicianName ?? "",
  );
  const [status, setStatus] = useState<"active" | "inactive">(
    location?.status ?? "active",
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const isEdit = Boolean(location);

  const referencedLocation = location
    ? getStockBalances().some(
        (balance) =>
          balance.locationId === location.id && balance.quantity !== 0,
      )
    : false;

  const updateError = (field: keyof FormErrors) => {
    setErrors((current) => ({
      ...current,
      [field]: "",
      form: "",
    }));
  };

  function handleTypeChange(nextType: StockLocationType) {
    setType(nextType);
    updateError("type");
    updateError("siteOrTechnician");

    if (nextType === "warehouse") {
      setTechnicianName("");
    } else {
      setSiteId("");
    }
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!code.trim()) {
      nextErrors.code = "Field is required.";
    }

    if (!name.trim()) {
      nextErrors.name = "Field is required.";
    }

    if (!type) {
      nextErrors.type = "Field is required.";
    }

    if (!status) {
      nextErrors.status = "Field is required.";
    }

    if (type === "warehouse" && !siteId) {
      nextErrors.siteOrTechnician = "Field is required.";
    }

    if (type === "technician" && !technicianName.trim()) {
      nextErrors.siteOrTechnician = "Field is required.";
    }

    const trimmedCode = code.trim();

    if (trimmedCode) {
      const duplicate = locations.some(
        (item) =>
          item.id !== location?.id &&
          item.code.trim().toLowerCase() === trimmedCode.toLowerCase(),
      );

      if (duplicate) {
        nextErrors.code = "Location code must be unique.";
      }
    }

    if (
      type === "warehouse" &&
      siteId &&
      !sites.some((site) => site.id === siteId)
    ) {
      nextErrors.siteOrTechnician = "Please select a valid existing site.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrors({});

    if (!validate()) {
      return;
    }

    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const trimmedTechnicianName = technicianName.trim();

    const savedLocation: StockLocation = {
      id: location?.id ?? `loc-${Date.now()}`,
      code: trimmedCode,
      name: trimmedName,
      type,
      status,
      ...(type === "warehouse" ? { siteId } : {}),
      ...(type === "technician"
        ? { technicianName: trimmedTechnicianName }
        : {}),
    };

    try {
      const result = saveStockLocation(savedLocation);

      router.push(`/inventory/stock-locations/${result.id}`);
    } catch (submitError) {
      setErrors({
        form:
          submitError instanceof Error
            ? submitError.message
            : "Unable to save the stock location.",
      });
    }
  }

  return (
    <div className="stock-location-form-page">
      <PageHeader
        eyebrow="Inventory"
        title={isEdit ? "Edit Stock Location" : "Create Stock Location"}
        description={
          isEdit
            ? "Update warehouse or technician stock information."
            : "Create a warehouse or technician stock location."
        }
        action={
          <div className="stock-location-form-header-actions">
            <Link href="/inventory/stock-locations">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>

            <Button type="submit" form="stock-location-form">
              {isEdit ? "Save Changes" : "Create Stock Location"}
            </Button>
          </div>
        }
      />

      <section className="stock-location-form-card">
        <div className="stock-location-form-card-header">
          <h3>Stock Location Details</h3>
          <p>
            Define location details and link existing sites or technicians.
          </p>
        </div>

        <form
          id="stock-location-form"
          onSubmit={handleSubmit}
          className="stock-location-form"
          noValidate
        >
          {errors.form && (
            <div className="stock-location-form-error-summary">
              {errors.form}
            </div>
          )}

          {isEdit && (
            <div className="stock-location-form-info">
              <strong>Reference safety:</strong> locations with stock or
              movement history cannot have their type changed. Inactive
              locations remain available for historical records.
            </div>
          )}

          <div className="stock-location-form-fields">
            <FormControl
              label="Location Code"
              required
              error={errors.code}
            >
              <input
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  updateError("code");
                }}
                className={getControlClassName(errors.code)}
                placeholder="e.g. WH-HVM-C"
              />
            </FormControl>

            <FormControl
              label="Location Name"
              required
              error={errors.name}
            >
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  updateError("name");
                }}
                className={getControlClassName(errors.name)}
                placeholder="e.g. Harborview Central Warehouse"
              />
            </FormControl>

            <FormControl
              label="Location Type"
              required
              error={errors.type}
            >
              <select
                value={type}
                onChange={(event) =>
                  handleTypeChange(
                    event.target.value as StockLocationType,
                  )
                }
                className={getControlClassName(errors.type)}
                disabled={isEdit && referencedLocation}
              >
                <option value="warehouse">Warehouse</option>
                <option value="technician">Technician</option>
              </select>
            </FormControl>

            <FormControl
              label="Status"
              required
              error={errors.status}
            >
              <select
                value={status}
                onChange={(event) => {
                  setStatus(
                    event.target.value as "active" | "inactive",
                  );
                  updateError("status");
                }}
                className={getControlClassName(errors.status)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FormControl>

            {type === "warehouse" && (
              <div className="stock-location-form-field stock-location-form-field-wide">
                <FormControl
                  label="Existing Site"
                  required
                  error={errors.siteOrTechnician}
                >
                  <select
                    value={siteId}
                    onChange={(event) => {
                      setSiteId(event.target.value);
                      updateError("siteOrTechnician");
                    }}
                    className={getControlClassName(
                      errors.siteOrTechnician,
                    )}
                  >
                    <option value="">Select existing site</option>

                    {sites
                      .filter(
                        (site) =>
                          site.status === "active" ||
                          site.id === location?.siteId,
                      )
                      .map((site) => (
                        <option key={site.id} value={site.id}>
                          {site.name} ({site.code})
                        </option>
                      ))}
                  </select>
                </FormControl>

                <div className="stock-location-form-helper">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 10v6" />
                    <path d="M12 7h.01" />
                  </svg>

                  <span>
                    Warehouse locations reuse existing customer/site
                    records for inventory tracking.
                  </span>
                </div>
              </div>
            )}

            {type === "technician" && (
              <div className="stock-location-form-field stock-location-form-field-wide">
                <FormControl
                  label="Assign Technician"
                  required
                  error={errors.siteOrTechnician}
                >
                  <input
                    value={technicianName}
                    onChange={(event) => {
                      setTechnicianName(event.target.value);
                      updateError("siteOrTechnician");
                    }}
                    className={getControlClassName(
                      errors.siteOrTechnician,
                    )}
                    placeholder="e.g. R. Mehta"
                  />
                </FormControl>

                <div className="stock-location-form-helper">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 10v6" />
                    <path d="M12 7h.01" />
                  </svg>

                  <span>
                    Technician locations track stock assigned to an
                    individual field technician.
                  </span>
                </div>
              </div>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

function FormControl({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="stock-location-form-field">
      <label>
        {label}
        {required && (
          <span className="stock-location-form-required"> *</span>
        )}
      </label>

      {children}

      {error && (
        <p className="stock-location-form-field-error">
          {error}
        </p>
      )}
    </div>
  );
}

function getControlClassName(error?: string) {
  return error
    ? "stock-location-form-control stock-location-form-control-error"
    : "stock-location-form-control";
}