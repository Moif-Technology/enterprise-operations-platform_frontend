import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Button } from "@/components/ui/design-system";
import PMWorkOrderHandoff from "@/modules/assets/PMWorkOrderHandoff";
import { getAssetById, getMaintenancePlan } from "@/modules/assets/service";

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

  const asset = getAssetById(plan.assetId);

  return (
    <main className="maintenance-plan-detail-page">
      <header className="maintenance-plan-detail-header">
        <div className="maintenance-plan-detail-header-content">
          <div className="maintenance-plan-detail-title-row">
            <h1>{plan.planName}</h1>

            <Badge tone="success">
              {plan.status}
            </Badge>

            <span className="maintenance-plan-detail-code">
              {plan.id}
            </span>
          </div>

          <p className="maintenance-plan-detail-subtitle">
            Asset: {asset?.name ?? "Unknown asset"} (
            {asset?.assetCode ?? plan.assetId}) | Frequency:{" "}
            {formatFrequency(plan.frequency)}
          </p>
        </div>

        <div className="maintenance-plan-detail-header-actions">
          <Button variant="secondary" type="button">
            Pause Schedule
          </Button>

          <Link href={`/maintenance-plans/${plan.id}/edit`}>
  <Button type="button">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
    Edit Plan
  </Button>
</Link>
        </div>
      </header>

      <div className="maintenance-plan-detail-dashboard">
        <div className="maintenance-plan-detail-main-column">
          <section className="maintenance-plan-detail-card">
            <div className="maintenance-plan-detail-card-header">
              <h2>Maintenance Checklist</h2>
            </div>

            {plan.checklist.length > 0 ? (
              <ul className="maintenance-plan-checklist">
                {plan.checklist.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <span
                      className="maintenance-plan-check-icon"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="maintenance-plan-detail-empty">
                No checklist items have been added to this plan.
              </p>
            )}
          </section>

          <PMWorkOrderHandoff plan={plan} />
        </div>

        <aside className="maintenance-plan-detail-sidebar">
          <section className="maintenance-plan-detail-card">
            <div className="maintenance-plan-detail-card-header">
              <h2>Schedule Details</h2>
            </div>

            <div className="maintenance-plan-detail-key-value-stack">
              <div>
                <span>Plan Code</span>
                <strong>{plan.id}</strong>
              </div>

              <div>
                <span>Frequency</span>
                <div className="maintenance-plan-detail-value-badge">
                  <Badge tone="neutral">
                    {formatFrequency(plan.frequency)}
                  </Badge>
                </div>
              </div>

              <div>
                <span>Start Date</span>
                <strong>{formatDate(plan.startDate)}</strong>
              </div>

              <div>
                <span>Next Due Date</span>
                <strong className="maintenance-plan-detail-due-date">
                  {formatDate(plan.nextDueDate)}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <div className="maintenance-plan-detail-value-badge">
                  <Badge tone={plan.status === "active" ? "success" : "neutral"}>
                    {plan.status}
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          <section className="maintenance-plan-detail-card">
            <div className="maintenance-plan-detail-card-header">
              <h2>Target Asset</h2>
            </div>

            <div className="maintenance-plan-detail-key-value-stack">
              <div>
                <span>Asset Name</span>

                {asset ? (
                  <Link
                    href={`/assets/${asset.id}`}
                    className="maintenance-plan-detail-value-link"
                  >
                    {asset.name}
                  </Link>
                ) : (
                  <strong>Unknown asset</strong>
                )}
              </div>

              <div>
                <span>Asset Code</span>
                <strong>{asset?.assetCode ?? plan.assetId}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{asset?.category ?? "—"}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function formatFrequency(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${month}/${day}/${year}`;
}