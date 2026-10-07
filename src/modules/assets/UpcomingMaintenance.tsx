"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/design-system";

import {
  getAssets,
  getMaintenancePlans,
} from "@/modules/assets/service";

type MaintenanceStatus = "overdue" | "due-soon" | "scheduled";

export default function UpcomingMaintenance() {
  const assets = useMemo(() => getAssets(), []);
  const plans = useMemo(() => getMaintenancePlans(), []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const getAsset = (assetId: string) =>
    assets.find((asset) => asset.id === assetId);

  const getMaintenanceStatus = (
    nextDueDate: string,
  ): MaintenanceStatus => {
    const dueDate = new Date(nextDueDate);
    dueDate.setHours(0, 0, 0, 0);

    const daysUntilDue =
      (dueDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysUntilDue < 0) {
      return "overdue";
    }

    if (daysUntilDue <= 7) {
      return "due-soon";
    }

    return "scheduled";
  };

  const upcomingPlans = useMemo(() => {
    const query = search.trim().toLowerCase();

    return plans
      .filter((plan) => plan.status === "active")
      .filter((plan) => {
        const dueDate = new Date(plan.nextDueDate);
        dueDate.setHours(0, 0, 0, 0);

        const daysUntilDue =
          (dueDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24);

        return daysUntilDue <= 30;
      })
      .filter((plan) => {
        const asset = getAsset(plan.assetId);

        if (!query) {
          return true;
        }

        return (
          plan.planName.toLowerCase().includes(query) ||
          plan.id.toLowerCase().includes(query) ||
          asset?.name.toLowerCase().includes(query) ||
          asset?.assetCode.toLowerCase().includes(query)
        );
      })
      .filter((plan) => {
        if (statusFilter === "all") {
          return true;
        }

        return getMaintenanceStatus(plan.nextDueDate) === statusFilter;
      })
      .filter((plan) => {
        if (frequencyFilter === "all") {
          return true;
        }

        return plan.frequency === frequencyFilter;
      })
      .sort(
        (a, b) =>
          new Date(a.nextDueDate).getTime() -
          new Date(b.nextDueDate).getTime(),
      );
  }, [
    plans,
    search,
    statusFilter,
    frequencyFilter,
    today,
    assets,
  ]);

  const totalOverdue = plans.filter((plan) => {
    if (plan.status !== "active") {
      return false;
    }

    return getMaintenanceStatus(plan.nextDueDate) === "overdue";
  }).length;

  const dueThisWeek = plans.filter((plan) => {
    if (plan.status !== "active") {
      return false;
    }

    return getMaintenanceStatus(plan.nextDueDate) === "due-soon";
  }).length;

  const upcomingThirtyDays = plans.filter((plan) => {
    if (plan.status !== "active") {
      return false;
    }

    const dueDate = new Date(plan.nextDueDate);
    dueDate.setHours(0, 0, 0, 0);

    const daysUntilDue =
      (dueDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    return daysUntilDue > 7 && daysUntilDue <= 30;
  }).length;

  return (
    <main className="upcoming-maintenance-page">
      <PageHeader
        title="Upcoming Maintenance"
        description="Track upcoming, due, and overdue preventive maintenance schedules."
      />

      <section className="upcoming-maintenance-stats">
        <div className="upcoming-maintenance-stat-card">
          <div>
            <p className="upcoming-maintenance-stat-label">
              Total Overdue
            </p>
            <p className="upcoming-maintenance-stat-value upcoming-maintenance-stat-overdue">
              {totalOverdue}
            </p>
          </div>

          <p className="upcoming-maintenance-stat-subtext">
            Requires immediate attention
          </p>
        </div>

        <div className="upcoming-maintenance-stat-card">
          <div>
            <p className="upcoming-maintenance-stat-label">
              Due This Week
            </p>
            <p className="upcoming-maintenance-stat-value upcoming-maintenance-stat-due">
              {dueThisWeek}
            </p>
          </div>

          <p className="upcoming-maintenance-stat-subtext">
            Scheduled next 7 days
          </p>
        </div>

        <div className="upcoming-maintenance-stat-card">
          <div>
            <p className="upcoming-maintenance-stat-label">
              Upcoming (30 Days)
            </p>
            <p className="upcoming-maintenance-stat-value upcoming-maintenance-stat-upcoming">
              {upcomingThirtyDays}
            </p>
          </div>

          <p className="upcoming-maintenance-stat-subtext">
            On schedule
          </p>
        </div>
      </section>

      <section className="upcoming-maintenance-filters">
        <div className="upcoming-maintenance-search">
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search maintenance tasks or assets..."
            aria-label="Search maintenance tasks or assets"
          />
        </div>

        <div className="upcoming-maintenance-filter-controls">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">Status: All</option>
            <option value="overdue">Overdue</option>
            <option value="due-soon">Due Soon</option>
            <option value="scheduled">Scheduled</option>
          </select>

          <select
            value={frequencyFilter}
            onChange={(event) => setFrequencyFilter(event.target.value)}
            aria-label="Filter by frequency"
          >
            <option value="all">Frequency: All</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="quarterly">Quarterly</option>
            <option value="bi-annually">Bi-Annually</option>
            <option value="annually">Annually</option>
          </select>
        </div>
      </section>

      <section className="upcoming-maintenance-table-card">
        {upcomingPlans.length === 0 ? (
          <div className="upcoming-maintenance-empty">
            <h3>No maintenance schedules found</h3>
            <p>
              Try changing your search or filter options.
            </p>
          </div>
        ) : (
          <div className="upcoming-maintenance-table-wrapper">
            <table className="upcoming-maintenance-table">
              <thead>
                <tr>
                  <th>Plan / Task</th>
                  <th>Target Asset</th>
                  <th>Frequency</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {upcomingPlans.map((plan) => {
                  const asset = getAsset(plan.assetId);
                  const status = getMaintenanceStatus(
                    plan.nextDueDate,
                  );

                  return (
                    <tr key={plan.id}>
                      <td>
                        <Link
                          href={`/maintenance-plans/${plan.id}`}
                          className="upcoming-maintenance-plan-title"
                        >
                          {plan.planName}
                        </Link>

                        <span className="upcoming-maintenance-plan-code">
                          {plan.id}
                        </span>
                      </td>

                      <td>
                        <div className="upcoming-maintenance-asset-name">
                          {asset?.name ?? "Unknown asset"}
                        </div>

                        <span className="upcoming-maintenance-asset-code">
                          {asset?.assetCode ?? plan.assetId}
                        </span>
                      </td>

                      <td>
                        <span className="upcoming-maintenance-frequency">
                          {formatFrequency(plan.frequency)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`upcoming-maintenance-due-date ${
                            status === "overdue"
                              ? "upcoming-maintenance-due-date-overdue"
                              : ""
                          }`}
                        >
                          {plan.nextDueDate}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`upcoming-maintenance-status upcoming-maintenance-status-${status}`}
                        >
                          {formatStatus(status)}
                        </span>
                      </td>

                      <td>
                        <Button size="sm" type="button">
                          Create Work Order
                        </Button>
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

function formatFrequency(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatStatus(status: MaintenanceStatus) {
  if (status === "due-soon") {
    return "Due Soon";
  }

  if (status === "overdue") {
    return "Overdue";
  }

  return "Scheduled";
}