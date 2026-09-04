import { Button } from "./design-system";

interface AssetPlaceholderProps {
  onExplore?: () => void;
}

export default function AssetPlaceholder({
  onExplore,
}: AssetPlaceholderProps) {
  return (
    <section className="asset-placeholder">
      <div className="asset-placeholder-content">
        <p className="eyebrow">Asset Management</p>

        <h2>Assets foundation is ready</h2>

        <p>
          The asset management module will be introduced in a future
          implementation. Shared UI patterns are ready to support it.
        </p>

        {onExplore && (
          <Button variant="secondary" onClick={onExplore}>
            Explore Foundation
          </Button>
        )}
      </div>

      <div className="asset-placeholder-status">
        <span className="asset-placeholder-dot" />
        <span>Module placeholder</span>
      </div>
    </section>
  );
}