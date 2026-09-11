import type { ReactNode } from "react";

interface AISuggestionPanelProps {
  title?: string;
  suggestion: string;
  confidence?: string;
  action?: ReactNode;
}

export default function AISuggestionPanel({
  title = "AI Suggestion",
  suggestion,
  confidence,
  action,
}: AISuggestionPanelProps) {
  return (
    <section className="ai-suggestion-panel">
      <div className="ai-suggestion-header">
        <div>
          <p className="ai-suggestion-label">AI ASSIST</p>
          <h3>{title}</h3>
        </div>

        {confidence && (
          <span className="ai-suggestion-confidence">
            {confidence}
          </span>
        )}
      </div>

      <p className="ai-suggestion-text">{suggestion}</p>

      {action && (
        <div className="ai-suggestion-action">
          {action}
        </div>
      )}
    </section>
  );
}