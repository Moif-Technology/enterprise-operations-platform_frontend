import {
  assetDocuments,
  assets as seedAssets,
  customers,
  maintenancePlans as seedPlans,
  mockWorkOrders,
  serviceHistory,
  sites,
} from "./mock-data";
import type {
  Asset,
  AssetDocument,
  Customer,
  MaintenancePlan,
  MockWorkOrder,
  ServiceHistoryEntry,
  Site,
} from "./types";

/** In-memory copies so save operations persist for the current session only. */
let assetsStore: Asset[] = seedAssets.map((asset) => ({ ...asset }));
let plansStore: MaintenancePlan[] = seedPlans.map((plan) => ({
  ...plan,
  checklist: [...plan.checklist],
}));

function cloneAsset(asset: Asset): Asset {
  return { ...asset };
}

function clonePlan(plan: MaintenancePlan): MaintenancePlan {
  return {
    ...plan,
    checklist: [...plan.checklist],
  };
}

export function getCustomers(): Customer[] {
  return customers.map((customer) => ({ ...customer }));
}

export function getSites(): Site[] {
  return sites.map((site) => ({ ...site }));
}

export function getSitesByCustomerId(customerId: string): Site[] {
  return sites
    .filter((site) => site.customerId === customerId)
    .map((site) => ({ ...site }));
}

export function getAssets(): Asset[] {
  return assetsStore.map(cloneAsset);
}

export function getAssetById(id: string): Asset | undefined {
  const asset = assetsStore.find((item) => item.id === id);
  return asset ? cloneAsset(asset) : undefined;
}

export function saveAsset(asset: Asset): Asset {
  const index = assetsStore.findIndex((item) => item.id === asset.id);

  if (index >= 0) {
    assetsStore[index] = cloneAsset(asset);
  } else {
    assetsStore = [...assetsStore, cloneAsset(asset)];
  }

  return cloneAsset(asset);
}

export function getMaintenancePlans(): MaintenancePlan[] {
  return plansStore.map(clonePlan);
}

export function getMaintenancePlanById(id: string): MaintenancePlan | undefined {
  const plan = plansStore.find((item) => item.id === id);
  return plan ? clonePlan(plan) : undefined;
}

export function getMaintenancePlansByAssetId(assetId: string): MaintenancePlan[] {
  return plansStore
    .filter((plan) => plan.assetId === assetId)
    .map(clonePlan);
}

export function saveMaintenancePlan(plan: MaintenancePlan): MaintenancePlan {
  const index = plansStore.findIndex((item) => item.id === plan.id);

  if (index >= 0) {
    plansStore[index] = clonePlan(plan);
  } else {
    plansStore = [...plansStore, clonePlan(plan)];
  }

  return clonePlan(plan);
}

export function getServiceHistoryByAssetId(
  assetId: string,
): ServiceHistoryEntry[] {
  return serviceHistory
    .filter((entry) => entry.assetId === assetId)
    .map((entry) => ({ ...entry }));
}

export function getDocumentsByAssetId(assetId: string): AssetDocument[] {
  return assetDocuments
    .filter((document) => document.assetId === assetId)
    .map((document) => ({ ...document }));
}

export function getMockWorkOrders(): MockWorkOrder[] {
  return mockWorkOrders.map((workOrder) => ({ ...workOrder }));
}

export function getMockWorkOrdersByAssetId(assetId: string): MockWorkOrder[] {
  return mockWorkOrders
    .filter((workOrder) => workOrder.assetId === assetId)
    .map((workOrder) => ({ ...workOrder }));
}

/** Restores seed fixtures. Useful for demo reset after in-session edits. */
export function resetAssetModuleData(): void {
  assetsStore = seedAssets.map(cloneAsset);
  plansStore = seedPlans.map(clonePlan);
}
