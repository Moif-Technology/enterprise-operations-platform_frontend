"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import SearchInput from "@/components/ui/SearchInput";

import { Badge, Button, Panel } from "@/components/ui/design-system";

import {
  getAssets,
  getMaintenancePlans,
} from "@/modules/assets/service";

import type {
  MaintenanceFrequency,
  MaintenancePlanStatus,
} from "@/modules/assets/types";

export default function MaintenancePlanList() {
  const [search, setSearch] = useState("");
  const [frequency, setFrequency] = useState<MaintenanceFrequency | "all">(
    "all",
  );
  const [status, setStatus] = useState<MaintenancePlanStatus | "all">("all");

  const plans = getMaintenancePlans();
  const assets = getAssets();

  const filteredPlans = useMemo(() => {
    const query = search.trim().toLowerCase();

    return plans.filter((plan) => {
      const asset = assets.find((item) => item.id === plan.assetId);

      const matchesSearch =
        !query ||
        plan.planName.toLowerCase().includes(query) ||
        asset?.name.toLowerCase().includes(query) ||
        asset?.assetCode.toLowerCase().includes(query);

      const matchesFrequency =
        frequency === "all" || plan.frequency === frequency;

      const matchesStatus = status === "all" || plan.status === status;

      return matchesSearch && matchesFrequency && matchesStatus;
    });
  }, [plans, assets, search, frequency, status]);

  return (
    
  <div className="space-y-6">
    <PageHeader
  title="Maintenance Plans"
  description="Manage preventive maintenance schedules for registered assets."
  action={
    <Link href="/maintenance-plans/new" className="no-underline">
      <Button variant="primary">Create</Button>
    </Link>
  }
/>

    <Panel title="Filters">
        <FilterBar>
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search plans, assets, or asset codes..."
          />

          <select
            value={frequency}
            onChange={(event) =>
              setFrequency(
                event.target.value as MaintenanceFrequency | "all",
              )
            }
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
          >
            <option value="all">All frequencies</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as MaintenancePlanStatus | "all",
              )
            }
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </FilterBar>
      </Panel>

      <Panel title="Maintenance Plans">
        {filteredPlans.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="text-base font-semibold text-gray-900">
              No maintenance plans found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Asset</th>
                  <th className="px-4 py-3 font-medium">Frequency</th>
                  <th className="px-4 py-3 font-medium">Start Date</th>
                  <th className="px-4 py-3 font-medium">Next Due</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlans.map((plan) => {
                  const asset = assets.find(
                    (item) => item.id === plan.assetId,
                  );

                  return (
                    <tr
                      key={plan.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {plan.planName}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {plan.id}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {asset ? (
                          <Link
                            href={`/assets/${asset.id}`}
                            className="font-medium text-gray-900 hover:underline"
                          >
                            {asset.name}
                          </Link>
                        ) : (
                          <span className="text-gray-500">
                            Asset unavailable
                          </span>
                        )}

                        {asset && (
                          <div className="mt-1 text-xs text-gray-500">
                            {asset.assetCode}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 capitalize text-gray-700">
                        {plan.frequency}
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {plan.startDate}
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-900">
                        {plan.nextDueDate}
                      </td>

                      <td className="px-4 py-4">
                      <Badge tone={plan.status === "active" ? "success" : "neutral"}>
                          {plan.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
  <div className="flex items-center gap-3">
    <Link
      href={`/maintenance-plans/${plan.id}`}
      className="font-medium text-gray-900 hover:underline"
    >
      View
    </Link>

    <Link
      href={`/maintenance-plans/${plan.id}/edit`}
      className="font-medium text-gray-900 hover:underline"
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