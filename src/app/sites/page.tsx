
import SiteList from "@/modules/sites/SiteList";

export default function SitesPage() {
  return (
    <main
      className="content"
      style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}
    >
      <SiteList />
    </main>
  );
}

