export type InventoryRecordStatus = "active" | "inactive";

export type StockLocationType = "warehouse" | "technician";

export type StockMovementType = "issue" | "return" | "adjustment";

export type ReturnCondition = "usable" | "damaged";

export type AdjustmentDirection = "increase" | "decrease";

export interface SparePartItem {
  id: string;
  partCode: string;
  name: string;
  category: string;
  unitOfMeasure: string;
  manufacturer?: string;
  manufacturerPartNumber?: string;
  description?: string;
  status: InventoryRecordStatus;
  reorderLevel: number;
  preferredWarehouseId?: string;
  notes?: string;
}

export interface StockLocation {
  id: string;
  code: string;
  name: string;
  type: StockLocationType;
  siteId?: string;
  technicianName?: string;
  status: InventoryRecordStatus;
}

export interface OpeningBalance {
  id: string;
  itemId: string;
  locationId: string;
  quantity: number;
  notes?: string;
}

export interface StockMovement {
  id: string;
  type: StockMovementType;
  itemId: string;
  sourceLocationId?: string;
  destinationLocationId?: string;
  quantity: number;
  date: string;
  reason: string;
  reasonCode?: string;
  actorName?: string;
  technicianName?: string;
  workOrderReference?: string;
  assetId?: string;
  customerId?: string;
  siteId?: string;
  condition?: ReturnCondition;
  adjustmentDirection?: AdjustmentDirection;
  notes?: string;
  originalIssueReference?: string;
}

export interface StockBalance {
  itemId: string;
  locationId: string;
  quantity: number;
  damagedQuantity: number;
}

export interface ItemStockSummary {
  itemId: string;
  totalQuantity: number;
  usableQuantity: number;
  damagedQuantity: number;
  reorderLevel: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  reorderSuggestionQuantity: number;
}

export interface StockMovementFilters {
  itemId?: string;
  locationId?: string;
  type?: StockMovementType;
  reason?: string;
  fromDate?: string;
  toDate?: string;
}

export interface StockOverviewFilters {
  itemId?: string;
  category?: string;
  locationId?: string;
  locationType?: StockLocationType;
  lowStockOnly?: boolean;
}