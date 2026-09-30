import { modules, workflowSteps } from "../modules/module-map";
import { DesignSystemPreview } from "../modules/design-system/design-system-preview";

export default function HomePage() {
  return (
    <section className="content">
      <header className="topbar">
        <div>
          <p className="eyebrow">MVP workspace</p>
          <h2>Facility and field service command center</h2>
        </div>
        <button type="button" className="btn btn-primary btn-md">
  New Request
</button>
      </header>

      <section className="workflow" aria-label="Core workflow">
        {workflowSteps.map((step, index) => (
          <span key={step}>
            {index + 1}. {step}
          </span>
        ))}
      </section>

      <section className="module-grid">
        {modules.map((module) => (
          <article id={module.slug} key={module.name} className="module-card">
            <div>
              <p className="eyebrow">{module.area}</p>
              <h3>{module.name}</h3>
            </div>
            <p>{module.purpose}</p>
            <ul>
              {module.pages.map((page) => (
                <li key={page}>{page}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <DesignSystemPreview />
    </section>
  );
}