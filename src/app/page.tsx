import { modules, workflowSteps } from "../modules/module-map";
import { DesignSystemPreview } from "../modules/design-system/design-system-preview";

export default function HomePage() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Enterprise Ops</p>
          <h1>Operations Platform</h1>
        </div>
        <nav aria-label="Main navigation">
          {modules.map((module) => (
            <a key={module.name} href={`#${module.slug}`}>
              {module.name}
            </a>
          ))}
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">MVP workspace</p>
            <h2>Facility and field service command center</h2>
          </div>
          <button type="button">New Request</button>
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
    </main>
  );
}
