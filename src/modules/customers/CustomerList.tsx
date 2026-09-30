"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/design-system";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import SearchInput from "@/components/ui/SearchInput";
import { Badge, Panel } from "@/components/ui/design-system";

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
    <Button onClick={() => router.push("/customers/new")}>
      Create Customer
    </Button>
  }
/>

      <Panel title="Filters">
        <FilterBar>
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers, codes, or contacts..."
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as RecordStatus | "all")
            }
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </FilterBar>
      </Panel>

      <Panel title="Customers">
        {filteredCustomers.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="text-base font-semibold text-gray-900">
              No customers found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">
                    Primary Contact
                  </th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {customer.name}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {customer.id}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {customer.code}
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {customer.primaryContact}
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {customer.email || "—"}
                    </td>

                    <td className="px-4 py-4">
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

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          View
                        </Link>

                        <Link
                          href={`/customers/${customer.id}/edit`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}


