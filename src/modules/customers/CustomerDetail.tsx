
"use client";

import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { Badge, Button, Panel } from "@/components/ui/design-system";
import {
  getCustomerById,
  getSitesByCustomerId,
} from "@/modules/assets/service";

interface CustomerDetailProps {
  customerId: string;
}

export default function CustomerDetail({
  customerId,
}: CustomerDetailProps) {
  const customer = getCustomerById(customerId);

  if (!customer) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Customer Not Found"
          description="The requested customer record could not be found."
        />

        <Panel
          title="Customer Not Found"
          description="No customer record matches this ID."
        >
          <Link href="/customers">
            <Button variant="secondary">Back to Customers</Button>
          </Link>
        </Panel>
      </div>
    );
  }

  const sites = getSitesByCustomerId(customer.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        description={`Customer code: ${customer.code}`}
        action={
          <Link href={`/customers/${customer.id}/edit`}>
            <Button>Edit Customer</Button>
          </Link>
        }
      />

      <Panel
        title="Customer Details"
        description="Customer contact and service information."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Customer Name</p>
            <p className="mt-1 font-medium text-slate-900">
              {customer.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Customer Code</p>
            <p className="mt-1 font-medium text-slate-900">
              {customer.code}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Primary Contact</p>
            <p className="mt-1 font-medium text-slate-900">
              {customer.primaryContact}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>
            <div className="mt-1">
              <Badge
                tone={
                  customer.status === "active"
                    ? "success"
                    : "neutral"
                }
              >
                {customer.status}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-1 font-medium text-slate-900">
              {customer.email || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="mt-1 font-medium text-slate-900">
              {customer.phone || "—"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-slate-500">Address</p>
            <p className="mt-1 font-medium text-slate-900">
              {customer.address || "—"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-slate-500">Notes</p>
            <p className="mt-1 font-medium text-slate-900">
              {customer.notes || "—"}
            </p>
          </div>
        </div>
      </Panel>

      <Panel
        title="Sites"
        description="Sites associated with this customer."
      >
        {sites.length === 0 ? (
          <p className="text-sm text-slate-500">
            No sites are associated with this customer.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Site
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Code
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Address
                  </th>
                  <th className="px-3 py-3 font-medium text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {sites.map((site) => (
                  <tr
                    key={site.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-3 py-3 font-medium text-slate-900">
                      {site.name}
                    </td>

                    <td className="px-3 py-3 text-slate-600">
                      {site.code}
                    </td>

                    <td className="px-3 py-3 text-slate-600">
                      {site.address}
                    </td>

                    <td className="px-3 py-3">
                      <Badge
                        tone={
                          site.status === "active"
                            ? "success"
                            : "neutral"
                        }
                      >
                        {site.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Link href="/customers">
        <Button variant="secondary">Back to Customers</Button>
      </Link>
    </div>
  );
}
