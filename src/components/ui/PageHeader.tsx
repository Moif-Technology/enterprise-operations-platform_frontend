import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  secondaryAction,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}

        <h1>{title}</h1>

        <div className="page-header-bottom">
          {description && (
            <p className="page-header-description">{description}</p>
          )}

          {(action || secondaryAction) && (
            <div className="page-header-actions">
              {action}
              {secondaryAction}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}