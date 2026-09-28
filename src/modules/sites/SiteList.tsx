
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import { Badge, Button, Panel } from "@/components/ui/design-system";
import {
  getCustomers,
  getSites,
} from "@/modules/assets/service";
import type { Customer, Site } from "@/modules/assets/types";

export default function SiteList() {
  const [sites, setSites] = useState<Site[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setSites(getSites());
    setCustomers(getCustomers());
  }, []);

  const filteredSites = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sites.filter((site) => {
      const customer = customers.find(
        (item) => item.id === site.customerId
      );

      const matchesSearch =
        !query ||
        site.name.toLowerCase().includes(query) ||
        site.code.toLowerCase().includes(query) ||
        site.address.toLowerCase().includes(query);

      const matchesCustomer =
        !customerId || site.customerId === customerId;

      const matchesStatus =
        !status || site.status === status;

      return (
        matchesSearch &&
        matchesCustomer &&
        matchesStatus &&
        Boolean(customer)
      );
    });
  }, [sites, customers, search, customerId, status]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sites"
        description="Manage customer sites and locations."
        action={
          <Link href="/sites/new">
            <Button>Create Site</Button>
          </Link>
        }
      />

      <Panel
        title="Filters"
        description="Search and filter sites."
      >
        <div className="grid gap-4 md:grid-cols-3">
        <SearchInput
  value={search}
  onChange={(event) => setSearch(event.target.value)}
  placeholder="Search by site name, code, or address..."
/>
          <select
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
            className="input"
          >
            <option value="">All Customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="input"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Panel>

      <Panel
        title="Sites"
        description={`${filteredSites.length} site${
          filteredSites.length === 1 ? "" : "s"
        } found.`}
      >
        {filteredSites.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No sites match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Site
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Code
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Customer
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Address
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Status
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSites.map((site) => {
                  const customer = customers.find(
                    (item) => item.id === site.customerId
                  );

                  return (
                    <tr
                      key={site.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-3 py-3 font-medium text-slate-900">
                        {site.name}
                      </td>

                      <td className="px-3 py-3 text-slate-600">
                        {site.code}
                      </td>

                      <td className="px-3 py-3 text-slate-600">
                        {customer?.name || "—"}
                      </td>

                      <td className="px-3 py-3 text-slate-600">
                        {site.address}
                      </td>

                      <td className="px-3 py-3">
                        <Badge
                          tone={
                            site.status === "active"
                              ? "success"
                              : "neutral"
                          }
                        >
                          {site.status}
                        </Badge>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex gap-3">
                          <Link
                            href={`/sites/${site.id}`}
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            View
                          </Link>

                          <Link
                            href={`/sites/${site.id}/edit`}
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            Edit
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
      </Panel>
    </div>
  );
}

