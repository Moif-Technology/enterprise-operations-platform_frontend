
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import FormField from "@/components/ui/FormField";
import { Button, Panel } from "@/components/ui/design-system";

import {
  getAssets,
  getMaintenancePlans,
  saveMaintenancePlan,
} from "@/modules/assets/service";

import type {
  Asset,
  MaintenanceFrequency,
  MaintenancePlan,
  MaintenancePlanStatus,
} from "@/modules/assets/types";

type AssetMaintenancePlanFormProps = {
  mode?: "create" | "edit" | "view";
  plan?: MaintenancePlan;
};

type FormValues = {
  assetId: string;
  planName: string;
  frequency: MaintenanceFrequency;
  startDate: string;
  nextDueDate: string;
  checklist: string;
  status: MaintenancePlanStatus;
};

const EMPTY_VALUES: FormValues = {
  assetId: "",
  planName: "",
  frequency: "monthly",
  startDate: "",
  nextDueDate: "",
  checklist: "",
  status: "active",
};

export default function AssetMaintenancePlanForm({
  mode = "create",
  plan,
}: AssetMaintenancePlanFormProps) {
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const assets = useMemo(() => getAssets(), []);
  const maintenancePlans = useMemo(() => getMaintenancePlans(), []);

  const [values, setValues] = useState<FormValues>(() => {
    if (!plan) {
      return EMPTY_VALUES;
    }

    return {
      assetId: plan.assetId,
      planName: plan.planName,
      frequency: plan.frequency,
      startDate: plan.startDate,
      nextDueDate: plan.nextDueDate,
      checklist: plan.checklist.join("\n"),
      status: plan.status,
    };
  });
  useEffect(() => {
    if (!plan) {
      return;
    }
  
    setValues({
      assetId: plan.assetId,
      planName: plan.planName,
      frequency: plan.frequency,
      startDate: plan.startDate,
      nextDueDate: plan.nextDueDate,
      checklist: plan.checklist.join("\n"),
      status: plan.status,
    });
  }, [plan]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const selectedAsset = assets.find((asset) => asset.id === values.assetId);

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
    }));

    setSuccess(false);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!values.assetId) {
      nextErrors.assetId = "Select an asset.";
    }

    if (!values.planName.trim()) {
      nextErrors.planName = "Enter a maintenance plan name.";
    }

    if (!values.startDate) {
      nextErrors.startDate = "Select a start date.";
    }

    if (!values.nextDueDate) {
      nextErrors.nextDueDate = "Select the next due date.";
    }

    if (
      values.startDate &&
      values.nextDueDate &&
      values.nextDueDate < values.startDate
    ) {
      nextErrors.nextDueDate =
        "Next due date cannot be earlier than the start date.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }

    const checklist = values.checklist
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

      const existingPlan = plan;

    const maintenancePlan: MaintenancePlan = {
      id: existingPlan?.id ?? `plan-${Date.now()}`,
      assetId: values.assetId,
      planName: values.planName.trim(),
      frequency: values.frequency,
      startDate: values.startDate,
      nextDueDate: values.nextDueDate,
      checklist,
      status: values.status,
    };

    saveMaintenancePlan(maintenancePlan);

    setSuccess(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={
            isView
              ? "Maintenance Plan"
              : isEdit
                ? "Edit Maintenance Plan"
                : "Create Maintenance Plan"
          }
          description={
            isView
              ? "View the maintenance schedule and checklist."
              : isEdit
                ? "Update the maintenance schedule and checklist."
                : "Create a preventive maintenance schedule for an asset."
          }
        action={
          <Link href="/maintenance-plans">
            <Button variant="secondary">Back to Maintenance Plans</Button>
          </Link>
        }
      />

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Maintenance plan saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Panel
          title="Plan Details"
          description="Select the asset and define the maintenance schedule."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              name="assetId"
              label="Asset"
              required
              error={errors.assetId}
              selectProps={{
                disabled: isView,
                value: values.assetId,
                onChange: (event) =>
                  updateValue("assetId", event.target.value),
              }}
            >
              <option value="">Select an asset</option>
              {assets.map((asset: Asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.assetCode})
                </option>
              ))}
            </FormField>

            <FormField
              name="planName"
              label="Plan Name"
              required
              error={errors.planName}
              inputProps={{
                disabled: isView,
                value: values.planName,
                onChange: (event) =>
                  updateValue("planName", event.target.value),
                placeholder: "e.g. AHU monthly filter and belt check",
              }}
            />

            <FormField
              name="frequency"
              label="Frequency"
              required
              selectProps={{
                disabled: isView,
                value: values.frequency,
                onChange: (event) =>
                  updateValue(
                    "frequency",
                    event.target.value as MaintenanceFrequency,
                  ),
              }}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </FormField>

            <FormField
              name="status"
              label="Status"
              required
              selectProps={{
                disabled: isView,
                value: values.status,
                onChange: (event) =>
                  updateValue(
                    "status",
                    event.target.value as MaintenancePlanStatus,
                  ),
              }}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </FormField>

            <FormField
              name="startDate"
              label="Start Date"
              required
              error={errors.startDate}
              inputProps={{
                type: "date",
                disabled: isView,
                value: values.startDate,
                onChange: (event) =>
                  updateValue("startDate", event.target.value),
              }}
            />

            <FormField
              name="nextDueDate"
              label="Next Due Date"
              required
              error={errors.nextDueDate}
              inputProps={{
                type: "date",
                disabled: isView,
                value: values.nextDueDate,
                onChange: (event) =>
                  updateValue("nextDueDate", event.target.value),
              }}
            />
          </div>
        </Panel>

        <Panel
          title="Checklist"
          description="Enter one maintenance checklist item per line."
        >
          <FormField
            name="checklist"
            label="Checklist Items"
            textareaProps={{
                value: values.checklist,
                disabled: isView,
                onChange: (event) =>
                  updateValue("checklist", event.target.value),
                placeholder:
                  "Inspect filters\nCheck belt condition\nRecord operating readings",
                rows: 6,
              }}
          />
        </Panel>

        {selectedAsset && (
          <Panel
            title="Selected Asset"
            description="Asset linked to this maintenance plan."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-slate-500">Asset</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {selectedAsset.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Asset Code
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {selectedAsset.assetCode}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">Category</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {selectedAsset.category}
                </p>
              </div>
            </div>
          </Panel>
        )}

        <div className="flex items-center justify-end gap-3">
          <Link href="/maintenance-plans">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>

          {!isView && (
  <Button type="submit">
    {isEdit ? "Save Changes" : "Create Maintenance Plan"}
  </Button>
)}
        </div>
      </form>
    </div>
  );
}

