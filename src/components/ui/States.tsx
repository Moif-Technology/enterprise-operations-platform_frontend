import { Button } from "./design-system";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No records yet",
  description = "There are no records to display.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="state-box">
      <p className="state-title">{title}</p>

      <p className="state-copy">{description}</p>

      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="state-box state-loading" role="status">
      <div className="loading-spinner" aria-hidden="true" />
      <p className="state-title">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information. Please try again.",
  actionLabel = "Try Again",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state-box state-error" role="alert">
      <p className="state-title">{title}</p>

      <p className="state-copy">{message}</p>

      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface SuccessStateProps {
  title?: string;
  message?: string;
}

export function SuccessState({
  title = "Success",
  message = "The operation was completed successfully.",
}: SuccessStateProps) {
  return (
    <div className="state-box state-success" role="status">
      <p className="state-title">{title}</p>

      <p className="state-copy">{message}</p>
    </div>
  );
}