"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/design-system";

import {
  getAssets,
  getContracts,
  getCustomers,
  getSitesByCustomerId,
  saveContract,
} from "@/modules/assets/service";

import type { Contract } from "@/modules/assets/types";

interface ContractFormProps {
  contract?: Contract;
  mode?: "edit" | "renew";
}

interface ContractFormErrors {
  contractNumber?: string;
  title?: string;
  customerId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export default function ContractForm({
  contract,
  mode = "edit",
}: ContractFormProps) {
  const router = useRouter();

  const customers = getCustomers().filter(
    (customer) =>
      customer.status === "active" ||
      customer.id === contract?.customerId,
  );

  const [customerId, setCustomerId] = useState(
    contract?.customerId ?? "",
  );

  const [siteIds, setSiteIds] = useState<string[]>(
    contract?.siteIds ?? [],
  );

  const [assetIds, setAssetIds] = useState<string[]>(
    contract?.assetIds ?? [],
  );

  const [error, setError] = useState("");
  const [errors, setErrors] = useState<ContractFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSiteDropdownOpen, setIsSiteDropdownOpen] =
    useState(false);

  const [isAssetDropdownOpen, setIsAssetDropdownOpen] =
    useState(false);

  const sites = customerId
    ? getSitesByCustomerId(customerId).filter(
        (site) =>
          site.status === "active" ||
          contract?.siteIds.includes(site.id),
      )
    : [];

  const assets = getAssets().filter(
    (asset) =>
      asset.status === "active" &&
      asset.customerId === customerId &&
      (!siteIds.length || siteIds.includes(asset.siteId)),
  );

  const isEdit = Boolean(contract) && mode === "edit";
  const isRenew = Boolean(contract) && mode === "renew";

