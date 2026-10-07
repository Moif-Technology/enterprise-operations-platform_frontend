"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/design-system";
import {
  getMockWorkOrdersByPlanId,
} from "@/modules/assets/service";
import type { MaintenancePlan } from "@/modules/assets/types";

type PMWorkOrderHandoffProps = {
  plan: MaintenancePlan;
};

export default function PMWorkOrderHandoff({
  plan,
}: PMWorkOrderHandoffProps) {
  const workOrder = useMemo(
    () => getMockWorkOrdersByPlanId(plan.id)[0],
    [plan.id],
  );

  return (
    <section className="maintenance-plan-detail-card">
      <div className="maintenance-plan-detail-card-header">
        <h2>PM Work Order Handoff</h2>
        <p className="maintenance-plan-handoff-description">
          Recent work orders generated from this preventive maintenance
          schedule.
        </p>
      </div>

      {!workOrder ? (
        <p className="maintenance-plan-detail-empty">
          No work order has been generated from this maintenance plan yet.
        </p>
      ) : (
        <div className="maintenance-plan-work-order-table-wrapper">
          <table className="maintenance-plan-work-order-table">
            <thead>
              <tr>
                <th>WO Number</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <span className="maintenance-plan-work-order-number">
                    {workOrder.reference}
                  </span>
                </td>

                <td>
                  <span className="maintenance-plan-work-order-date">
                    {workOrder.scheduledDate}
                  </span>
                </td>

                <td>
                  <Badge
                    tone={
                      workOrder.status === "completed"
                        ? "info"
                        : "neutral"
                    }
                  >
                    {workOrder.status}
                  </Badge>
                </td>

                <td>
                  <span className="maintenance-plan-work-order-notes">
                    {workOrder.notes || workOrder.title}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}