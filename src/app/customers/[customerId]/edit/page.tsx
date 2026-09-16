import { notFound } from "next/navigation";

import CustomerForm from "@/modules/customers/CustomerForm";

import { getCustomerById } from "@/modules/assets/service";

type EditCustomerPageProps = {
  params: Promise<{
    customerId: string;
  }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { customerId } = await params;

  const customer = getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  return <CustomerForm customer={customer} />;
}

