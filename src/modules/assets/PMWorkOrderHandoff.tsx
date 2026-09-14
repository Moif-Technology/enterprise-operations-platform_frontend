"use client";

import { useMemo, useState } from "react";

import { Badge, Button, Panel } from "@/components/ui/design-system";
import {
  completeMockWorkOrder,
  getMockWorkOrdersByPlanId,
} from "@/modules/assets/service";
import type { MaintenancePlan } from "@/modules/assets/types";

type PMWorkOrderHandoffProps = {
  plan: MaintenancePlan;
};

export default function PMWorkOrderHandoff({
  plan,
}: PMWorkOrderHandoffProps) {
  const [handedOff, setHandedOff] = useState(false);
  const [completed, setCompleted] = useState(false);


  const workOrder = useMemo(
    () => getMockWorkOrdersByPlanId(plan.id)[0],
    [plan.id],
  );

  if (!workOrder) {
    return (
      <Panel
        title="PM Work Order Handoff"
        description="Create a mock work-order handoff from this maintenance plan."
      >
        <p className="text-sm text-slate-500">
          No mock work order is linked to this maintenance plan yet.
        </p>
      </Panel>
    );
  }

  return (
    <Panel
      title="PM Work Order Handoff"
      description="Mock handoff from preventive maintenance to the work-order workflow."
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Work Order
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {workOrder.reference}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">
              Scheduled Date
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {workOrder.scheduledDate}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">Status</p>
            <div className="mt-1">
              <Badge tone="neutral">{workOrder.status}</Badge>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-900">
            {workOrder.title}
          </p>

          {workOrder.notes && (
            <p className="mt-1 text-sm text-slate-500">
              {workOrder.notes}
            </p>
          )}
        </div>

        {handedOff && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            PM work order completed successfully. Service history and next due date updated.
          </div>
        )}

        {workOrder.status !== "completed" && (
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => {
                setHandedOff(true);
              
                if (workOrder.status !== "completed") {
                  completeMockWorkOrder(
                    workOrder.id,
                    new Date().toISOString().slice(0, 10),
                  );
                  setCompleted(true);
                }
              }}
            >
              {handedOff ? "Handoff Complete" : "Hand Off to Work Order"}
            </Button>
          </div>
        )}
      </div>
    </Panel>
  );
}