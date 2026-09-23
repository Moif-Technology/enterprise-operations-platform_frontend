"use client";

import ContractForm from "@/modules/contracts/ContractForm";
import { getContractById } from "@/modules/assets/service";
import { useParams } from "next/navigation";

export default function RenewContractPage() {
const params = useParams<{ contractId: string }>();
const contractId = params.contractId;
const contract = getContractById(contractId);

if (!contract) {
return (
<main className="content" style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}> <p>Contract not found.</p> </main>
);
}

return (
<main
className="content"
style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}
> <ContractForm contract={contract} mode="renew" /> </main> );
}