  const clearFieldError = (
    field: keyof ContractFormErrors,
  ) => {
    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const enteredContractNumber = String(
      formData.get("contractNumber") ?? "",
    ).trim();

    const contractNumber = isRenew
      ? `${enteredContractNumber}-R1`
      : enteredContractNumber;

    const title = String(
      formData.get("title") ?? "",
    ).trim();

    const type = String(
      formData.get("type") ?? "AMC",
    );

    const status = isRenew
      ? "draft"
      : String(
          formData.get("status") ?? "draft",
        );

    const startDate = String(
      formData.get("startDate") ?? "",
    );

    const endDate = String(
      formData.get("endDate") ?? "",
    );

    const serviceScope = String(
      formData.get("serviceScope") ?? "",
    ).trim();

    const validationErrors: ContractFormErrors = {};

    if (!contractNumber) {
      validationErrors.contractNumber =
        "Contract number is required.";
    }

    if (!title) {
      validationErrors.title =
        "Contract title is required.";
    }

    if (!customerId) {
      validationErrors.customerId =
        "Customer is required.";
    }

    if (!type) {
      validationErrors.type =
        "Contract type is required.";
    }

    if (!startDate) {
      validationErrors.startDate =
        "Start date is required.";
    }

    if (!endDate) {
      validationErrors.endDate =
        "End date is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    if (endDate < startDate) {
      setError(
        "End date must be on or after the start date.",
      );
      setIsSubmitting(false);
      return;
    }

    if (!serviceScope) {
      setError("Service scope is required.");
      setIsSubmitting(false);
      return;
    }

    if (
      isRenew &&
      contract &&
      getContracts().some(
        (item) =>
          item.originalContractId === contract.id ||
          item.id === contract.id ||
          item.originalContractId ===
            contract.originalContractId,
      )
    ) {
      setError(
        "A renewal draft already exists for this contract.",
      );
      setIsSubmitting(false);
      return;
    }

    const contractNumberExists = getContracts().some(
      (item) =>
        item.id !== contract?.id &&
        item.contractNumber.toLowerCase() ===
          contractNumber.toLowerCase(),
    );

    if (contractNumberExists) {
      setError("Contract number must be unique.");
      setIsSubmitting(false);
      return;
    }

    if (!siteIds.length) {
      setError("At least one site is required.");
      setIsSubmitting(false);
      return;
    }

    const invalidSite = siteIds.some(
      (siteId) =>
        !sites.some((site) => site.id === siteId),
    );

    if (invalidSite) {
      setError(
        "One or more selected sites do not belong to the selected customer.",
      );
      setIsSubmitting(false);
      return;
    }

    const invalidAsset = assetIds.some(
      (assetId) =>
        !assets.some((asset) => asset.id === assetId),
    );

    if (invalidAsset) {
      setError(
        "One or more selected assets do not match the selected customer or site.",
      );
      setIsSubmitting(false);
      return;
    }

    const valueInput = String(
      formData.get("value") ?? "",
    ).trim();

    const responseInput = String(
      formData.get("responseHours") ?? "",
    ).trim();

    const resolutionInput = String(
      formData.get("resolutionHours") ?? "",
    ).trim();

    const value = valueInput
      ? Number(valueInput)
      : undefined;

    const responseHours = responseInput
      ? Number(responseInput)
      : undefined;

    const resolutionHours = resolutionInput
      ? Number(resolutionInput)
      : undefined;

    if (
      value !== undefined &&
      (!Number.isFinite(value) || value < 0)
    ) {
      setError(
        "Contract value must be a valid non-negative number.",
      );
      setIsSubmitting(false);
      return;
    }

    if (
      responseHours !== undefined &&
      (!Number.isFinite(responseHours) ||
        responseHours <= 0)
    ) {
      setError(
        "Response time must be a valid non-negative number.",
      );
      setIsSubmitting(false);
      return;
    }

    if (
      resolutionHours !== undefined &&
      (!Number.isFinite(resolutionHours) ||
        resolutionHours <= 0)
    ) {
      setError(
        "Resolution time must be a valid non-negative number.",
      );
      setIsSubmitting(false);
      return;
    }

    if (
      responseHours !== undefined &&
      resolutionHours !== undefined &&
      responseHours > resolutionHours
    ) {
      setError(
        "Response time must be less than or equal to resolution time.",
      );
      setIsSubmitting(false);
      return;
    }

    const savedContract: Contract = {
      id: isRenew
        ? `contract-${Date.now()}`
        : contract?.id ?? `contract-${Date.now()}`,
      contractNumber,
      title,
      customerId,
      siteIds,
      assetIds,
      type: type as "AMC" | "Warranty" | "Service",
      startDate,
      endDate,
      status: status as
        | "draft"
        | "active"
        | "cancelled",
      serviceScope,
      exclusions:
        String(
          formData.get("exclusions") ?? "",
        ).trim() || undefined,
      visitFrequency:
        String(
          formData.get("visitFrequency") ?? "",
        ).trim() || undefined,
      value,
      currency: String(
        formData.get("currency") ?? "INR",
      ) as "INR" | "USD",
      responseHours,
      resolutionHours,
      notes:
        String(
          formData.get("notes") ?? "",
        ).trim() || undefined,
      ...(isRenew && contract
        ? { originalContractId: contract.id }
        : contract?.originalContractId
          ? {
              originalContractId:
                contract.originalContractId,
            }
          : {}),
    };

    try {
      const saved = saveContract(savedContract);
      router.push(`/contracts/${saved.id}`);
    } catch {
      setError(
        "Unable to save the contract. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contract-form-page">
      <PageHeader
        title={
          isRenew
            ? "Renew Contract"
            : isEdit
              ? "Edit Contract"
              : "Create Contract"
        }
        description="Create a new contract or AMC agreement."
        action={
          <div className="contract-form-header-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/contracts")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="contract-form"
              loading={isSubmitting}
            >
              {isRenew
                ? "Create Renewal"
                : isEdit
                  ? "Save Changes"
                  : "Create Contract"}
            </Button>
          </div>
        }
      />

      {error && (
        <div
          className="contract-form-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        id="contract-form"
        onSubmit={handleSubmit}
        className="contract-form"
      >
        <div className="contract-form-grid">
          {/* Contract Information */}
          <section className="contract-form-card">
            <div className="contract-form-card-header">
              <h3>Contract Information</h3>
            </div>

            <div className="contract-form-fields">
              <label className="contract-form-field">
                <span>
                  Contract Number{" "}
                  <span className="contract-form-required">
                    *
                  </span>
                </span>

                <input
                  name="contractNumber"
                  defaultValue={
                    contract?.contractNumber ?? ""
                  }
                  placeholder="e.g. AMC-2026-001"
                  className={
                    errors.contractNumber
                      ? "contract-form-control-error"
                      : ""
                  }
                  onChange={() =>
                    clearFieldError("contractNumber")
                  }
                />

                {errors.contractNumber && (
                  <span className="contract-form-field-error">
                    {errors.contractNumber}
                  </span>
                )}
              </label>

              <label className="contract-form-field">
                <span>
                  Contract Title{" "}
                  <span className="contract-form-required">
                    *
                  </span>
                </span>

                <input
                  name="title"
                  defaultValue={contract?.title ?? ""}
                  placeholder="e.g. Annual Maintenance Contract"
                  className={
                    errors.title
                      ? "contract-form-control-error"
                      : ""
                  }
                  onChange={() =>
                    clearFieldError("title")
                  }
                />

                {errors.title && (
                  <span className="contract-form-field-error">
                    {errors.title}
                  </span>
                )}
              </label>

              <label className="contract-form-field">
                <span>
                  Customer{" "}
                  <span className="contract-form-required">
                    *
                  </span>
                </span>

                <select
                  name="customerId"
                  value={customerId}
                  onChange={(event) => {
                    setCustomerId(event.target.value);
                    setSiteIds([]);
                    setAssetIds([]);
                    clearFieldError("customerId");
                  }}
                  className={
                    errors.customerId
                      ? "contract-form-control-error"
                      : ""
                  }
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name} ({customer.code})
                    </option>
                  ))}
                </select>

