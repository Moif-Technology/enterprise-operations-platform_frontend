import { notFound } from "next/navigation";

import ContractForm from "@/modules/contracts/ContractForm";
import { getContractById } from "@/modules/assets/service";

type EditContractPageProps = {
  params: Promise<{ contractId: string }>;
};

export default async function EditContractPage({
  params,
}: EditContractPageProps) {
  const { contractId } = await params;
  const contract = getContractById(contractId);

  if (!contract) {
    notFound();
  }

  return (
    <main
      className="content"
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <ContractForm contract={contract} />
    </main>
  );
}