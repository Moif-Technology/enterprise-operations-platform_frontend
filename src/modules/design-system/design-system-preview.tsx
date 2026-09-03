import { Badge, Button, EmptyState, Panel, StatusRow } from "../../components/ui/design-system";

const tokens = [
  ["Primary", "#0f766e"],
  ["Ink", "#162033"],
  ["Muted", "#647086"],
  ["Line", "#dfe4ea"],
  ["Warning", "#b45309"],
  ["Danger", "#b91c1c"]
];

const tableRows = [
  ["SR-1024", "AC not cooling", "High", "SLA risk"],
  ["WO-8841", "Generator inspection", "Medium", "Scheduled"],
  ["PM-2103", "Quarterly maintenance", "Low", "Upcoming"]
];

export function DesignSystemPreview() {
  return (
    <section className="design-system" id="design-system">
      <div className="section-heading">
        <p className="eyebrow">Module 01</p>
        <h2>Design system foundation</h2>
        <p>
          A calm operational UI baseline for all modules: simple actions, readable data, clear statuses,
          and reusable page patterns.
        </p>
      </div>

      <div className="system-grid">
        <Panel title="Core actions">
          <div className="button-row">
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
          </div>
          <StatusRow />
        </Panel>

        <Panel title="Color tokens">
          <div className="token-grid">
            {tokens.map(([label, color]) => (
              <div className="token" key={label}>
                <span style={{ backgroundColor: color }} />
                <div>
                  <strong>{label}</strong>
                  <small>{color}</small>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="List pattern">
          <div className="table-shell">
            <div className="table-head">
              <span>Reference</span>
              <span>Work</span>
              <span>Priority</span>
              <span>Status</span>
            </div>
            {tableRows.map((row) => (
              <div className="table-row" key={row[0]}>
                {row.map((cell) => (
                  <span key={cell}>{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Form pattern">
          <form className="form-preview">
            <label>
              Request title
              <input placeholder="Example: AC not cooling" />
            </label>
            <label>
              Priority
              <select defaultValue="high">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </label>
            <label>
              Notes
              <textarea placeholder="Add short operational notes" />
            </label>
          </form>
        </Panel>

        <Panel title="Empty state">
          <EmptyState />
        </Panel>

        <Panel title="AI suggestion pattern">
          <div className="ai-panel">
            <Badge tone="info">AI suggestion</Badge>
            <p>Suggested priority: High because the request affects customer operations and has SLA impact.</p>
            <div className="button-row">
              <Button>Apply</Button>
              <Button variant="secondary">Review</Button>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}
