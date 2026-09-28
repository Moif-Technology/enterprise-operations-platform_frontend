
import SiteDetail from "@/modules/sites/SiteDetail";

type SiteDetailPageProps = {
  params: Promise<{ siteId: string }>;
};

export default async function SiteDetailPage({
  params,
}: SiteDetailPageProps) {
  const { siteId } = await params;

  return <SiteDetail siteId={siteId} />;
}
