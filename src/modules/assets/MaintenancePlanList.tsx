"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import { Badge, Button } from "@/components/ui/design-system";

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
  const [frequency, setFrequency] = useState<
    MaintenanceFrequency | "all"
  >("all");
  const [status, setStatus] = useState<
    MaintenancePlanStatus | "all"
  >("all");

  const plans = getMaintenancePlans();
  const assets = getAssets();

  const filteredPlans = useMemo(() => {
    const query = search.trim().toLowerCase();

    return plans.filter((plan) => {
      const asset = assets.find(
        (item) => item.id === plan.assetId,
      );

      const matchesSearch =
        !query ||
        plan.planName.toLowerCase().includes(query) ||
        asset?.name.toLowerCase().includes(query) ||
        asset?.assetCode.toLowerCase().includes(query);

      const matchesFrequency =
        frequency === "all" ||
        plan.frequency === frequency;

      const matchesStatus =
        status === "all" ||
        plan.status === status;

      return (
        matchesSearch &&
        matchesFrequency &&
        matchesStatus
      );
    });
  }, [plans, assets, search, frequency, status]);

  return (
    <div className="maintenance-plans-page">
      <PageHeader
        title="Maintenance Plans"
        description="Manage preventive maintenance schedules for registered assets."
        action={
          <Link
            href="/maintenance-plans/new"
            className="maintenance-plans-create-link"
          >
            <Button size="sm">
              <span aria-hidden="true"></span>
              Create Plan
            </Button>
          </Link>
        }
      />

      <section className="maintenance-plans-filter-card">
       

        <div className="maintenance-plans-filter-fields">
          <SearchInput
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search plans, assets, or asset codes..."
            className="maintenance-plans-search"
          />

          <select
            value={frequency}
            onChange={(event) =>
              setFrequency(
                event.target.value as
                  | MaintenanceFrequency
                  | "all",
              )
            }
            className="maintenance-plans-filter-select"
            aria-label="Filter maintenance plans by frequency"
          >
            <option value="all">All frequencies</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | MaintenancePlanStatus
                  | "all",
              )
            }
            className="maintenance-plans-filter-select"
            aria-label="Filter maintenance plans by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </section>

      <section className="maintenance-plans-table-card">
        {filteredPlans.length === 0 ? (
          <div className="maintenance-plans-empty-state">
            <h3>No maintenance plans found</h3>
            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="maintenance-plans-table-wrapper">
            <table className="maintenance-plans-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Asset</th>
                  <th>Frequency</th>
                  <th>Start Date</th>
                  <th>Next Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlans.map((plan) => {
                  const asset = assets.find(
                    (item) => item.id === plan.assetId,
                  );

                  return (
                    <tr key={plan.id}>
                      <td>
                        <div className="maintenance-plan-name">
                          {plan.planName}
                        </div>

                        <div className="maintenance-plan-code">
                          {plan.id}
                        </div>
                      </td>

                      <td>
                        {asset ? (
                          <Link
                            href={`/assets/${asset.id}`}
                            className="maintenance-plan-asset-link"
                          >
                            <span>
                              {asset.name}
                            </span>

                            <span className="maintenance-plan-asset-code">
                              {asset.assetCode}
                            </span>
                          </Link>
                        ) : (
                          <span className="maintenance-plan-unavailable">
                            Asset unavailable
                          </span>
                        )}
                      </td>

                      <td>
                        <span className="maintenance-plan-frequency">
                          {plan.frequency}
                        </span>
                      </td>

                      <td>
                        <span className="maintenance-plan-date">
                          {plan.startDate}
                        </span>
                      </td>

                      <td>
                        <span className="maintenance-plan-date">
                          {plan.nextDueDate}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`maintenance-plan-status maintenance-plan-status-${plan.status}`}
                        >
                          {plan.status}
                        </span>
                      </td>

                      <td>
                        <div className="maintenance-plan-actions">
                          <Link
                            href={`/maintenance-plans/${plan.id}`}
                            className="maintenance-plan-icon-button"
                            aria-label={`View ${plan.planName}`}
                            title="View maintenance plan"
                          >
                            <svg
                              width="17"
                              height="17"
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
                            href={`/maintenance-plans/${plan.id}/edit`}
                            className="maintenance-plan-icon-button"
                            aria-label={`Edit ${plan.planName}`}
                            title="Edit maintenance plan"
                          >
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                           
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1-1-4Z" />
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