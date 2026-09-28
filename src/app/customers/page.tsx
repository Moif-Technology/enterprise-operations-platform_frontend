
import CustomerList from "@/modules/customers/CustomerList";

export default function CustomersPage() {
  return (
    <main className="content" style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <CustomerList />
    </main>
  );
}

