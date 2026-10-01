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
<main className="content"style={{ width: "100%", maxWidth: "100%" }}> <p>Contract not found.</p> </main>
);
}

return (
<main
className="content"
style={{ width: "100%", maxWidth: "100%" }}
> <ContractForm contract={contract} mode="renew" /> </main> );
}
