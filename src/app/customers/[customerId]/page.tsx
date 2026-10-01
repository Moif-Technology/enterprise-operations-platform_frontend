import CustomerDetail from "@/modules/customers/CustomerDetail";

interface CustomerDetailPageProps {
  params: Promise<{
    customerId: string;
  }>;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { customerId } = await params;

  return (
    <main
      className="content"
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <CustomerDetail customerId={customerId} />
    </main>
  );
}