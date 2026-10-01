
"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import FormField from "@/components/ui/FormField";
import { Button, Panel } from "@/components/ui/design-system";

import {
  getAssets,
  getCustomers,
  getSites,
  saveAsset,
} from "@/modules/assets/service";

import type {
  Asset,
  AssetCategory,
  AssetStatus,
} from "@/modules/assets/types";

type AssetFormProps = {
  mode?: "create" | "edit";
  asset?: Asset;
};

type FormValues = {
  name: string;
  assetCode: string;
  category: AssetCategory | "";
  customerId: string;
  siteId: string;
  location: string;
  status: AssetStatus;
  serialNumber: string;
  model: string;
  installationDate: string;
  warrantyExpiry: string;
  notes: string;
};

const categories: AssetCategory[] = [
  "HVAC",
  "Electrical",
  "Fire Safety",
  "Plumbing",
  "Generator",
  "Other",
];

const statuses: AssetStatus[] = [
  "active",
  "inactive",
  "under-maintenance",
  "decommissioned",
];

export default function AssetForm({
  mode = "create",
  asset,
}: AssetFormProps) {
  const customers = getCustomers();
  const sites = getSites();
  const existingAssets = getAssets();

  const [values, setValues] = useState<FormValues>({
    name: asset?.name ?? "",
    assetCode: asset?.assetCode ?? "",
    category: asset?.category ?? "",
    customerId: asset?.customerId ?? "",
    siteId: asset?.siteId ?? "",
    location: asset?.location ?? "",
    status: asset?.status ?? "active",
    serialNumber: asset?.serialNumber ?? "",
    model: asset?.model ?? "",
    installationDate: asset?.installationDate ?? "",
    warrantyExpiry: asset?.warrantyExpiry ?? "",
    notes: asset?.notes ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const availableSites = useMemo(() => {
    if (!values.customerId) {
      return [];
    }

    return sites.filter(
      (site) => site.customerId === values.customerId,
    );
  }, [sites, values.customerId]);

  const updateValue = (
    field: keyof FormValues,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setSuccess(false);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!values.name.trim()) {
      nextErrors.name = "Asset name is required.";
    }

    if (!values.assetCode.trim()) {
      nextErrors.assetCode = "Asset code is required.";
    } else {
      const duplicate = existingAssets.some(
        (item) =>
          item.assetCode.toLowerCase() ===
            values.assetCode.trim().toLowerCase() &&
          item.id !== asset?.id,
      );

      if (duplicate) {
        nextErrors.assetCode =
          "This asset code is already in use.";
      }
    }

    if (!values.category) {
      nextErrors.category = "Category is required.";
    }

    if (!values.customerId) {
      nextErrors.customerId = "Customer is required.";
    }

    if (!values.siteId) {
      nextErrors.siteId = "Site is required.";
    }

    if (
      values.customerId &&
      values.siteId &&
      !availableSites.some(
        (site) => site.id === values.siteId,
      )
    ) {
      nextErrors.siteId =
        "Selected site does not belong to the selected customer.";
    }

    if (!values.location.trim()) {
      nextErrors.location = "Location is required.";
    }

    if (!values.installationDate) {
      nextErrors.installationDate =
        "Installation date is required.";
    }

    if (!values.warrantyExpiry) {
      nextErrors.warrantyExpiry =
        "Warranty expiry is required.";
    }

    if (
      values.installationDate &&
      values.warrantyExpiry &&
      values.warrantyExpiry < values.installationDate
    ) {
      nextErrors.warrantyExpiry =
        "Warranty expiry cannot be before installation date.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      setSuccess(false);
      return;
    }

    const savedAsset: Asset = {
      id: asset?.id ?? `asset-${Date.now()}`,
      assetCode: values.assetCode.trim(),
      name: values.name.trim(),
      category: values.category as AssetCategory,
      customerId: values.customerId,
      siteId: values.siteId,
      location: values.location.trim(),
      status: values.status,
      serialNumber: values.serialNumber.trim() || undefined,
      model: values.model.trim() || undefined,
      installationDate: values.installationDate,
      warrantyExpiry: values.warrantyExpiry,
      notes: values.notes.trim() || undefined,
      nextMaintenanceDate:
        asset?.nextMaintenanceDate ?? values.installationDate,
    };

    saveAsset(savedAsset);
    setSuccess(true);
  };

  return (
    <main className="w-full max-w-full">
      <div className="w-full max-w-full space-y-6">
        <PageHeader
          title={mode === "edit" ? "Edit Asset" : "Register Asset"}
          description={
            mode === "edit"
              ? "Update the asset registration details."
              : "Register a new asset for customer and site management."
          }
          action={
            <Link href="/assets">
              <Button variant="secondary">Cancel</Button>
            </Link>
          }
        />

        {success && (
          <Panel title="Saved successfully">
            <p className="text-sm text-[#162033]">
              The asset has been saved successfully.
            </p>

            <div className="mt-4">
              <Link href="/assets">
                <Button>Back to Assets</Button>
              </Link>
            </div>
          </Panel>
        )}

        <Panel title="Asset information">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Asset name"
                name="name"
                required
                error={errors.name}
                placeholder="e.g. Main Building AC Unit"
                inputProps={{
                  value: values.name,
                  onChange: (event) =>
                    updateValue("name", event.target.value),
                }}
              />

              <FormField
                label="Asset code"
                name="assetCode"
                required
                error={errors.assetCode}
                placeholder="e.g. AST-001"
                inputProps={{
                  value: values.assetCode,
                  onChange: (event) =>
                    updateValue("assetCode", event.target.value),
                }}
              />

              <FormField
                label="Category"
                name="category"
                type="select"
                required
                error={errors.category}
                selectProps={{
                  value: values.category,
                  onChange: (event) =>
                    updateValue("category", event.target.value),
                }}
              >
                <option value="">Select category</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Status"
                name="status"
                type="select"
                required
                selectProps={{
                  value: values.status,
                  onChange: (event) =>
                    updateValue(
                      "status",
                      event.target.value as AssetStatus,
                    ),
                }}
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Customer"
                name="customerId"
                type="select"
                required
                error={errors.customerId}
                selectProps={{
                  value: values.customerId,
                  onChange: (event) => {
                    const nextCustomerId =
                      event.target.value;

                    setValues((current) => ({
                      ...current,
                      customerId: nextCustomerId,
                      siteId: "",
                    }));

                    setErrors((current) => ({
                      ...current,
                      customerId: "",
                      siteId: "",
                    }));

                    setSuccess(false);
                  },
                }}
              >
                <option value="">Select customer</option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Site"
                name="siteId"
                type="select"
                required
                error={errors.siteId}
                disabled={!values.customerId}
                selectProps={{
                  value: values.siteId,
                  onChange: (event) =>
                    updateValue(
                      "siteId",
                      event.target.value,
                    ),
                }}
              >
                <option value="">
                  {values.customerId
                    ? "Select site"
                    : "Select customer first"}
                </option>

                {availableSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Location"
                name="location"
                required
                error={errors.location}
                placeholder="e.g. Ground floor plant room"
                inputProps={{
                  value: values.location,
                  onChange: (event) =>
                    updateValue(
                      "location",
                      event.target.value,
                    ),
                }}
              />

              <FormField
                label="Serial number"
                name="serialNumber"
                placeholder="Optional"
                inputProps={{
                  value: values.serialNumber,
                  onChange: (event) =>
                    updateValue(
                      "serialNumber",
                      event.target.value,
                    ),
                }}
              />

              <FormField
                label="Model"
                name="model"
                placeholder="Optional"
                inputProps={{
                  value: values.model,
                  onChange: (event) =>
                    updateValue(
                      "model",
                      event.target.value,
                    ),
                }}
              />

              <FormField
                label="Installation date"
                name="installationDate"
                type="input"
                required
                error={errors.installationDate}
                inputProps={{
                  type: "date",
                  value: values.installationDate,
                  onChange: (event) =>
                    updateValue(
                      "installationDate",
                      event.target.value,
                    ),
                }}
              />

              <FormField
                label="Warranty expiry"
                name="warrantyExpiry"
                type="input"
                required
                error={errors.warrantyExpiry}
                inputProps={{
                  type: "date",
                  value: values.warrantyExpiry,
                  onChange: (event) =>
                    updateValue(
                      "warrantyExpiry",
                      event.target.value,
                    ),
                }}
              />
            </div>

            <FormField
              label="Notes"
              name="notes"
              type="textarea"
              placeholder="Optional notes about the asset"
              textareaProps={{
                value: values.notes,
                onChange: (event) =>
                  updateValue(
                    "notes",
                    event.target.value,
                  ),
              }}
            />

            <div className="flex justify-end gap-3 border-t border-[#dfe4ea] pt-5">
              <Link href="/assets">
                <Button
                  variant="secondary"
                  type="button"
                >
                  Cancel
                </Button>
              </Link>

              <Button type="submit">
                {mode === "edit"
                  ? "Save Changes"
                  : "Register Asset"}
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </main>
  );
}

