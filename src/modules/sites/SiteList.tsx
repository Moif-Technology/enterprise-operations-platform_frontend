"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import { Badge, Button } from "@/components/ui/design-system";

import { getCustomers, getSites } from "@/modules/assets/service";
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
        (item) => item.id === site.customerId,
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
    <div className="sites-page">
    <PageHeader
  title="Sites"
  description="Manage customer sites and locations."
  action={
    <Link href="/sites/new">
      <Button size="sm">Create Site</Button>
    </Link>
  }
  secondaryAction={
    <button
      type="button"
      className="asset-refresh-button"
      onClick={() => window.location.reload()}
      aria-label="Refresh sites"
      title="Refresh sites"
    >
      ↻
    </button>
  }
/>

      <section className="sites-filter-card">
        

        <div className="sites-filter-fields">
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by site name, code, or address..."
            className="sites-search"
          />

          <select
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
            className="sites-filter-select"
            aria-label="Filter sites by customer"
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
            className="sites-filter-select"
            aria-label="Filter sites by status"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </section>

      <section className="sites-table-card">
        {filteredSites.length === 0 ? (
          <div className="sites-empty-state">
            <h3>No sites found</h3>
            <p>No sites match the current filters.</p>
          </div>
        ) : (
          <div className="sites-table-wrapper">
            <table className="sites-table">
              <thead>
                <tr>
                  <th>SITE</th>
                  <th>CODE</th>
                  <th>CUSTOMER</th>
                  <th>ADDRESS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredSites.map((site) => {
                  const customer = customers.find(
                    (item) => item.id === site.customerId,
                  );

                  return (
                    <tr key={site.id}>
                      <td>
                        <span className="sites-name">
                          {site.name}
                        </span>
                      </td>

                      <td>
                        <span className="sites-code">
                          {site.code}
                        </span>
                      </td>

                      <td>
                        <span className="sites-customer">
                          {customer?.name || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="sites-address">
                          {site.address || "—"}
                        </span>
                      </td>

                      <td>
                        <Badge
                          tone={
                            site.status === "active"
                              ? "success"
                              : "neutral"
                          }
                        >
                          {site.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </td>

                      <td>
                        <div className="site-row-actions">
                          <Link
                            href={`/sites/${site.id}`}
                            className="site-icon-button"
                            aria-label={`View ${site.name}`}
                            title="View site"
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
                            href={`/sites/${site.id}/edit`}
                            className="site-icon-button"
                            aria-label={`Edit ${site.name}`}
                            title="Edit site"
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
    </div>
  );
}