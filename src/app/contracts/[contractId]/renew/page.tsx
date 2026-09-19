
import { notFound } from "next/navigation";

import ContractForm from "@/modules/contracts/ContractForm";
import { getContractById } from "@/modules/assets/service";

type RenewContractPageProps = {
  params: Promise<{ contractId: string }>;
};

export default async function RenewContractPage({
  params,
}: RenewContractPageProps) {
  const { contractId } = await params;
  const contract = getContractById(contractId);

  if (!contract) {
    notFound();
  }

  return (
    <main
      className="content"
      style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}
    >
      <ContractForm contract={contract} mode="renew" />
    </main>
  );
}
