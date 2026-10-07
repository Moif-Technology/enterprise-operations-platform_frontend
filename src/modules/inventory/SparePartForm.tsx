"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/design-system";
import { Panel } from "@/components/ui/design-system";

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

type FormErrors = Partial<Record<keyof FormValues | "form", string>>;

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const updateValue = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
      form: "",
    }));

    setSuccess(false);
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.partCode.trim()) {
      nextErrors.partCode = "Field is required.";
    } else {
      const duplicate = existingItems.some(
        (existingItem) =>
          existingItem.partCode.trim().toLowerCase() ===
            values.partCode.trim().toLowerCase() &&
          existingItem.id !== item?.id,
      );

      if (duplicate) {
        nextErrors.partCode = "This part code is already in use.";
      }
    }

    if (!values.name.trim()) {
      nextErrors.name = "Field is required.";
    }

    if (!values.category) {
      nextErrors.category = "Field is required.";
    }

    if (!values.unitOfMeasure.trim()) {
      nextErrors.unitOfMeasure = "Field is required.";
    }

    if (!values.status) {
      nextErrors.status = "Field is required.";
    }

    if (!values.reorderLevel.trim()) {
      nextErrors.reorderLevel = "Field is required.";
    } else {
      const reorderLevel = Number(values.reorderLevel);

      if (!Number.isFinite(reorderLevel)) {
        nextErrors.reorderLevel = "Reorder level must be a valid number.";
      } else if (reorderLevel < 0) {
        nextErrors.reorderLevel = "Reorder level cannot be negative.";
      }
    }

    if (
      values.preferredWarehouseId &&
      !warehouses.some(
        (warehouse) => warehouse.id === values.preferredWarehouseId,
      )
    ) {
      nextErrors.preferredWarehouseId =
        "Selected warehouse does not exist.";
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

    try {
      const savedItem: SparePartItem = {
        id: item?.id ?? `part-${Date.now()}`,
        partCode: values.partCode.trim(),
        name: values.name.trim(),
        category: values.category,
        unitOfMeasure: values.unitOfMeasure.trim(),
        manufacturer: values.manufacturer.trim() || undefined,
        manufacturerPartNumber:
          values.manufacturerPartNumber.trim() || undefined,
        description: values.description.trim() || undefined,
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
    <main className="spare-part-form-page">
      <PageHeader
        eyebrow="Inventory"
        title={mode === "edit" ? "Edit Spare Part" : "Add Spare Part"}
        description={
          mode === "edit"
            ? "Update the spare part item master details."
            : "Create a spare part item for inventory management."
        }
        action={
          <div className="spare-part-form-header-actions">
            <Link href="/inventory/spare-parts">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>

            <Button type="submit" form="spare-part-form">
              {mode === "edit" ? "Save Changes" : "Save Spare Part"}
            </Button>
          </div>
        }
      />

      {success && (
        <div className="spare-part-form-message spare-part-form-success">
          <strong>Saved successfully</strong>
          <span>The spare part has been saved successfully.</span>
          <Link href="/inventory/spare-parts">
            Back to Spare Parts
          </Link>
        </div>
      )}

      {errors.form && (
        <div className="spare-part-form-message spare-part-form-error">
          <strong>Unable to save</strong>
          <span>{errors.form}</span>
        </div>
      )}

      <form
        id="spare-part-form"
        onSubmit={handleSubmit}
        className="spare-part-form"
        noValidate
      >
        <div className="spare-part-form-grid">
          {/* Card 1 */}
          <section className="spare-part-form-card">
            <div className="spare-part-form-card-header">
              <h3>Part Details</h3>
            </div>

            <div className="spare-part-form-fields">
              <FormControl
                label="Part Code"
                required
                error={errors.partCode}
              >
                <input
                  type="text"
                  placeholder="e.g. SP-HVAC-FLT-001"
                  value={values.partCode}
                  onChange={(event) =>
                    updateValue("partCode", event.target.value)
                  }
                  className={getInputClassName(errors.partCode)}
                />
              </FormControl>

              <FormControl
                label="Part Name"
                required
                error={errors.name}
              >
                <input
                  type="text"
                  placeholder="e.g. AHU Air Filter"
                  value={values.name}
                  onChange={(event) =>
                    updateValue("name", event.target.value)
                  }
                  className={getInputClassName(errors.name)}
                />
              </FormControl>

              <FormControl
                label="Category"
                required
                error={errors.category}
              >
                <select
                  value={values.category}
                  onChange={(event) =>
                    updateValue("category", event.target.value)
                  }
                  className={getInputClassName(errors.category)}
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </FormControl>

              <FormControl
                label="Unit of Measure"
                required
                error={errors.unitOfMeasure}
              >
                <input
                  type="text"
                  placeholder="e.g. piece, litre, metre"
                  value={values.unitOfMeasure}
                  onChange={(event) =>
                    updateValue("unitOfMeasure", event.target.value)
                  }
                  className={getInputClassName(errors.unitOfMeasure)}
                />
              </FormControl>

              <FormControl
                label="Status"
                required
                error={errors.status}
              >
                <select
                  value={values.status}
                  onChange={(event) =>
                    updateValue(
                      "status",
                      event.target.value as InventoryRecordStatus,
                    )
                  }
                  className={getInputClassName(errors.status)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "active" ? "Active" : "Inactive"}
                    </option>
                  ))}
                </select>
              </FormControl>

              <FormControl
                label="Reorder Level"
                required
                error={errors.reorderLevel}
              >
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={values.reorderLevel}
                  onChange={(event) =>
                    updateValue("reorderLevel", event.target.value)
                  }
                  className={getInputClassName(errors.reorderLevel)}
                />
              </FormControl>
            </div>
          </section>

          {/* Card 2 */}
          <section className="spare-part-form-card">
            <div className="spare-part-form-card-header">
              <h3>Manufacturer &amp; Storage</h3>
            </div>

            <div className="spare-part-form-fields">
              <FormControl label="Manufacturer">
                <input
                  type="text"
                  placeholder="e.g. Carrier, Trane"
                  value={values.manufacturer}
                  onChange={(event) =>
                    updateValue("manufacturer", event.target.value)
                  }
                  className={getInputClassName()}
                />
              </FormControl>

              <FormControl label="Manufacturer Part Number">
                <input
                  type="text"
                  placeholder="e.g. MPN-99401"
                  value={values.manufacturerPartNumber}
                  onChange={(event) =>
                    updateValue(
                      "manufacturerPartNumber",
                      event.target.value,
                    )
                  }
                  className={getInputClassName()}
                />
              </FormControl>

              <FormControl
                label="Preferred Warehouse"
                error={errors.preferredWarehouseId}
              >
                <select
                  value={values.preferredWarehouseId}
                  onChange={(event) =>
                    updateValue(
                      "preferredWarehouseId",
                      event.target.value,
                    )
                  }
                  className={getInputClassName(
                    errors.preferredWarehouseId,
                  )}
                >
                  <option value="">Select preferred warehouse</option>

                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </FormControl>
            </div>
          </section>

          {/* Card 3 */}
          <section className="spare-part-form-card spare-part-form-card-wide">
            <div className="spare-part-form-card-header">
              <h3>Descriptions &amp; Notes</h3>
            </div>

            <div className="spare-part-form-fields">
              <FormControl label="Description">
                <textarea
                  rows={3}
                  placeholder="Optional description of the spare part"
                  value={values.description}
                  onChange={(event) =>
                    updateValue("description", event.target.value)
                  }
                  className={getInputClassName()}
                />
              </FormControl>

              <FormControl label="Notes">
                <textarea
                  rows={3}
                  placeholder="Optional notes about this spare part"
                  value={values.notes}
                  onChange={(event) =>
                    updateValue("notes", event.target.value)
                  }
                  className={getInputClassName()}
                />
              </FormControl>
            </div>
          </section>
        </div>
      </form>
    </main>
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
    <div className="spare-part-form-field">
      <label>
        {label}
        {required && (
          <span className="spare-part-form-required"> *</span>
        )}
      </label>

      {children}

      {error && (
        <p className="spare-part-form-field-error">
          {error}
        </p>
      )}
    </div>
  );
}

function getInputClassName(error?: string) {
  return error
    ? "spare-part-form-control spare-part-form-control-error"
    : "spare-part-form-control";
}