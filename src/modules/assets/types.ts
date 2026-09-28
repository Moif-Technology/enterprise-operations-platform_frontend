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
  export type RecordStatus = "active" | "inactive";

  export interface Customer {
    id: string;
    name: string;
    code: string;
    status: RecordStatus;
    primaryContact: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
  }
  
  export interface Site {
    id: string;
    customerId: string;
    name: string;
    code: string;
    address: string;
    status: RecordStatus;
    location?: string;
    contactName?: string;
    contactPhone?: string;
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

export type ContractType = "AMC" | "Warranty" | "Service";

export type ContractStatus =
  | "draft"
  | "active"
  | "expired"
  | "cancelled";

export type ContractLifecycleStatus =
  | "scheduled"
  | "active"
  | "expired";

export type ContractCurrency = "INR" | "USD";

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  customerId: string;
  siteIds: string[];
  assetIds: string[];
  type: ContractType;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  serviceScope: string;
  exclusions?: string;
  visitFrequency?: string;
  value?: number;
  currency: ContractCurrency;
  responseHours?: number;
  resolutionHours?: number;
  notes?: string;
  originalContractId?: string;
}

