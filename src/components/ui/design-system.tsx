
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type BadgeTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  form?: string;    
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  form,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={loading}
      form={form}
      >
      {loading ? "Loading..." : children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}


interface PanelProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function Panel({
  title,
  description,
  action,
  children,
}: PanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-heading">
          <h3>{title}</h3>

          {description && (
            <p className="panel-description">{description}</p>
          )}
        </div>

        {action && <div className="panel-action">{action}</div>}
      </div>

      <div className="panel-content">{children}</div>
    </section>
  );
}



export function EmptyState() {
  return (
    <div className="state-box">
      <p className="state-title">No records yet</p>

      <p className="state-copy">
        Create the first record to start this workflow.
      </p>

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

