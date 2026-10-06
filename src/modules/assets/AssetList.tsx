"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import SearchInput from "@/components/ui/SearchInput";
import FormField from "@/components/ui/FormField";
import {
  Badge,
  Button,
  Panel,
} from "@/components/ui/design-system";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/States";
import {
  getAssets,
  getCustomers,
  getSites,
  getSitesByCustomerId,
} from "@/modules/assets/service";
import type {
  Asset,
  AssetCategory,
  AssetStatus,
  Customer,
  Site,
} from "@/modules/assets/types";

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

type ListStatus = "loading" | "ready" | "error";

const ASSET_CATEGORIES: AssetCategory[] = [
  "HVAC",
  "Electrical",
  "Fire Safety",
  "Plumbing",
  "Generator",
  "Other",
];

const ASSET_STATUSES: AssetStatus[] = [
  "active",
  "inactive",
  "under-maintenance",
  "decommissioned",
];

const TABLE_COLUMNS =
  "0.9fr 1.2fr 0.8fr 1fr 1fr 0.9fr 0.9fr 0.7fr";

function statusTone(
  status: AssetStatus,
): "neutral" | "success" | "warning" | "danger" | "info" {
  switch (status) {
    case "active":
      return "success";
    case "under-maintenance":
      return "warning";
    case "decommissioned":
      return "danger";
    case "inactive":
    default:
      return "neutral";
  }
}

