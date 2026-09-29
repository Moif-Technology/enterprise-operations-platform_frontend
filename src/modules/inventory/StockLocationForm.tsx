"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/ui/PageHeader";
import { Badge, Button, Panel } from "@/components/ui/design-system";
import { getSites } from "@/modules/assets/service";
import {
  getStockBalances,
  getStockLocations,
  saveStockLocation,
} from "@/modules/inventory/service";
import type { StockLocation, StockLocationType } from "@/modules/inventory/types";

interface StockLocationFormProps {
  location?: StockLocation;
}

export default function StockLocationForm({
  location,
}: StockLocationFormProps) {
  const router = useRouter();

  const sites = useMemo(() => getSites(), []);
  const locations = useMemo(() => getStockLocations(), []);

  const [code, setCode] = useState(location?.code ?? "");
  const [name, setName] = useState(location?.name ?? "");
  const [type, setType] = useState<StockLocationType>(
    location?.type ?? "warehouse",
  );
  const [siteId, setSiteId] = useState(location?.siteId ?? "");
  const [technicianName, setTechnicianName] = useState(
    location?.technicianName ?? "",
  );
  const [status, setStatus] = useState<"active" | "inactive">(
    location?.status ?? "active",
  );
  const [error, setError] = useState("");

  const isEdit = Boolean(location);

  const referencedLocation = location
    ? getStockBalances().some(
        (balance) =>
          balance.locationId === location.id && balance.quantity !== 0,
      ) ||
      getStockLocations().some(
        (item) =>
          item.id === location.id &&
          item.id !== location.id,
      )
    : false;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const trimmedTechnicianName = technicianName.trim();

    if (!trimmedCode || !trimmedName || !type) {
      setError("Location code, name, and type are required.");
      return;
    }

    const duplicate = locations.some(
      (item) =>
        item.id !== location?.id &&
        item.code.trim().toLowerCase() === trimmedCode.toLowerCase(),
    );

    if (duplicate) {
      setError("Location code must be unique.");
      return;
    }

    if (type === "warehouse" && !siteId) {
      setError("A warehouse must be linked to an existing site.");
      return;
    }

    if (type === "warehouse" && !sites.some((site) => site.id === siteId)) {
      setError("Please select a valid existing site.");
      return;
    }

    if (type === "technician" && !trimmedTechnicianName) {
      setError("Technician name is required for technician stock.");
      return;
    }

    const savedLocation: StockLocation = {
      id: location?.id ?? `loc-${Date.now()}`,
      code: trimmedCode,
      name: trimmedName,
      type,
      status,
      ...(type === "warehouse" ? { siteId } : {}),
      ...(type === "technician"
        ? { technicianName: trimmedTechnicianName }
        : {}),
    };

    try {
      const result = saveStockLocation(savedLocation);
      router.push(`/inventory/stock-locations/${result.id}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save the stock location.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory"
        title={isEdit ? "Edit Stock Location" : "Create Stock Location"}
        description={
          isEdit
            ? "Update warehouse or technician stock information."
            : "Create a warehouse or technician stock location."
        }
      />

      <Panel
        title="Stock Location Details"
        description="Use an existing Module 03 site for warehouse locations."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {isEdit && (
            <div className="rounded-md border border-[#dfe4ea] bg-[#f6f7f9] px-4 py-3 text-sm text-[#647086]">
              <strong className="text-[#162033]">Reference safety:</strong>{" "}
              locations with stock or movement history cannot have their type
              changed. Inactive locations remain available for historical
              records.
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Location Code *
              </label>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="input w-full"
                placeholder="e.g. WH-HVM-C"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Location Name *
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="input w-full"
                placeholder="e.g. Harborview Central Warehouse"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Location Type *
              </label>
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as StockLocationType)
                }
                className="input w-full"
              >
                <option value="warehouse">Warehouse</option>
                <option value="technician">Technician</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#162033]">
                Status
              </label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "active" | "inactive")
                }
                className="input w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {type === "warehouse" && (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#162033]">
                  Existing Site *
                </label>
                <select
                  value={siteId}
                  onChange={(event) => setSiteId(event.target.value)}
                  className="input w-full"
                >
                  <option value="">Select existing site</option>
                  {sites
                    .filter(
                      (site) =>
                        site.status === "active" || site.id === location?.siteId,
                    )
                    .map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name} ({site.code})
                      </option>
                    ))}
                </select>
                <p className="mt-2 text-xs text-[#647086]">
                  Warehouse locations reuse the existing customer/site records.
                </p>
              </div>
            )}

            {type === "technician" && (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#162033]">
                  Technician Name *
                </label>
                <input
                  value={technicianName}
                  onChange={(event) => setTechnicianName(event.target.value)}
                  className="input w-full"
                  placeholder="e.g. R. Mehta"
                />
              </div>
            )}
          </div>

          {location && (
            <div className="flex items-center gap-2 text-sm text-[#647086]">
              <span>Current status:</span>
              <Badge
                tone={location.status === "active" ? "success" : "neutral"}
              >
                {location.status}
              </Badge>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Stock Location"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/inventory/stock-locations")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}