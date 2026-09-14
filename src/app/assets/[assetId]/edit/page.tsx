import { notFound } from "next/navigation";

import AssetForm from "@/modules/assets/AssetForm";
import { getAssetById } from "@/modules/assets/service";

type EditAssetPageProps = {
  params: Promise<{
    assetId: string;
  }>;
};

export default async function EditAssetPage({
  params,
}: EditAssetPageProps) {
  const { assetId } = await params;
  const asset = getAssetById(assetId);

  if (!asset) {
    notFound();
  }

  return <AssetForm mode="edit" asset={asset} />;
}