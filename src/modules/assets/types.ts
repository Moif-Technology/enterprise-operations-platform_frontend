export type AssetStatus =
  | "active"
  | "inactive"
  | "under-maintenance"
  | "decommissioned";

export type AssetCategory =
  | "HVAC"
  | "Electrical"
  | "Fire Safety"
  | "Plumbing"
  | "Generator"
  | "Other";

export type MaintenanceFrequency = "weekly" | "monthly";

export type MaintenancePlanStatus = "active" | "paused";

export type MockWorkOrderStatus =
  | "new"
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface Customer {
  id: string;
  name: string;
  code: string;
}

export interface Site {
  id: string;
  customerId: string;
  name: string;
  code: string;
  address: string;
}

export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  category: AssetCategory;
  customerId: string;
  siteId: string;
  location: string;
  status: AssetStatus;
  serialNumber?: string;
  model?: string;
  installationDate: string;
  warrantyExpiry: string;
  notes?: string;
  nextMaintenanceDate: string;
}

export interface MaintenancePlan {
  id: string;
  assetId: string;
  planName: string;
  frequency: MaintenanceFrequency;
  startDate: string;
  nextDueDate: string;
  checklist: string[];
  status: MaintenancePlanStatus;
}

export interface ServiceHistoryEntry {
  id: string;
  assetId: string;
  planId?: string;
  workOrderId?: string;
  performedOn: string;
  summary: string;
  performedBy: string;
  outcome: "completed" | "partial" | "deferred";
}

export interface AssetDocument {
  id: string;
  assetId: string;
  name: string;
  type: "manual" | "warranty" | "certificate" | "photo" | "other";
  uploadedOn: string;
  /** Placeholder metadata only — no real file storage. */
  placeholderUrl: string;
}

export interface MockWorkOrder {
  id: string;
  reference: string;
  assetId: string;
  planId: string;
  title: string;
  status: MockWorkOrderStatus;
  scheduledDate: string;
  completedOn?: string;
  notes?: string;
}