                {errors.customerId && (
                  <span className="contract-form-field-error">
                    {errors.customerId}
                  </span>
                )}
              </label>

              <div className="contract-form-field">
                <span>Site</span>

                <div className="contract-form-multi-select">
                  <button
                    type="button"
                    onClick={() =>
                      setIsSiteDropdownOpen(
                        (open) => !open,
                      )
                    }
                    disabled={!customerId}
                    aria-expanded={
                      isSiteDropdownOpen
                    }
                    className="contract-form-multi-select-trigger"
                  >
                    <span>
                      {siteIds.length > 0
                        ? `${siteIds.length} site${
                            siteIds.length > 1
                              ? "s"
                              : ""
                          } selected`
                        : "Select sites"}
                    </span>

                    <span aria-hidden="true">
                      {isSiteDropdownOpen
                        ? "▲"
                        : "▼"}
                    </span>
                  </button>

                  {isSiteDropdownOpen &&
                    customerId && (
                      <div className="contract-form-multi-select-menu">
                        {sites.map((site) => (
                          <label
                            key={site.id}
                            className="contract-form-option"
                          >
                            <input
                              type="checkbox"
                              checked={siteIds.includes(
                                site.id,
                              )}
                              onChange={(event) => {
                                setSiteIds(
                                  (current) =>
                                    event.target
                                      .checked
                                      ? [
                                          ...current,
                                          site.id,
                                        ]
                                      : current.filter(
                                          (id) =>
                                            id !==
                                            site.id,
                                        ),
                                );
                                setAssetIds([]);
                              }}
                            />

                            <span>
                              {site.name} ({site.code})
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                </div>
              </div>

              <div className="contract-form-field">
                <span>Asset</span>

                <div className="contract-form-multi-select">
                  <button
                    type="button"
                    onClick={() =>
                      setIsAssetDropdownOpen(
                        (open) => !open,
                      )
                    }
                    disabled={!customerId}
                    aria-expanded={
                      isAssetDropdownOpen
                    }
                    className="contract-form-multi-select-trigger"
                  >
                    <span>
                      {assetIds.length > 0
                        ? `${assetIds.length} asset${
                            assetIds.length > 1
                              ? "s"
                              : ""
                          } selected`
                        : "Select assets"}
                    </span>

                    <span aria-hidden="true">
                      {isAssetDropdownOpen
                        ? "▲"
                        : "▼"}
                    </span>
                  </button>

                  {isAssetDropdownOpen &&
                    customerId && (
                      <div className="contract-form-multi-select-menu">
                        {assets.length > 0 ? (
                          assets.map((asset) => (
                            <label
                              key={asset.id}
                              className="contract-form-option"
                            >
                              <input
                                type="checkbox"
                                checked={assetIds.includes(
                                  asset.id,
                                )}
                                onChange={(event) => {
                                  setAssetIds(
                                    (current) =>
                                      event.target
                                        .checked
                                        ? [
                                            ...current,
                                            asset.id,
                                          ]
                                        : current.filter(
                                            (id) =>
                                              id !==
                                              asset.id,
                                          ),
                                  );
                                }}
                              />

                              <span>
                                {asset.name} (
                                {asset.assetCode})
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="contract-form-option-empty">
                            No eligible assets for the
                            selected customer and site.
                          </p>
                        )}
                      </div>
                    )}
                </div>

                <p className="contract-form-help">
                  {assetIds.length === 0
                    ? "Coverage: Site-wide"
                    : "Select specific assets covered by this contract."}
                </p>
              </div>

              <label className="contract-form-field">
                <span>
                  Type{" "}
                  <span className="contract-form-required">
                    *
                  </span>
                </span>

                <select
                  name="type"
                  defaultValue={
                    contract?.type ?? "AMC"
                  }
                  className={
                    errors.type
                      ? "contract-form-control-error"
                      : ""
                  }
                  onChange={() =>
                    clearFieldError("type")
                  }
                >
                  <option value="AMC">AMC</option>
                  <option value="Service">
                    Service Level Agreement
                  </option>
                  <option value="Warranty">
                    Warranty
                  </option>
                  <option value="On-Call">
                    On-Call
                  </option>
                </select>

                {errors.type && (
                  <span className="contract-form-field-error">
                    {errors.type}
                  </span>
                )}
              </label>

              <label className="contract-form-field">
                <span>
                  Status{" "}
                  <span className="contract-form-required">
                    *
                  </span>
                </span>

                <select
                  name="status"
                  defaultValue={
                    contract?.status ?? "draft"
                  }
                >
                  <option value="draft">
                    Draft
                  </option>
                  <option value="active">
                    Active
                  </option>
                  <option value="expired">
                    Expired
                  </option>
                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </label>
            </div>
          </section>

          {/* Duration & Service Scope */}
          <section className="contract-form-card">
            <div className="contract-form-card-header">
              <h3>Duration &amp; Service Scope</h3>
            </div>

            <div className="contract-form-fields">
              <label className="contract-form-field">
                <span>
                  Start Date{" "}
                  <span className="contract-form-required">
                    *
                  </span>
                </span>

                <input
                  name="startDate"
                  type="date"
                  defaultValue={
                    isRenew
                      ? ""
                      : contract?.startDate ?? ""
                  }
                  className={
                    errors.startDate
                      ? "contract-form-control-error"
                      : ""
                  }
                  onChange={() =>
                    clearFieldError("startDate")
                  }
                />

                {errors.startDate && (
                  <span className="contract-form-field-error">
                    {errors.startDate}
                  </span>
                )}
              </label>

              <label className="contract-form-field">
                <span>
                  End Date{" "}
                  <span className="contract-form-required">
                    *
                  </span>
                </span>

                <input
                  name="endDate"
                  type="date"
                  defaultValue={
                    isRenew
                      ? ""
                      : contract?.endDate ?? ""
                  }
                  className={
                    errors.endDate
                      ? "contract-form-control-error"
                      : ""
                  }
                  onChange={() =>
                    clearFieldError("endDate")
                  }
                />

                {errors.endDate && (
                  <span className="contract-form-field-error">
                    {errors.endDate}
                  </span>
                )}
              </label>

              <label className="contract-form-field contract-form-field-full">
                <span>Service Scope</span>

                <textarea
                  name="serviceScope"
                  rows={3}
                  defaultValue={
                    contract?.serviceScope ?? ""
                  }
                  placeholder="Describe services covered by this contract"
                />
              </label>

              <label className="contract-form-field contract-form-field-full">
                <span>Exclusions</span>

                <textarea
                  name="exclusions"
                  rows={3}
                  defaultValue={
                    contract?.exclusions ?? ""
                  }
                  placeholder="Describe any excluded services or items"
                />
              </label>
            </div>
          </section>

          {/* SLA & Commercial Terms */}
          <section className="contract-form-card contract-form-card-wide">
            <div className="contract-form-card-header">
              <h3>SLA &amp; Commercial Terms</h3>
            </div>

            <div className="contract-form-commercial-grid">
              <label className="contract-form-field">
                <span>Contract Value</span>

                <input
                  name="value"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={
                    contract?.value ?? ""
                  }
                  placeholder="e.g. 120000"
                />
              </label>

              <label className="contract-form-field">
                <span>Currency</span>

                <select
                  name="currency"
                  defaultValue={
                    contract?.currency ?? "INR"
                  }
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>

              <label className="contract-form-field">
                <span>Visit Frequency</span>

                <input
                  name="visitFrequency"
                  type="text"
                  defaultValue={
                    contract?.visitFrequency ?? ""
                  }
                  placeholder="e.g. Monthly"
                />
              </label>

              <label className="contract-form-field">
                <span>Response Time (hours)</span>

                <input
                  name="responseHours"
                  type="number"
                  min="0"
                  step="0.5"
                  defaultValue={
                    contract?.responseHours ?? ""
                  }
                  placeholder="e.g. 4"
                />
              </label>

              <label className="contract-form-field">
                <span>Resolution Time (hours)</span>

                <input
                  name="resolutionHours"
                  type="number"
                  min="0"
                  step="0.5"
                  defaultValue={
                    contract?.resolutionHours ?? ""
                  }
                  placeholder="e.g. 24"
                />
              </label>

              <label className="contract-form-field contract-form-field-full">
                <span>Notes</span>

                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={
                    contract?.notes ?? ""
                  }
                  placeholder="Add any additional contract notes"
                />
              </label>
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}