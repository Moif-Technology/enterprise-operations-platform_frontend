
import SiteForm from "@/modules/sites/SiteForm";

export default function NewSitePage() {
  return (
    <main
      className="content"
      style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}
    >
      <SiteForm />
    </main>
  );
}

