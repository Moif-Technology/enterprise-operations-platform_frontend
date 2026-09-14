"use client";

import { useMemo } from "react";

import PageHeader from "@/components/ui/PageHeader";
import { Badge, Panel } from "@/components/ui/design-system";
import { EmptyState } from "@/components/ui/States";
import { getAssets, getMaintenancePlans } from "@/modules/assets/service";

export default function UpcomingMaintenance() {
  const assets = useMemo(() => getAssets(), []);
  const plans = useMemo(() => getMaintenancePlans(), []);

  const upcomingPlans = useMemo(() => {
    const today = new Date();

    return plans
      .filter((plan) => plan.status === "active")
      .filter((plan) => {
        const dueDate = new Date(plan.nextDueDate);
        const daysUntilDue =
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      
        return daysUntilDue <= 30;
      })
      .sort(
        (a, b) =>
          new Date(a.nextDueDate).getTime() -
          new Date(b.nextDueDate).getTime(),
      );
  }, [plans]);

  const getAssetName = (assetId: string) => {
    return (
      assets.find((asset) => asset.id === assetId)?.name ?? "Unknown asset"
    );
  };

  return (
    <main className="space-y-6">
      <PageHeader
        title="Upcoming Maintenance"
        description="Track upcoming and overdue maintenance plans."
      />

      <Panel title="Upcoming Maintenance">
        {upcomingPlans.length === 0 ? (
         <EmptyState
         title="No maintenance due"
         description="There are no upcoming or overdue maintenance plans to display."
       />
        ) : (
          <div className="space-y-3">
            {upcomingPlans.map((plan) => (
              <div
                key={plan.id}
             className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {plan.planName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {getAssetName(plan.assetId)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Frequency: {plan.frequency}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {plan.nextDueDate}
                  </p>

                  <Badge tone={new Date(plan.nextDueDate) < new Date() ? "danger" : "neutral"}>
  {new Date(plan.nextDueDate) < new Date() ? "Overdue" : "Upcoming"}
</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </main>
  );
}