function formatStatusLabel(status: AssetStatus): string {
  return status
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AssetList() {
  const router = useRouter();

  const [listStatus, setListStatus] = useState<ListStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);

  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("all");
  const [siteId, setSiteId] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const loadAssets = () => {
    setListStatus("loading");
    setErrorMessage(undefined);

    try {
      const nextAssets = getAssets();
      const nextCustomers = getCustomers();
      const nextSites = getSites();

      setAssets(nextAssets);
      setCustomers(nextCustomers);
      setAllSites(nextSites);
      setListStatus("ready");
    } catch (error) {
      setListStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The asset list could not be loaded.",
      );
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadAssets();
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  const availableSites = useMemo(() => {
    if (customerId === "all") {
      return allSites;
    }

    return getSitesByCustomerId(customerId);
  }, [allSites, customerId]);

  useEffect(() => {
    if (siteId === "all") {
      return;
    }

    const siteStillValid = availableSites.some((site) => site.id === siteId);
    if (!siteStillValid) {
      setSiteId("all");
    }
  }, [availableSites, siteId]);

  const customerNameById = useMemo(() => {
    return new Map(customers.map((customer) => [customer.id, customer.name]));
  }, [customers]);

  const siteNameById = useMemo(() => {
    return new Map(allSites.map((site) => [site.id, site.name]));
  }, [allSites]);

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assets.filter((asset) => {
      if (customerId !== "all" && asset.customerId !== customerId) {
        return false;
      }

      if (siteId !== "all" && asset.siteId !== siteId) {
        return false;
      }

      if (category !== "all" && asset.category !== category) {
        return false;
      }

      if (status !== "all" && asset.status !== status) {
        return false;
      }

      if (!query) {
        return true;
      }

      const serial = asset.serialNumber?.toLowerCase() ?? "";
      return (
        asset.name.toLowerCase().includes(query) ||
        asset.assetCode.toLowerCase().includes(query) ||
        serial.includes(query)
      );
    });
  }, [assets, search, customerId, siteId, category, status]);

  const clearFilters = () => {
    setSearch("");
    setCustomerId("all");
    setSiteId("all");
    setCategory("all");
    setStatus("all");
  };

  const openAsset = (assetId: string) => {
    router.push(`/assets/${assetId}`);
  };

  return (
    <section>
    <PageHeader
  title="Asset Registry"
  description="Search and filter registered assets across customers, sites, and status."
  action={
    <Button onClick={() => router.push("/assets/new")}>
      Register Asset
    </Button>
  }
  secondaryAction={
    <button
      type="button"
      className="asset-refresh-button"
      onClick={() => window.location.reload()}
      aria-label="Refresh assets"
      title="Refresh assets"
    >
      ↻
    </button>
  }
/>

     
<FilterBar
  action={
    search ||
    customerId !== "all" ||
    siteId !== "all" ||
    category !== "all" ||
    status !== "all" ? (
      <button
      type="button"
      className="filter-reset"
      onClick={clearFilters}
    >
      Clear filters
    </button>
    ) : undefined
  }
>
  <SearchInput
    id="asset-search"
    className="asset-search"
    placeholder="Search name, code, or serial..."
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    aria-label="Search assets by name, code, or serial number"
  />

  <FormField
    label="Customer"
    name="asset-filter-customer"
    type="select"
    selectProps={{
      value: customerId,
      onChange: (event) => {
        setCustomerId(event.target.value);
        setSiteId("all");
      },
    }}
  >
    <option value="all">All customers</option>
    {customers.map((customer) => (
      <option key={customer.id} value={customer.id}>
        {customer.name}
      </option>
    ))}
  </FormField>

  <FormField
    label="Site"
    name="asset-filter-site"
    type="select"
    selectProps={{
      value: siteId,
      onChange: (event) => setSiteId(event.target.value),
    }}
  >
    <option value="all">All sites</option>
    {availableSites.map((site) => (
      <option key={site.id} value={site.id}>
        {site.name}
      </option>
    ))}
  </FormField>

  <FormField
    label="Category"
    name="asset-filter-category"
    type="select"
    selectProps={{
      value: category,
      onChange: (event) => setCategory(event.target.value),
    }}
  >
    <option value="all">All categories</option>
    {ASSET_CATEGORIES.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </FormField>

  <FormField
    label="Status"
    name="asset-filter-status"
    type="select"
    selectProps={{
      value: status,
      onChange: (event) => setStatus(event.target.value),
    }}
  >
    <option value="all">All statuses</option>
    {ASSET_STATUSES.map((item) => (
      <option key={item} value={item}>
        {formatStatusLabel(item)}
      </option>
    ))}
  </FormField>
</FilterBar>

        <div style={{ marginTop: 16 }}>
          {listStatus === "loading" && (
            <LoadingState message="Loading assets..." />
          )}

          {listStatus === "error" && (
            <ErrorState
              title="Unable to load assets"
              message={
                errorMessage ??
                "The sample asset data could not be loaded."
              }
              onRetry={loadAssets}
            />
          )}

          {listStatus === "ready" && assets.length === 0 && (
            <EmptyState
              title="No assets yet"
              description="Register the first asset to start the registry."
              actionLabel="Register Asset"
              onAction={() => router.push("/assets/new")}
            />
          )}

          {listStatus === "ready" &&
            assets.length > 0 &&
            filteredAssets.length === 0 && (
              <EmptyState
                title="No matching assets"
                description="No assets match the current search and filters."
                actionLabel="Clear filters"
                onAction={clearFilters}
              />
            )}

          {listStatus === "ready" && filteredAssets.length > 0 && (
            <div className="table-shell" style={{ overflowX: "auto" }}>
              <div
                className="table-head"
                style={{
                  gridTemplateColumns: TABLE_COLUMNS,
                  minWidth: 920,
                }}
              >
                <span>Asset code</span>
                <span>Name</span>
                <span>Category</span>
                <span>Customer</span>
                <span>Site</span>
                <span>Status</span>
                <span>Next maintenance</span>
                <span>Actions</span>
              </div>

              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="table-row"
                  role="link"
                  tabIndex={0}
                  style={{
                    gridTemplateColumns: TABLE_COLUMNS,
                    minWidth: 920,
                    cursor: "pointer",
                  }}
                  onClick={() => openAsset(asset.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openAsset(asset.id);
                    }
                  }}
                  aria-label={`View details for ${asset.name}`}
                >
                  <span className="asset-code">{asset.assetCode}</span>
                  <span>{asset.name}</span>
                  <span>{asset.category}</span>
                  <span>
                    {customerNameById.get(asset.customerId) ?? asset.customerId}
                  </span>
                  <span>
                    {siteNameById.get(asset.siteId) ?? asset.siteId}
                  </span>
                  <span>
                    <Badge tone={statusTone(asset.status)}>
                      {formatStatusLabel(asset.status)}
                    </Badge>
                  </span>
                  <span>{formatDate(asset.nextMaintenanceDate)}</span>
                  <span
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                   <div className="asset-row-actions">
  <button
    type="button"
    className="asset-icon-button asset-icon-button-view"
    aria-label="View asset details"
    title="View Details"
    onClick={() => openAsset(asset.id)}
  >
    <EyeIcon />
  </button>

  <button
    type="button"
    className="asset-icon-button asset-icon-button-edit"
    aria-label="Edit asset"
    title="Edit Asset"
    onClick={() => router.push(`/assets/${asset.id}/edit`)}
  >
    <PencilIcon />

  </button>
</div>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
     
    </section>
  );
}
