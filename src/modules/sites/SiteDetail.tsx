"use client";

import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import { Badge, Button, Panel } from "@/components/ui/design-system";
import {
  getCustomerById,
  getSiteById,
} from "@/modules/assets/service";

interface SiteDetailProps {
  siteId: string;
}

export default function SiteDetail({ siteId }: SiteDetailProps) {
  const site = getSiteById(siteId);

  if (!site) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Site Not Found"
          description="The requested site record could not be found."
        />

        <Panel
          title="Site Not Found"
          description="No site record matches this ID."
        >
          <Link href="/sites">
            <Button variant="secondary">Back to Sites</Button>
          </Link>
        </Panel>
      </div>
    );
  }

  const customer = getCustomerById(site.customerId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={site.name}
        description={`Site code: ${site.code}`}
        action={
          <Link href={`/sites/${site.id}/edit`}>
            <Button>Edit Site</Button>
          </Link>
        }
      />

      <Panel
        title="Site Details"
        description="Site and customer information."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Site Name</p>
            <p className="mt-1 font-medium text-slate-900">
              {site.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Site Code</p>
            <p className="mt-1 font-medium text-slate-900">
              {site.code}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Customer</p>
            <p className="mt-1 font-medium text-slate-900">
              {customer ? customer.name : "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>
            <div className="mt-1">
              <Badge
                tone={site.status === "active" ? "success" : "neutral"}
              >
                {site.status}
              </Badge>
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-slate-500">Address</p>
            <p className="mt-1 font-medium text-slate-900">
              {site.address}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Location</p>
            <p className="mt-1 font-medium text-slate-900">
              {site.location || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Contact Name</p>
            <p className="mt-1 font-medium text-slate-900">
              {site.contactName || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Contact Phone</p>
            <p className="mt-1 font-medium text-slate-900">
              {site.contactPhone || "—"}
            </p>
          </div>
        </div>
      </Panel>

      <Link href="/sites">
        <Button variant="secondary">Back to Sites</Button>
      </Link>
    </div>
  );
}