type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

export function Button({
  children,
  variant = "primary"
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return <button className={`btn btn-${variant}`} type="button">{children}</button>;
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: BadgeTone }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function EmptyState() {
  return (
    <div className="state-box">
      <p className="state-title">No records yet</p>
      <p className="state-copy">Create the first record to start this workflow.</p>
      <Button>Create Record</Button>
    </div>
  );
}

export function StatusRow() {
  return (
    <div className="status-row">
      <Badge tone="info">New</Badge>
      <Badge tone="warning">SLA Risk</Badge>
      <Badge tone="success">Completed</Badge>
      <Badge tone="danger">Breached</Badge>
    </div>
  );
}
