"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/design-system";

import { getSites } from "@/modules/assets/service";
import { getStockLocations } from "@/modules/inventory/service";

import type { StockLocation } from "@/modules/inventory/types";
import type { Site } from "@/modules/assets/types";

export default function StockLocationList() {
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setLocations(getStockLocations());
    setSites(getSites());
  }, []);

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return locations.filter((location) => {
      const site = location.siteId
        ? sites.find((item) => item.id === location.siteId)
        : undefined;

      const matchesSearch =
        !query ||
        location.name.toLowerCase().includes(query) ||
        location.code.toLowerCase().includes(query) ||
        (location.technicianName ?? "").toLowerCase().includes(query) ||
        (site?.name ?? "").toLowerCase().includes(query);

      const matchesType = !type || location.type === type;
      const matchesStatus = !status || location.status === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [locations, sites, search, type, status]);

  return (
    <div className="stock-locations-page">
      <PageHeader
        eyebrow="Inventory"
        title="Stock Locations"
        description="Manage warehouses and technician stock locations."
        action={
          <Link href="/inventory/stock-locations/new">
            <Button>
              <span aria-hidden="true">+</span>
              Create Stock Location
            </Button>
          </Link>
        }
        secondaryAction={
          <button
            type="button"
            className="asset-refresh-button"
            onClick={() => window.location.reload()}
            aria-label="Refresh stock locations"
            title="Refresh stock locations"
          >
            ↻
          </button>
        }
      />

      <section className="stock-locations-filters">
        

        <div className="stock-locations-filter-controls">
          <div className="stock-locations-search">
            <svg
              aria-hidden="true"
              className="stock-locations-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, code, site, or technician..."
              aria-label="Search stock locations"
            />
          </div>

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="stock-locations-filter-select"
            aria-label="Filter by type"
          >
            <option value="">All Types</option>
            <option value="warehouse">Warehouse</option>
            <option value="technician">Technician</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="stock-locations-filter-select"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </section>

      <section className="stock-locations-table-card">
        <div className="stock-locations-table-wrapper">
          {filteredLocations.length === 0 ? (
            <div className="stock-locations-empty">
              No stock locations match the current filters.
            </div>
          ) : (
            <table className="stock-locations-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Site / Technician</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLocations.map((location) => {
                  const site = location.siteId
                    ? sites.find((item) => item.id === location.siteId)
                    : undefined;

                  return (
                    <tr key={location.id}>
                      <td>
                        <Link
                          href={`/inventory/stock-locations/${location.id}`}
                          className="stock-location-name"
                        >
                          {location.name}
                        </Link>
                      </td>

                      <td>
                        <span className="stock-location-code">
                          {location.code}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            location.type === "warehouse"
                              ? "stock-location-type stock-location-type-warehouse"
                              : "stock-location-type stock-location-type-technician"
                          }
                        >
                          {location.type === "warehouse"
                            ? "Warehouse"
                            : "Technician"}
                        </span>
                      </td>

                      <td>
                        <span className="stock-location-site">
                          {location.type === "warehouse"
                            ? site?.name ?? "—"
                            : location.technicianName ?? "—"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            location.status === "active"
                              ? "stock-location-status stock-location-status-active"
                              : "stock-location-status stock-location-status-inactive"
                          }
                        >
                          {location.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="stock-location-actions">
                          <Link
                            href={`/inventory/stock-locations/${location.id}`}
                            className="stock-location-action"
                            aria-label={`View ${location.name}`}
                            title="View"
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                              <circle cx="12" cy="12" r="2.5" />
                            </svg>
                          </Link>

                          <Link
                            href={`/inventory/stock-locations/${location.id}/edit`}
                            className="stock-location-action"
                            aria-label={`Edit ${location.name}`}
                            title="Edit"
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
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
          )}
        </div>
      </section>
    </div>
  );
}