"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/design-system";

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

type FormErrors = Partial<Record<keyof FormValues, string>>;

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
  const maintenancePlans = useMemo(
    () => getMaintenancePlans(),
    [],
  );

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const selectedAsset = assets.find(
    (asset) => asset.id === values.assetId,
  );

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
      [field]: undefined,
    }));

    setSubmitError("");
    setSuccess(false);
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.assetId) {
      nextErrors.assetId = "Asset is required.";
    }

    if (!values.planName.trim()) {
      nextErrors.planName = "Plan name is required.";
    }

    if (!values.frequency) {
      nextErrors.frequency = "Frequency is required.";
    }

    if (!values.status) {
      nextErrors.status = "Status is required.";
    }

    if (!values.startDate) {
      nextErrors.startDate = "Start date is required.";
    }

    if (!values.nextDueDate) {
      nextErrors.nextDueDate = "Next due date is required.";
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

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isView) {
      return;
    }

    setSubmitError("");

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

    const duplicatePlan = maintenancePlans.some(
      (item) =>
        item.id !== existingPlan?.id &&
        item.assetId === values.assetId &&
        item.planName.trim().toLowerCase() ===
          values.planName.trim().toLowerCase(),
    );

    if (duplicatePlan) {
      setSubmitError(
        "A maintenance plan with this name already exists for the selected asset.",
      );
      setSuccess(false);
      return;
    }

    const maintenancePlan: MaintenancePlan = {
      id:
        existingPlan?.id ??
        `plan-${Date.now()}`,
      assetId: values.assetId,
      planName: values.planName.trim(),
      frequency: values.frequency,
      startDate: values.startDate,
      nextDueDate: values.nextDueDate,
      checklist,
      status: values.status,
    };

    try {
      saveMaintenancePlan(maintenancePlan);
      setSuccess(true);
    } catch {
      setSubmitError(
        "Unable to save the maintenance plan. Please try again.",
      );
      setSuccess(false);
    }
  };

  return (
    <main className="maintenance-plan-form-page">
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
          <div className="maintenance-plan-form-header-actions">
            <Link href="/maintenance-plans">
              <Button
                variant="secondary"
                type="button"
              >
                Cancel
              </Button>
            </Link>

            {!isView && (
              <Button type="submit" form="maintenance-plan-form">
                {isEdit
                  ? "Save Changes"
                  : "Create Maintenance Plan"}
              </Button>
            )}
          </div>
        }
      />

      {success && (
        <div
          className="maintenance-plan-form-success"
          role="status"
        >
          Maintenance plan saved successfully.
        </div>
      )}

      {submitError && (
        <div
          className="maintenance-plan-form-error"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <form
        id="maintenance-plan-form"
        onSubmit={handleSubmit}
        className="maintenance-plan-form"
      >
        <div className="maintenance-plan-form-grid">
          <section className="maintenance-plan-form-card">
            <div className="maintenance-plan-form-card-header">
              <h3>Plan Details</h3>
              <p>
                Select the asset and define the maintenance
                schedule.
              </p>
            </div>

            <div className="maintenance-plan-form-fields">
              <div className="maintenance-plan-form-field">
                <label htmlFor="assetId">
                  Asset{" "}
                  <span className="maintenance-plan-form-required">
                    *
                  </span>
                </label>

                <select
                  id="assetId"
                  value={values.assetId}
                  disabled={isView}
                  onChange={(event) =>
                    updateValue(
                      "assetId",
                      event.target.value,
                    )
                  }
                  className={
                    errors.assetId
                      ? "maintenance-plan-form-control-error"
                      : ""
                  }
                >
                  <option value="">
                    Select asset
                  </option>

                  {assets.map((asset: Asset) => (
                    <option
                      key={asset.id}
                      value={asset.id}
                    >
                      {asset.name} ({asset.assetCode})
                    </option>
                  ))}
                </select>

                {errors.assetId && (
                  <p className="maintenance-plan-form-field-error">
                    {errors.assetId}
                  </p>
                )}
              </div>

              <div className="maintenance-plan-form-field">
                <label htmlFor="planName">
                  Plan Name{" "}
                  <span className="maintenance-plan-form-required">
                    *
                  </span>
                </label>

                <input
                  id="planName"
                  type="text"
                  value={values.planName}
                  disabled={isView}
                  onChange={(event) =>
                    updateValue(
                      "planName",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. AHU Monthly Filter & Belt Check"
                  className={
                    errors.planName
                      ? "maintenance-plan-form-control-error"
                      : ""
                  }
                />

                {errors.planName && (
                  <p className="maintenance-plan-form-field-error">
                    {errors.planName}
                  </p>
                )}
              </div>

              <div className="maintenance-plan-form-field">
                <label htmlFor="frequency">
                  Frequency{" "}
                  <span className="maintenance-plan-form-required">
                    *
                  </span>
                </label>

                <select
                  id="frequency"
                  value={values.frequency}
                  disabled={isView}
                  onChange={(event) =>
                    updateValue(
                      "frequency",
                      event.target
                        .value as MaintenanceFrequency,
                    )
                  }
                  className={
                    errors.frequency
                      ? "maintenance-plan-form-control-error"
                      : ""
                  }
                >
                  <option value="monthly">
                    Monthly
                  </option>
                  <option value="weekly">
                    Weekly
                  </option>
                  <option value="quarterly">
                    Quarterly
                  </option>
                  <option value="bi-annually">
                    Bi-Annually
                  </option>
                  <option value="annually">
                    Annually
                  </option>
                </select>

                {errors.frequency && (
                  <p className="maintenance-plan-form-field-error">
                    {errors.frequency}
                  </p>
                )}
              </div>

              <div className="maintenance-plan-form-field">
                <label htmlFor="status">
                  Status{" "}
                  <span className="maintenance-plan-form-required">
                    *
                  </span>
                </label>

                <select
                  id="status"
                  value={values.status}
                  disabled={isView}
                  onChange={(event) =>
                    updateValue(
                      "status",
                      event.target
                        .value as MaintenancePlanStatus,
                    )
                  }
                  className={
                    errors.status
                      ? "maintenance-plan-form-control-error"
                      : ""
                  }
                >
                  <option value="active">
                    Active
                  </option>
                  <option value="paused">
                    Paused
                  </option>
                  <option value="draft">
                    Draft
                  </option>
                </select>

                {errors.status && (
                  <p className="maintenance-plan-form-field-error">
                    {errors.status}
                  </p>
                )}
              </div>

              <div className="maintenance-plan-form-field">
                <label htmlFor="startDate">
                  Start Date{" "}
                  <span className="maintenance-plan-form-required">
                    *
                  </span>
                </label>

                <input
                  id="startDate"
                  type="date"
                  value={values.startDate}
                  disabled={isView}
                  onChange={(event) =>
                    updateValue(
                      "startDate",
                      event.target.value,
                    )
                  }
                  className={
                    errors.startDate
                      ? "maintenance-plan-form-control-error"
                      : ""
                  }
                />

                {errors.startDate && (
                  <p className="maintenance-plan-form-field-error">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="maintenance-plan-form-field">
                <label htmlFor="nextDueDate">
                  Next Due Date{" "}
                  <span className="maintenance-plan-form-required">
                    *
                  </span>
                </label>

                <input
                  id="nextDueDate"
                  type="date"
                  value={values.nextDueDate}
                  disabled={isView}
                  onChange={(event) =>
                    updateValue(
                      "nextDueDate",
                      event.target.value,
                    )
                  }
                  className={
                    errors.nextDueDate
                      ? "maintenance-plan-form-control-error"
                      : ""
                  }
                />

                {errors.nextDueDate && (
                  <p className="maintenance-plan-form-field-error">
                    {errors.nextDueDate}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="maintenance-plan-form-card">
            <div className="maintenance-plan-form-card-header">
              <h3>Maintenance Checklist</h3>
              <p>
                Enter one maintenance checklist item per
                line.
              </p>
            </div>

            <div className="maintenance-plan-form-field">
              <label htmlFor="checklist">
                Checklist Items
              </label>

              <textarea
                id="checklist"
                value={values.checklist}
                disabled={isView}
                onChange={(event) =>
                  updateValue(
                    "checklist",
                    event.target.value,
                  )
                }
                placeholder={
                  "1. Inspect filter condition\n2. Check belt tension\n3. Clean blower housing"
                }
                rows={6}
              />
            </div>
          </section>
        </div>

        {selectedAsset && (
          <section className="maintenance-plan-selected-asset">
            <div>
              <span>Selected Asset</span>
              <strong>{selectedAsset.name}</strong>
            </div>

            <div>
              <span>Asset Code</span>
              <strong>{selectedAsset.assetCode}</strong>
            </div>

            <div>
              <span>Category</span>
              <strong>{selectedAsset.category}</strong>
            </div>
          </section>
        )}
      </form>
    </main>
  );
}