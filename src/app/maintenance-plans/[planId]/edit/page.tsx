import { notFound } from "next/navigation";

import AssetMaintenancePlanForm from "@/modules/assets/AssetMaintenancePlanForm";
import { getMaintenancePlan } from "@/modules/assets/service";

type EditMaintenancePlanPageProps = {
  params: Promise<{
    planId: string;
  }>;
};

export default async function EditMaintenancePlanPage({
  params,
}: EditMaintenancePlanPageProps) {
  const { planId } = await params;
  const plan = getMaintenancePlan(planId);

  if (!plan) {
    notFound();
  }

  return <AssetMaintenancePlanForm mode="edit" plan={plan} />;
}