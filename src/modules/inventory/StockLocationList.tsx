"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import { Badge, Button, Panel } from "@/components/ui/design-system";
import { getSites } from "@/modules/assets/service";
import {
  getStockLocations,
} from "@/modules/inventory/service";
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
    <div className="space-y-6">
      <PageHeader
        title="Stock Locations"
        description="Manage warehouses and technician stock locations."
        action={
          <Link href="/inventory/stock-locations/new">
            <Button>Create Stock Location</Button>
          </Link>
        }
      />

      <Panel
        title="Filters"
        description="Search and filter stock locations."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, code, site, or technician..."
          />

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="input"
          >
            <option value="">All Types</option>
            <option value="warehouse">Warehouse</option>
            <option value="technician">Technician</option>
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
        title="Stock Locations"
        description={`${filteredLocations.length} location${
          filteredLocations.length === 1 ? "" : "s"
        } found.`}
      >
        {filteredLocations.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No stock locations match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Location
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Code
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Type
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Site / Technician
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
                {filteredLocations.map((location) => {
                  const site = location.siteId
                    ? sites.find((item) => item.id === location.siteId)
                    : undefined;

                  return (
                    <tr
                      key={location.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-3 py-3 font-medium text-slate-900">
                        {location.name}
                      </td>

                      <td className="px-3 py-3 text-slate-600">
                        {location.code}
                      </td>

                      <td className="px-3 py-3 text-slate-600">
                        {location.type === "warehouse"
                          ? "Warehouse"
                          : "Technician"}
                      </td>

                      <td className="px-3 py-3 text-slate-600">
                        {location.type === "warehouse"
                          ? site?.name ?? "—"
                          : location.technicianName ?? "—"}
                      </td>

                      <td className="px-3 py-3">
                        <Badge
                          tone={
                            location.status === "active"
                              ? "success"
                              : "neutral"
                          }
                        >
                          {location.status}
                        </Badge>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex gap-3">
                          <Link
                            href={`/inventory/stock-locations/${location.id}`}
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            View
                          </Link>

                          <Link
                            href={`/inventory/stock-locations/${location.id}/edit`}
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