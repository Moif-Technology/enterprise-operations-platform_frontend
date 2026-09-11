import {
  Badge,
  Button,
  Panel,
} from "../../components/ui/design-system";
import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import SearchInput from "../../components/ui/SearchInput";
import FilterBar from "../../components/ui/FilterBar";
import {
  EmptyState,
  LoadingState,
  ErrorState,
  SuccessState,
} from "../../components/ui/States";
import AISuggestionPanel from "../../components/ui/AISuggestionPanel";
import AssetPlaceholder from "../../components/ui/AssetPlaceholder";

const tokens = [
  ["Background", "#f6f7f9"],
  ["Panel", "#ffffff"],
  ["Ink", "#162033"],
  ["Muted", "#647086"],
  ["Line", "#dfe4ea"],
  ["Primary", "#0f766e"],
  ["Warning", "#b45309"],
  ["Danger", "#b91c1c"],
];

const tableRows = [
  ["SR-1024", "AC not cooling", "High", "SLA Risk"],
  ["WO-8841", "Generator inspection", "Medium", "Scheduled"],
  ["PM-2103", "Quarterly maintenance", "Low", "New"],
];

export function DesignSystemPreview() {
  return (
    <section className="design-system" id="design-system">
      <PageHeader
        eyebrow="Module 01"
        title="Design system foundation"
        description="Reusable UI patterns for all frontend modules: clear actions, readable data, practical forms, consistent states, and operational AI suggestions."
        action={
          <Button size="sm">
            Primary Action
          </Button>
        }
      />

      <div className="system-grid">
        <Panel
          title="Button system"
          description="Use one clear primary action with supporting secondary, danger, and ghost variants."
        >
          <div className="button-row">
            <Button>Primary</Button>

            <Button variant="secondary">
              Secondary
            </Button>

            <Button variant="danger">
              Danger
            </Button>

            <Button variant="ghost">
              Ghost
            </Button>
          </div>

          <div className="button-row">
            <Button size="sm">
              Small
            </Button>

            <Button size="md">
              Medium
            </Button>

            <Button size="lg">
              Large
            </Button>

            <Button loading>
              Loading
            </Button>
          </div>
        </Panel>

        <Panel
          title="Status badges"
          description="Consistent status language across operational workflows."
        >
          <div className="status-row">
            <Badge tone="neutral">
              New
            </Badge>

            <Badge tone="info">
              Assigned
            </Badge>

            <Badge tone="warning">
              SLA Risk
            </Badge>

            <Badge tone="success">
              Completed
            </Badge>

            <Badge tone="danger">
              SLA Breached
            </Badge>
          </div>
        </Panel>

        <Panel
          title="Color tokens"
          description="Shared visual tokens keep every module aligned."
        >
          <div className="token-grid">
            {tokens.map(([label, color]) => (
              <div
                className="token"
                key={label}
              >
                <span
                  style={{
                    backgroundColor: color,
                    border:
                      label === "Panel"
                        ? "1px solid #dfe4ea"
                        : undefined,
                  }}
                />

                <div>
                  <strong>{label}</strong>
                  <small>{color}</small>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Panel and card pattern"
          description="A simple container for grouped operational information."
          action={
            <Button
              variant="secondary"
              size="sm"
            >
              View All
            </Button>
          }
        >
          <div className="preview-copy">
            <strong>Operational summary</strong>

            <p>
              Panels provide a consistent surface for forms,
              lists, summaries, and workflow information.
            </p>
          </div>
        </Panel>

        <Panel
          title="Search and filter pattern"
          description="Reusable controls for finding and narrowing operational records."
        >
          <FilterBar
            action={
              <Button size="sm">
                Apply Filters
              </Button>
            }
          >
            <SearchInput
              label="Search"
              placeholder="Search requests..."
              aria-label="Search requests"
            />

            <FormField
              label="Priority"
              name="preview-priority"
              type="select"
            >
              <option value="all">
                All priorities
              </option>

              <option value="high">
                High
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="low">
                Low
              </option>
            </FormField>

            <FormField
              label="Status"
              name="preview-status"
              type="select"
            >
              <option value="all">
                All statuses
              </option>

              <option value="new">
                New
              </option>

              <option value="scheduled">
                Scheduled
              </option>

              <option value="completed">
                Completed
              </option>
            </FormField>
          </FilterBar>
        </Panel>

        <Panel
          title="Form field pattern"
          description="Short, practical fields with consistent labels, helper text, and validation."
        >
          <div className="form-preview">
            <FormField
              label="Request title"
              name="request-title"
              required
              placeholder="Example: AC not cooling"
              helperText="Keep the title short and specific."
            />

            <FormField
              label="Priority"
              name="request-priority"
              type="select"
              required
            >
              <option value="">
                Select priority
              </option>

              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>

              <option value="emergency">
                Emergency
              </option>
            </FormField>

            <FormField
              label="Operational notes"
              name="request-notes"
              type="textarea"
              placeholder="Add short operational notes"
            />

            <FormField
              label="Example validation"
              name="validation-example"
              required
              error="This field is required."
              placeholder="Enter a value"
            />
          </div>
        </Panel>

        <Panel
          title="Table and list pattern"
          description="Dense, readable operational data without unnecessary decoration."
        >
          <div className="table-shell">
            <div className="table-head">
              <span>Reference</span>
              <span>Work</span>
              <span>Priority</span>
              <span>Status</span>
            </div>

            {tableRows.map((row) => (
              <div
                className="table-row"
                key={row[0]}
              >
                {row.map((cell) => (
                  <span key={`${row[0]}-${cell}`}>
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Panel>

        <Panel
  title="Empty state"
  description="Use when a valid screen has no records to display."
>
  <EmptyState
    title="No service requests"
    description="There are no requests matching the current filters."
  />
</Panel>

        <Panel
          title="Loading state"
          description="Use while content is being retrieved or prepared."
        >
          <LoadingState message="Loading operational records..." />
        </Panel>

        <Panel
          title="Error state"
          description="Give users a clear explanation and a recovery action."
        >
          <ErrorState
            title="Unable to load requests"
            message="The sample request data could not be loaded."
          />
        </Panel>

        <Panel
          title="Success state"
          description="Confirm completed actions without unnecessary interruption."
        >
          <SuccessState
            title="Request created"
            message="The sample service request was created successfully."
          />
        </Panel>

        <Panel
          title="AI suggestion pattern"
          description="AI should provide useful suggestions that users can review or apply."
        >
          <AISuggestionPanel
            title="Suggested priority"
            suggestion="Set this request to High because the issue affects customer operations and may have SLA impact."
            confidence="High confidence"
            action={
              <div className="button-row">
                <Button>
                  Apply Suggestion
                </Button>

                <Button variant="secondary">
                  Review
                </Button>
              </div>
            }
          />
        </Panel>

        <Panel
  title="Asset placeholder"
  description="Foundation placeholder only. No asset-management business logic is included in Module 01."
>
  <AssetPlaceholder />
</Panel>
      </div>
    </section>
  );
}