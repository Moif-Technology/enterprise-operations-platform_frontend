
interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}

        <h1>{title}</h1>

        {description && (
          <p className="page-header-description">{description}</p>
        )}
      </div>

      {action && <div className="page-header-action">{action}</div>}
    </header>
  );
}

