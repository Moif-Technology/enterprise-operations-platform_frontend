"use client";

import { useState, type FormEvent } from "react";

import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import FormField from "@/components/ui/FormField";
import { Button, Panel } from "@/components/ui/design-system";
import {
  getSpareParts,
  getStockLocations,
  saveSparePart,
} from "@/modules/inventory/service";
import type {
  InventoryRecordStatus,
  SparePartItem,
} from "@/modules/inventory/types";

type SparePartFormProps = {
  mode?: "create" | "edit";
  item?: SparePartItem;
};

type FormValues = {
  partCode: string;
  name: string;
  category: string;
  unitOfMeasure: string;
  manufacturer: string;
  manufacturerPartNumber: string;
  description: string;
  status: InventoryRecordStatus;
  reorderLevel: string;
  preferredWarehouseId: string;
  notes: string;
};

const categories = [
  "HVAC",
  "Electrical",
  "Fire Safety",
  "Plumbing",
  "Generator",
  "Other",
];

const statuses: InventoryRecordStatus[] = ["active", "inactive"];

export default function SparePartForm({
  mode = "create",
  item,
}: SparePartFormProps) {
  const existingItems = getSpareParts();
  const warehouses = getStockLocations().filter(
    (location) => location.type === "warehouse",
  );

  const [values, setValues] = useState<FormValues>({
    partCode: item?.partCode ?? "",
    name: item?.name ?? "",
    category: item?.category ?? "",
    unitOfMeasure: item?.unitOfMeasure ?? "",
    manufacturer: item?.manufacturer ?? "",
    manufacturerPartNumber: item?.manufacturerPartNumber ?? "",
    description: item?.description ?? "",
    status: item?.status ?? "active",
    reorderLevel: item?.reorderLevel.toString() ?? "0",
    preferredWarehouseId: item?.preferredWarehouseId ?? "",
    notes: item?.notes ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

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

    if (!values.partCode.trim()) {
      nextErrors.partCode = "Part code is required.";
    } else {
      const duplicate = existingItems.some(
        (existingItem) =>
          existingItem.partCode.trim().toLowerCase() ===
            values.partCode.trim().toLowerCase() &&
          existingItem.id !== item?.id,
      );

      if (duplicate) {
        nextErrors.partCode =
          "This part code is already in use.";
      }
    }

    if (!values.name.trim()) {
      nextErrors.name = "Part name is required.";
    }

    if (!values.category) {
      nextErrors.category = "Category is required.";
    }

    if (!values.unitOfMeasure.trim()) {
      nextErrors.unitOfMeasure =
        "Unit of measure is required.";
    }

    if (!values.reorderLevel.trim()) {
      nextErrors.reorderLevel =
        "Reorder level is required.";
    } else {
      const reorderLevel = Number(values.reorderLevel);

      if (!Number.isFinite(reorderLevel)) {
        nextErrors.reorderLevel =
          "Reorder level must be a valid number.";
      } else if (reorderLevel < 0) {
        nextErrors.reorderLevel =
          "Reorder level cannot be negative.";
      }
    }

    if (
      values.preferredWarehouseId &&
      !warehouses.some(
        (warehouse) =>
          warehouse.id === values.preferredWarehouseId,
      )
    ) {
      nextErrors.preferredWarehouseId =
        "Selected warehouse does not exist.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      setSuccess(false);
      return;
    }

    try {
      const savedItem: SparePartItem = {
        id: item?.id ?? `part-${Date.now()}`,
        partCode: values.partCode.trim(),
        name: values.name.trim(),
        category: values.category,
        unitOfMeasure: values.unitOfMeasure.trim(),
        manufacturer:
          values.manufacturer.trim() || undefined,
        manufacturerPartNumber:
          values.manufacturerPartNumber.trim() || undefined,
        description:
          values.description.trim() || undefined,
        status: values.status,
        reorderLevel: Number(values.reorderLevel),
        preferredWarehouseId:
          values.preferredWarehouseId || undefined,
        notes: values.notes.trim() || undefined,
      };

      saveSparePart(savedItem);
      setSuccess(true);
      setErrors({});
    } catch (error) {
      setSuccess(false);
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "The spare part could not be saved.",
      });
    }
  };

  return (
    <main className="w-full max-w-full">
      <div className="w-full max-w-full space-y-6">
        <PageHeader
          title={
            mode === "edit"
              ? "Edit Spare Part"
              : "Add Spare Part"
          }
          description={
            mode === "edit"
              ? "Update the spare part item master details."
              : "Create a spare part item for inventory management."
          }
          action={
            <Link href="/inventory/spare-parts">
              <Button variant="secondary">Cancel</Button>
            </Link>
          }
        />

        {success && (
          <Panel title="Saved successfully">
            <p className="text-sm text-[#162033]">
              The spare part has been saved successfully.
            </p>

            <div className="mt-4">
              <Link href="/inventory/spare-parts">
                <Button>Back to Spare Parts</Button>
              </Link>
            </div>
          </Panel>
        )}

        {errors.form && (
          <Panel title="Unable to save">
            <p className="text-sm text-[#b91c1c]">
              {errors.form}
            </p>
          </Panel>
        )}

        <Panel title="Spare part information">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Part code"
                name="partCode"
                required
                error={errors.partCode}
                placeholder="e.g. SP-HVAC-FLT-001"
                inputProps={{
                  value: values.partCode,
                  onChange: (event) =>
                    updateValue(
                      "partCode",
                      event.target.value,
                    ),
                }}
              />

              <FormField
                label="Part name"
                name="name"
                required
                error={errors.name}
                placeholder="e.g. AHU Air Filter"
                inputProps={{
                  value: values.name,
                  onChange: (event) =>
                    updateValue(
                      "name",
                      event.target.value,
                    ),
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
                    updateValue(
                      "category",
                      event.target.value,
                    ),
                }}
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Unit of measure"
                name="unitOfMeasure"
                required
                error={errors.unitOfMeasure}
                placeholder="e.g. piece, litre, metre"
                inputProps={{
                  value: values.unitOfMeasure,
                  onChange: (event) =>
                    updateValue(
                      "unitOfMeasure",
                      event.target.value,
                    ),
                }}
              />

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
                      event.target.value as InventoryRecordStatus,
                    ),
                }}
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status === "active"
                      ? "Active"
                      : "Inactive"}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Reorder level"
                name="reorderLevel"
                required
                error={errors.reorderLevel}
                inputProps={{
                  type: "number",
                  min: 0,
                  step: "any",
                  value: values.reorderLevel,
                  onChange: (event) =>
                    updateValue(
                      "reorderLevel",
                      event.target.value,
                    ),
                }}
              />

              <FormField
                label="Manufacturer"
                name="manufacturer"
                placeholder="Optional"
                inputProps={{
                  value: values.manufacturer,
                  onChange: (event) =>
                    updateValue(
                      "manufacturer",
                      event.target.value,
                    ),
                }}
              />

              <FormField
                label="Manufacturer part number"
                name="manufacturerPartNumber"
                placeholder="Optional"
                inputProps={{
                  value:
                    values.manufacturerPartNumber,
                  onChange: (event) =>
                    updateValue(
                      "manufacturerPartNumber",
                      event.target.value,
                    ),
                }}
              />

              <FormField
                label="Preferred warehouse"
                name="preferredWarehouseId"
                type="select"
                error={errors.preferredWarehouseId}
                selectProps={{
                  value: values.preferredWarehouseId,
                  onChange: (event) =>
                    updateValue(
                      "preferredWarehouseId",
                      event.target.value,
                    ),
                }}
              >
                <option value="">
                  No preferred warehouse
                </option>

                {warehouses.map((warehouse) => (
                  <option
                    key={warehouse.id}
                    value={warehouse.id}
                  >
                    {warehouse.name}
                  </option>
                ))}
              </FormField>
            </div>

            <FormField
              label="Description"
              name="description"
              type="textarea"
              placeholder="Optional description of the spare part"
              textareaProps={{
                value: values.description,
                onChange: (event) =>
                  updateValue(
                    "description",
                    event.target.value,
                  ),
              }}
            />

            <FormField
              label="Notes"
              name="notes"
              type="textarea"
              placeholder="Optional notes about this spare part"
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
              <Link href="/inventory/spare-parts">
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
                  : "Add Spare Part"}
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </main>
  );
}