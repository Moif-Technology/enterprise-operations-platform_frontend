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
  getContractLifecycleStatus,
  isContractExpiringWithin30Days,
} from "@/modules/assets/service";
import type {
  Contract,
  ContractStatus,
  ContractType,
  Customer,
} from "@/modules/assets/types";

function getLifecycleLabel(status: ReturnType<typeof getContractLifecycleStatus>) {
  switch (status) {
    case "scheduled":
      return "Scheduled";
    case "active":
      return "Active";
    case "expired":
      return "Expired";
    case "draft":
      return "Draft";
    case "cancelled":
      return "Cancelled";
  }
}

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
        contract.contractNumber.toLowerCase().includes(normalizedSearch) ||
        contract.title.toLowerCase().includes(normalizedSearch);
  
      const matchesCustomer =
        !customerId || contract.customerId === customerId;
  
      const matchesType =
        !type || contract.type === type;
  
      const matchesStatus =
        !status ||
        (status === "expiring-soon"
          ? isContractExpiringWithin30Days(contract)
          : getContractLifecycleStatus(contract) === status);
  
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
            <option value="expiring-soon">Expiring within 30 days</option>
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
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full border-collapse text-left text-sm min-w-[950px] table-fixed">
                <colgroup>
                  <col className="w-[14%]" />
                  <col className="w-[24%]" />
                  <col className="w-[18%]" />
                  <col className="w-[10%]" />
                  <col className="w-[12%]" />
                  <col className="w-[12%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-5 py-3.5">Contract number</th>
                    <th className="px-5 py-3.5">Title</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Start date</th>
                    <th className="px-5 py-3.5">End date</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredContracts.map((contract) => {
                    const lifecycleStatus = getContractLifecycleStatus(contract);
                    return (
                      <tr
                        key={contract.id}
                        onClick={() => openContract(contract.id)}
                        className="cursor-pointer transition-colors hover:bg-muted/40 group"
                      >
                        <td className="px-5 py-4 font-medium text-foreground truncate">
                          {contract.contractNumber}
                        </td>
                        <td className="px-5 py-4 text-foreground truncate" title={contract.title}>
                          {contract.title}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground truncate">
                          {customerNameById.get(contract.customerId) ?? "Unknown customer"}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground truncate">
                          {contract.type}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                          {formatDate(contract.startDate)}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                          {formatDate(contract.endDate)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <Badge
                            tone={
                              lifecycleStatus === "active"
                                ? "success"
                                : lifecycleStatus === "scheduled"
                                ? "info"
                                : lifecycleStatus === "expired"
                                ? "danger"
                                : lifecycleStatus === "draft"
                                ? "warning"
                                : "neutral"
                            }
                          >
                            {getLifecycleLabel(lifecycleStatus)}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Panel>
    </main>
  );
}