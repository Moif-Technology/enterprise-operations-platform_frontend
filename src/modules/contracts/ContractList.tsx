"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import { Badge, Button } from "@/components/ui/design-system";
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

function getLifecycleLabel(
  status: ReturnType<typeof getContractLifecycleStatus>,
) {
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
  }, [
    contracts,
    search,
    customerId,
    type,
    status,
  ]);

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

  return (
    <main className="contracts-page">
      <PageHeader
        title="Contracts & AMC"
        description="Manage customer contracts, AMC coverage, terms, and lifecycle records."
        action={
          <Button
            onClick={() => router.push("/contracts/new")}
          >
            Create Contract
          </Button>
        }
      />

      <section className="contracts-filter-card">
       

        <div className="contracts-filter-grid">
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by contract number or title"
            className="contracts-search"
          />

          <select
            value={customerId}
            onChange={(event) =>
              setCustomerId(event.target.value)
            }
            className="contracts-filter-select"
            aria-label="Filter by customer"
          >
            <option value="">All customers</option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            className="contracts-filter-select"
            aria-label="Filter by type"
          >
            <option value="">All types</option>

            {CONTRACT_TYPES.map((contractType) => (
              <option
                key={contractType}
                value={contractType}
              >
                {contractType}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="contracts-filter-select"
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>

            {CONTRACT_STATUSES.map((contractStatus) => (
              <option
                key={contractStatus}
                value={contractStatus}
              >
                {formatStatusLabel(contractStatus)}
              </option>
            ))}

            <option value="expiring-soon">
              Expiring within 30 days
            </option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="contracts-filter-actions">
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>

      <section className="contracts-table-card">
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
          <div className="contracts-table-wrapper">
            <table className="contracts-table">
              <thead>
                <tr>
                  <th>CONTRACT NUMBER</th>
                  <th>TITLE</th>
                  <th>CUSTOMER</th>
                  <th>TYPE</th>
                  <th>START DATE</th>
                  <th>END DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredContracts.map((contract) => {
                  const lifecycleStatus =
                    getContractLifecycleStatus(contract);

                  return (
                    <tr key={contract.id}>
                      <td>
                        <span className="contracts-number">
                          {contract.contractNumber}
                        </span>
                      </td>

                      <td>
                        <span
                          className="contracts-title"
                          title={contract.title}
                        >
                          {contract.title}
                        </span>
                      </td>

                      <td>
                        <span className="contracts-customer">
                          {customerNameById.get(
                            contract.customerId,
                          ) ?? "Unknown customer"}
                        </span>
                      </td>

                      <td>
                        <span className="contracts-type">
                          {contract.type}
                        </span>
                      </td>

                      <td>
                        <span className="contracts-date">
                          {formatDate(contract.startDate)}
                        </span>
                      </td>

                      <td>
                        <span className="contracts-date">
                          {formatDate(contract.endDate)}
                        </span>
                      </td>

                      <td>
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
                          {getLifecycleLabel(
                            lifecycleStatus,
                          )}
                        </Badge>
                      </td>

                      <td>
                        <div className="contract-row-actions">
                          <Link
                            href={`/contracts/${contract.id}`}
                            className="contract-icon-button"
                            aria-label={`View ${contract.contractNumber}`}
                            title="View contract"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                              <circle
                                cx="12"
                                cy="12"
                                r="2.5"
                              />
                            </svg>
                          </Link>

                          <Link
                            href={`/contracts/${contract.id}/edit`}
                            className="contract-icon-button"
                            aria-label={`Edit ${contract.contractNumber}`}
                            title="Edit contract"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                           
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}