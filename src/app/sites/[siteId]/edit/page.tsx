
import { notFound } from "next/navigation";

import SiteForm from "@/modules/sites/SiteForm";
import { getSiteById } from "@/modules/assets/service";

type EditSitePageProps = {
  params: Promise<{ siteId: string }>;
};

export default async function EditSitePage({
  params,
}: EditSitePageProps) {
  const { siteId } = await params;
  const site = getSiteById(siteId);

  if (!site) {
    notFound();
  }

  return (
    <main
      className="content"
      style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}
    >
      <SiteForm site={site} />
    </main>
  );
}
