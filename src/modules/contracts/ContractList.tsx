
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
  getContracts,
  getCustomers,
} from "@/modules/assets/service";

import type {
  Contract,
  ContractStatus,
  ContractType,
  Customer,
} from "@/modules/assets/types";

const CONTRACT_TYPES: ContractType[] = [
  "AMC",
  "Warranty",
  "Service",
];

const CONTRACT_STATUSES: ContractStatus[] = [
  "draft",
  "active",
  "expired",
  "cancelled",
];

const statusTone: Record<
  ContractStatus,
  "neutral" | "success" | "warning" | "danger"
> = {
  draft: "warning",
  active: "success",
  expired: "danger",
  cancelled: "neutral",
};

const formatStatusLabel = (status: ContractStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function ContractList() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setContracts(getContracts());
        setCustomers(getCustomers());
        setError(null);
      } catch {
        setError("Unable to load contracts.");
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  const customerNameById = useMemo(
    () =>
      new Map(
        customers.map((customer) => [
          customer.id,
          customer.name,
        ]),
      ),
    [customers],
  );

  const filteredContracts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return contracts.filter((contract) => {
      const matchesSearch =
        !normalizedSearch ||
        contract.contractNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        contract.title
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCustomer =
        !customerId || contract.customerId === customerId;

      const matchesType =
        !type || contract.type === type;

      const matchesStatus =
        !status || contract.status === status;

      return (
        matchesSearch &&
        matchesCustomer &&
        matchesType &&
        matchesStatus
      );
    });
  }, [contracts, search, customerId, type, status]);

  const hasActiveFilters =
    search.trim() !== "" ||
    customerId !== "" ||
    type !== "" ||
    status !== "";

  const clearFilters = () => {
    setSearch("");
    setCustomerId("");
    setType("");
    setStatus("");
  };

  const openContract = (contractId: string) => {
    router.push(`/contracts/${contractId}`);
  };

  return (
    <main className="space-y-6 p-6">
      <PageHeader
        eyebrow="Contracts"
        title="Contracts & AMC"
        description="Manage customer contracts, AMC coverage, terms, and lifecycle records."
        action={
          <Button
            variant="primary"
            onClick={() => router.push("/contracts/new")}
          >
            Create Contract
          </Button>
        }
      />

      <Panel
        title="Contracts"
        description="Review contract and AMC records."
      >
        <FilterBar>
        <SearchInput
  value={search}
  onChange={(event) => setSearch(event.target.value)}
  placeholder="Search contract number or title..."
/>

<FormField
  label="Customer"
  name="contract-filter-customer"
  type="select"
  selectProps={{
    value: customerId,
    onChange: (event) => setCustomerId(event.target.value),
  }}
>
  <option value="">All customers</option>
  {customers.map((customer) => (
    <option key={customer.id} value={customer.id}>
      {customer.name}
    </option>
  ))}
</FormField>
         

<FormField
  label="Type"
  name="contract-filter-type"
  type="select"
  selectProps={{
    value: type,
    onChange: (event) => setType(event.target.value),
  }}
>
  <option value="">All types</option>
  {CONTRACT_TYPES.map((contractType) => (
    <option key={contractType} value={contractType}>
      {contractType}
    </option>
  ))}
</FormField>
<FormField
  label="Status"
  name="contract-filter-status"
  type="select"
  selectProps={{
    value: status,
    onChange: (event) => setStatus(event.target.value),
  }}
>
  <option value="">All statuses</option>
  {CONTRACT_STATUSES.map((contractStatus) => (
    <option key={contractStatus} value={contractStatus}>
      {formatStatusLabel(contractStatus)}
    </option>
  ))}
</FormField>

          {hasActiveFilters && (
            <Button
              variant="secondary"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </FilterBar>

        <div className="mt-6">
          {loading ? (
            <LoadingState message="Loading contracts..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : contracts.length === 0 ? (
            <EmptyState
            title="No contracts yet"
            description="Create a contract or AMC record to get started."
            actionLabel="Create Contract"
            onAction={() => router.push("/contracts/new")}
          />
          ) : filteredContracts.length === 0 ? (
            <EmptyState
  title="No matching contracts"
  description="Try changing your search or filters."
  actionLabel="Clear filters"
  onAction={clearFilters}
/>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <div
                  className="grid gap-4 border-b border-border px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  style={{
                    gridTemplateColumns:
                      "1fr 1.4fr 1.2fr 0.8fr 1fr 1fr 0.8fr",
                  }}
                >
                  <span>Contract number</span>
                  <span>Title</span>
                  <span>Customer</span>
                  <span>Type</span>
                  <span>Start date</span>
                  <span>End date</span>
                  <span>Status</span>
                </div>

                {filteredContracts.map((contract) => (
                  <button
                    key={contract.id}
                    type="button"
                    onClick={() => openContract(contract.id)}
                    className="grid w-full gap-4 border-b border-border px-4 py-4 text-left text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    style={{
                      gridTemplateColumns:
                        "1fr 1.4fr 1.2fr 0.8fr 1fr 1fr 0.8fr",
                    }}
                  >
                    <span className="font-medium">
                      {contract.contractNumber}
                    </span>

                    <span>{contract.title}</span>

                    <span>
                      {customerNameById.get(
                        contract.customerId,
                      ) ?? "Unknown customer"}
                    </span>

                    <span>{contract.type}</span>

                    <span>
                      {formatDate(contract.startDate)}
                    </span>

                    <span>
                      {formatDate(contract.endDate)}
                    </span>

                    <span>
                      <Badge
                        tone={statusTone[contract.status]}
                      >
                        {formatStatusLabel(contract.status)}
                      </Badge>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Panel>
    </main>
  );
}
