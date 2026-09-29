"use client";

import { useParams } from "next/navigation";

import StockLocationForm from "@/modules/inventory/StockLocationForm";
import { getStockLocationById } from "@/modules/inventory/service";

export default function EditStockLocationPage() {
  const params = useParams<{ locationId: string }>();
  const location = getStockLocationById(params.locationId);

  return <StockLocationForm location={location} />;
}