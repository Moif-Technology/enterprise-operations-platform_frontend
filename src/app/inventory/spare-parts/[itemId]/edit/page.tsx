import SparePartForm from "@/modules/inventory/SparePartForm";
import { getSparePartById } from "@/modules/inventory/service";

type EditSparePartPageProps = {
  params: Promise<{
    itemId: string;
  }>;
};

export default async function EditSparePartPage({
  params,
}: EditSparePartPageProps) {
  const { itemId } = await params;
  const item = getSparePartById(itemId);

  return <SparePartForm item={item} />;
}