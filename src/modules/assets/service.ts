

import {
  assetDocuments,
  assets as seedAssets,
  customers,
  contracts,
  maintenancePlans as seedPlans,
  mockWorkOrders,
  serviceHistory,
  sites,
} from "./mock-data";


import type {
  Asset,
  AssetDocument,
  Contract,
  Customer,
  MaintenancePlan,
  MockWorkOrder,
  ServiceHistoryEntry,
  Site,
} from "./types";



/** In-memory copies so save operations persist for the current session only. */
let customersStore: Customer[] = customers.map((customer) => ({
  ...customer,
}));

let sitesStore: Site[] = sites.map((site) => ({
  ...site,
}));

let contractsStore: Contract[] = contracts.map((contract) => ({
  ...contract,
  siteIds: [...contract.siteIds],
  assetIds: [...contract.assetIds],
}));


let assetsStore: Asset[] = seedAssets.map((asset) => ({ ...asset }));
let plansStore: MaintenancePlan[] = seedPlans.map((plan) => ({
  ...plan,
  checklist: [...plan.checklist],
}));
let serviceHistoryStore: ServiceHistoryEntry[] = serviceHistory.map(
  (entry) => ({ ...entry }),
);
let mockWorkOrdersStore: MockWorkOrder[] = mockWorkOrders.map(
  (workOrder) => ({ ...workOrder }),
);
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
  return customersStore.map((customer) => ({ ...customer }));
}

export function getCustomerById(id: string): Customer | undefined {
  const customer = customersStore.find((item) => item.id === id);
  return customer ? { ...customer } : undefined;
}

export function saveCustomer(customer: Customer): Customer {
  const index = customersStore.findIndex((item) => item.id === customer.id);

  if (index >= 0) {
    customersStore[index] = { ...customer };
  } else {
    customersStore = [...customersStore, { ...customer }];
  }

  return { ...customer };
}

export function getSites(): Site[] {
  return sitesStore.map((site) => ({ ...site }));
}

export function getSiteById(id: string): Site | undefined {
  const site = sitesStore.find((item) => item.id === id);
  return site ? { ...site } : undefined;
}

export function getSitesByCustomerId(customerId: string): Site[] {
  return sitesStore
    .filter((site) => site.customerId === customerId)
    .map((site) => ({ ...site }));
}

function cloneContract(contract: Contract): Contract {
  return {
    ...contract,
    siteIds: [...contract.siteIds],
    assetIds: [...contract.assetIds],
  };
}
export function getContractLifecycleStatus(
  contract: Contract,
  today = new Date(),
): "scheduled" | "active" | "expired" | "draft" | "cancelled" {
  if (contract.status === "draft" || contract.status === "cancelled") {
    return contract.status;
  }

  const currentDate = today.toISOString().slice(0, 10);

  if (currentDate < contract.startDate) {
    return "scheduled";
  }

  if (currentDate <= contract.endDate) {
    return "active";
  }

  return "expired";
}
export function isContractExpiringWithin30Days(
  contract: Contract,
  today = new Date(),
): boolean {
  if (contract.status !== "active") {
    return false;
  }

  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const endDate = new Date(
    Number(contract.endDate.slice(0, 4)),
    Number(contract.endDate.slice(5, 7)) - 1,
    Number(contract.endDate.slice(8, 10)),
  );

  const diffInDays =
    (endDate.getTime() - currentDate.getTime()) /
    (1000 * 60 * 60 * 24);

  return diffInDays >= 0 && diffInDays <= 30;
}
export function getContracts(): Contract[] {
  return contractsStore.map(cloneContract);
}

export function getContractById(id: string): Contract | undefined {
  const contract = contractsStore.find((item) => item.id === id);
  return contract ? cloneContract(contract) : undefined;
}

export function getContractsByCustomerId(customerId: string): Contract[] {
  return contractsStore
    .filter((contract) => contract.customerId === customerId)
    .map(cloneContract);
}

export function saveContract(contract: Contract): Contract {
  const index = contractsStore.findIndex(
    (item) => item.id === contract.id,
  );

  if (index >= 0) {
    contractsStore[index] = cloneContract(contract);
  } else {
    contractsStore = [...contractsStore, cloneContract(contract)];
  }

  return cloneContract(contract);
}



export function saveSite(site: Site): Site {
  const index = sitesStore.findIndex((item) => item.id === site.id);

  if (index >= 0) {
    sitesStore[index] = { ...site };
  } else {
    sitesStore = [...sitesStore, { ...site }];
  }

  return { ...site };
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
export function getMaintenancePlan(
  planId: string
): MaintenancePlan | undefined {
  return getMaintenancePlans().find((plan) => plan.id === planId);
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
  return serviceHistoryStore
    .filter((entry) => entry.assetId === assetId)
    .map((entry) => ({ ...entry }));
}

export function getDocumentsByAssetId(assetId: string): AssetDocument[] {
  return assetDocuments
    .filter((document) => document.assetId === assetId)
    .map((document) => ({ ...document }));
}

export function getMockWorkOrders(): MockWorkOrder[] {
  return mockWorkOrdersStore.map((workOrder) => ({ ...workOrder }));
}

export function getMockWorkOrdersByAssetId(assetId: string): MockWorkOrder[] {
  return mockWorkOrdersStore
    .filter((workOrder) => workOrder.assetId === assetId)
    .map((workOrder) => ({ ...workOrder }));
}
export function getMockWorkOrdersByPlanId(
  planId: string,
): MockWorkOrder[] {
  return mockWorkOrdersStore
    .filter((workOrder) => workOrder.planId === planId)
    .map((workOrder) => ({ ...workOrder }));
}
export function completeMockWorkOrder(
  workOrderId: string,
  completedOn: string,
  notes?: string,
): MockWorkOrder | undefined {
  const workOrder = mockWorkOrdersStore.find(
    (item) => item.id === workOrderId,
  );

  if (!workOrder || workOrder.status === "completed") {
    return undefined;
  }

  workOrder.status = "completed";
  workOrder.completedOn = completedOn;
  workOrder.notes = notes ?? workOrder.notes;
  const historyAlreadyExists = serviceHistoryStore.some(
    (entry) => entry.workOrderId === workOrder.id,
  );
  
  if (!historyAlreadyExists) {
    serviceHistoryStore.push({
      id: `history-${workOrder.id}`,
      assetId: workOrder.assetId,
      planId: workOrder.planId,
      workOrderId: workOrder.id,
      performedOn: completedOn,
      summary: workOrder.title,
      performedBy: "PM Service Team",
      outcome: "completed",
    });
  }
  const plan = plansStore.find((item) => item.id === workOrder.planId);

  if (plan) {
    const nextDueDate = new Date(plan.nextDueDate);
    const days =
      plan.frequency === "weekly" ? 7 : 30;

    nextDueDate.setDate(nextDueDate.getDate() + days);

    plan.nextDueDate = nextDueDate.toISOString().slice(0, 10);
  }

  return { ...workOrder };
}
/** Restores seed fixtures. Useful for demo reset after in-session edits. */
export function resetAssetModuleData(): void {
  assetsStore = seedAssets.map(cloneAsset);

  plansStore = seedPlans.map(clonePlan);

  serviceHistoryStore = serviceHistory.map(
    (entry) => ({ ...entry }),
  );

  contractsStore = contracts.map((contract) => ({
    ...contract,
    siteIds: [...contract.siteIds],
    assetIds: [...contract.assetIds],
  }));

  mockWorkOrdersStore = mockWorkOrders.map(
    (workOrder) => ({ ...workOrder }),
  );
}

  