
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
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <SiteForm site={site} />
    </main>
  );
}
