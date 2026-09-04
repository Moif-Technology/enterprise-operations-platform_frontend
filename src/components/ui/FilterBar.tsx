import type { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
  action?: ReactNode;
}

export default function FilterBar({
  children,
  action,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-fields">
        {children}
      </div>

      {action && (
        <div className="filter-bar-action">
          {action}
        </div>
      )}
    </div>
  );
}