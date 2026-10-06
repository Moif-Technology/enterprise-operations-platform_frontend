"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import SearchInput from "@/components/ui/SearchInput";
import { Badge, Button } from "@/components/ui/design-system";

import { getCustomers } from "@/modules/assets/service";
import type { RecordStatus } from "@/modules/assets/types";

export default function CustomerList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RecordStatus | "all">("all");

  const customers = getCustomers();

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.code.toLowerCase().includes(query) ||
        customer.primaryContact.toLowerCase().includes(query);

      const matchesStatus =
        status === "all" || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, status]);

  return (
    <div className="space-y-6">
   <PageHeader
  title="Customers"
  description="Manage customers and their service relationships."
  action={
    <Button
    size="sm"
    onClick={() => router.push("/customers/new")}
  >
    <span aria-hidden="true"></span>
    Create Customer
  </Button>
  }
/>

<FilterBar>
  <SearchInput
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    placeholder="Search customer name, code, or contact..."
    className="customers-search"
  />

  <select
    value={status}
    onChange={(event) =>
      setStatus(event.target.value as RecordStatus | "all")
    }
    className="customers-status-filter"
    aria-label="Filter customers by status"
  >
    <option value="all">All statuses</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</FilterBar>

<div className="customers-table">
  {filteredCustomers.length === 0 ? (
    <div className="customers-empty-state">
      <h3>No customers found</h3>
      <p>Try changing your search or filters.</p>
    </div>
  ) : (
    <div className="customers-table-wrapper">
      <table>
        <thead>
          <tr>
            <th>CUSTOMER</th>
            <th>CODE</th>
            <th>PRIMARY CONTACT</th>
            <th>EMAIL</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div className="customers-name">
                  {customer.name}
                </div>
                <div className="customers-id">
                  {customer.id}
                </div>
              </td>

              <td>
                <span className="customers-code">
                  {customer.code}
                </span>
              </td>

              <td>{customer.primaryContact || "—"}</td>

              <td>{customer.email || "—"}</td>

              <td>
                <Badge
                  tone={
                    customer.status === "active"
                      ? "success"
                      : "neutral"
                  }
                >
                  {customer.status}
                </Badge>
              </td>

              <td>
                <div className="customer-row-actions">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="customer-icon-button"
                    aria-label={`View ${customer.name}`}
                    title="View customer"
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
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  </Link>

                  <Link
                    href={`/customers/${customer.id}/edit`}
                    className="customer-icon-button"
                    aria-label={`Edit ${customer.name}`}
                    title="Edit customer"
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
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
    </div>
  );
}


