import { notFound } from "next/navigation";

import AssetMaintenancePlanForm from "@/modules/assets/AssetMaintenancePlanForm";
import PMWorkOrderHandoff from "@/modules/assets/PMWorkOrderHandoff";

import { getMaintenancePlan } from "@/modules/assets/service";

type MaintenancePlanPageProps = {
  params: Promise<{
    planId: string;
  }>;
};

export default async function MaintenancePlanPage({
  params,
}: MaintenancePlanPageProps) {
  const { planId } = await params;
  const plan = getMaintenancePlan(planId);

  if (!plan) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AssetMaintenancePlanForm mode="view" plan={plan} />
      <PMWorkOrderHandoff plan={plan} />
    </div>
  );
}