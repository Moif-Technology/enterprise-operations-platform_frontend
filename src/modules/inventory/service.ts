import {
  openingBalances as seedOpeningBalances,
  spareParts as seedSpareParts,
  stockLocations as seedStockLocations,
} from "./mock-data";
import type {

  ItemStockSummary,
  OpeningBalance,
  SparePartItem,
  StockBalance,
  StockLocation,
  StockMovement,
} from "./types";

const INVENTORY_STORAGE_KEY = "module-04-inventory-store";

type InventoryStore = {
  spareParts: SparePartItem[];
  stockLocations: StockLocation[];
  openingBalances: OpeningBalance[];
  movements: StockMovement[];
};

function createSeedStore(): InventoryStore {
  return {
    spareParts: seedSpareParts.map((item) => ({ ...item })),
    stockLocations: seedStockLocations.map((location) => ({ ...location })),
    openingBalances: seedOpeningBalances.map((balance) => ({ ...balance })),
    movements: [],
  };
}

let sparePartsStore: SparePartItem[] = createSeedStore().spareParts;
let stockLocationsStore: StockLocation[] = createSeedStore().stockLocations;
let openingBalancesStore: OpeningBalance[] =
  createSeedStore().openingBalances;
let movementsStore: StockMovement[] = [];

let clientStoreLoaded = false;

function loadClientStore(): void {
  if (clientStoreLoaded || typeof window === "undefined") {
    return;
  }

  clientStoreLoaded = true;

  const stored = window.localStorage.getItem(INVENTORY_STORAGE_KEY);

  if (!stored) {
    return;
  }

  try {
    const parsed = JSON.parse(stored) as InventoryStore;

    sparePartsStore = parsed.spareParts;
    stockLocationsStore = parsed.stockLocations;
    openingBalancesStore = parsed.openingBalances;
    movementsStore = parsed.movements;
  } catch {
    window.localStorage.removeItem(INVENTORY_STORAGE_KEY);
  }
}

function persistClientStore(): void {
  if (typeof window === "undefined") {
    return;
  }

  const store: InventoryStore = {
    spareParts: sparePartsStore,
    stockLocations: stockLocationsStore,
    openingBalances: openingBalancesStore,
    movements: movementsStore,
  };

  window.localStorage.setItem(
    INVENTORY_STORAGE_KEY,
    JSON.stringify(store),
  );
}

function cloneItem(item: SparePartItem): SparePartItem {
  return { ...item };
}

function cloneLocation(location: StockLocation): StockLocation {
  return { ...location };
}

function cloneOpeningBalance(balance: OpeningBalance): OpeningBalance {
  return { ...balance };
}

function cloneMovement(movement: StockMovement): StockMovement {
  return { ...movement };
}

export function getSpareParts(): SparePartItem[] {
  loadClientStore();
  return sparePartsStore.map(cloneItem);
}

export function getSparePartById(id: string): SparePartItem | undefined {
  loadClientStore();
  const item = sparePartsStore.find((part) => part.id === id);
  return item ? cloneItem(item) : undefined;
}

export function saveSparePart(item: SparePartItem): SparePartItem {
  const duplicate = sparePartsStore.find(
    (part) =>
      part.partCode.trim().toLowerCase() === item.partCode.trim().toLowerCase() &&
      part.id !== item.id,
  );

  if (duplicate) {
    throw new Error(`Part code "${item.partCode}" already exists.`);
  }

  if (item.reorderLevel < 0) {
    throw new Error("Reorder level cannot be negative.");
  }

  const index = sparePartsStore.findIndex((part) => part.id === item.id);

  if (index >= 0) {
    sparePartsStore[index] = cloneItem(item);
  } else {
    sparePartsStore = [...sparePartsStore, cloneItem(item)];
  }
  persistClientStore();
  return cloneItem(item);
}

export function getStockLocations(): StockLocation[] {
  loadClientStore();
  return stockLocationsStore.map(cloneLocation);
}

export function getStockLocationById(id: string): StockLocation | undefined {
  loadClientStore();
  const location = stockLocationsStore.find((item) => item.id === id);
  return location ? cloneLocation(location) : undefined;
}

export function saveStockLocation(location: StockLocation): StockLocation {
  const duplicate = stockLocationsStore.find(
    (item) =>
      item.code.trim().toLowerCase() === location.code.trim().toLowerCase() &&
      item.id !== location.id,
  );

  if (duplicate) {
    throw new Error(`Location code "${location.code}" already exists.`);
  }

  const existing = stockLocationsStore.find((item) => item.id === location.id);

  if (
    existing &&
    existing.type !== location.type &&
    (getStockBalances().some((balance) => balance.locationId === location.id && balance.quantity !== 0) ||
      movementsStore.some(
        (movement) =>
          movement.sourceLocationId === location.id ||
          movement.destinationLocationId === location.id,
      ))
  ) {
    throw new Error(
      "Location type cannot be changed because stock or movement history references this location.",
    );
  }

  const index = stockLocationsStore.findIndex((item) => item.id === location.id);

  if (index >= 0) {
    stockLocationsStore[index] = cloneLocation(location);
  } else {
    stockLocationsStore = [...stockLocationsStore, cloneLocation(location)];
  }
  persistClientStore();
  return cloneLocation(location);
}

export function getOpeningBalances(): OpeningBalance[] {
  loadClientStore();
  return openingBalancesStore.map(cloneOpeningBalance);
}

export function getMovements(): StockMovement[] {
  loadClientStore();
  return movementsStore
    .map(cloneMovement)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getMovementById(id: string): StockMovement | undefined {
  loadClientStore();
  const movement = movementsStore.find((item) => item.id === id);
  return movement ? cloneMovement(movement) : undefined;
}

export function getStockBalances(): StockBalance[] {
  loadClientStore();
  const balances = new Map<string, StockBalance>();

  const ensureBalance = (itemId: string, locationId: string): StockBalance => {
    const key = `${itemId}:${locationId}`;
    const existing = balances.get(key);

    if (existing) {
      return existing;
    }

    const created: StockBalance = {
      itemId,
      locationId,
      quantity: 0,
      damagedQuantity: 0,
    };

    balances.set(key, created);
    return created;
  };

  for (const opening of openingBalancesStore) {
    const balance = ensureBalance(opening.itemId, opening.locationId);
    balance.quantity += opening.quantity;
  }

  for (const movement of movementsStore) {
    if (movement.type === "issue") {
      if (movement.sourceLocationId) {
        const balance = ensureBalance(
          movement.itemId,
          movement.sourceLocationId,
        );
        balance.quantity -= movement.quantity;
      }

      if (movement.destinationLocationId) {
        const balance = ensureBalance(
          movement.itemId,
          movement.destinationLocationId,
        );
        balance.quantity += movement.quantity;
      }
    }

    if (movement.type === "return") {
      if (movement.sourceLocationId) {
        const source = ensureBalance(
          movement.itemId,
          movement.sourceLocationId,
        );
        source.quantity -= movement.quantity;
      }
    
      if (movement.destinationLocationId) {
        const destination = ensureBalance(
          movement.itemId,
          movement.destinationLocationId,
        );
    
        destination.quantity += movement.quantity;
    
        if (movement.condition === "damaged") {
          destination.damagedQuantity += movement.quantity;
        }
      }
    }

    if (movement.type === "adjustment") {
      const locationId =
        movement.destinationLocationId ?? movement.sourceLocationId;

      if (locationId) {
        const balance = ensureBalance(movement.itemId, locationId);

        if (movement.adjustmentDirection === "increase") {
          balance.quantity += movement.quantity;
        } else {
          balance.quantity -= movement.quantity;
        }
      }
    }
  }

  return Array.from(balances.values());
}

export function getItemStockSummary(itemId: string): ItemStockSummary | undefined {
  const item = getSparePartById(itemId);

  if (!item) {
    return undefined;
  }

  const balances = getStockBalances().filter((balance) => balance.itemId === itemId);

  const totalQuantity = balances.reduce(
    (total, balance) => total + balance.quantity,
    0,
  );

  const damagedQuantity = balances.reduce(
    (total, balance) => total + balance.damagedQuantity,
    0,
  );

  const usableQuantity = totalQuantity - damagedQuantity;

  return {
    itemId,
    totalQuantity,
    usableQuantity,
    damagedQuantity,
    reorderLevel: item.reorderLevel,
    isLowStock: totalQuantity <= item.reorderLevel,
    isOutOfStock: totalQuantity === 0,
    reorderSuggestionQuantity: Math.max(item.reorderLevel - totalQuantity, 0),
  };
}

export function getAllItemStockSummaries(): ItemStockSummary[] {
  loadClientStore();
  return sparePartsStore
    .map((item) => getItemStockSummary(item.id))
    .filter((summary): summary is ItemStockSummary => Boolean(summary));
}

function getAvailableQuantity(itemId: string, locationId: string): number {
  return (
    getStockBalances().find(
      (balance) =>
        balance.itemId === itemId && balance.locationId === locationId,
    )?.quantity ?? 0
  );
}

function assertPositiveQuantity(quantity: number): void {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }
}

function assertItemAndLocation(
  itemId: string,
  locationId: string,
): void {
  if (!getSparePartById(itemId)) {
    throw new Error("The selected spare part does not exist.");
  }

  if (!getStockLocationById(locationId)) {
    throw new Error("The selected stock location does not exist.");
  }
}

export function saveOpeningBalance(balance: OpeningBalance): OpeningBalance {
  assertPositiveQuantity(balance.quantity);

  assertItemAndLocation(balance.itemId, balance.locationId);

  const index = openingBalancesStore.findIndex(
    (item) => item.id === balance.id,
  );

  if (index >= 0) {
    openingBalancesStore[index] = cloneOpeningBalance(balance);
  } else {
    openingBalancesStore = [
      ...openingBalancesStore,
      cloneOpeningBalance(balance),
    ];
  }
  persistClientStore();
  return cloneOpeningBalance(balance);
}

export function recordIssue(
  movement: StockMovement,
): StockMovement {
  if (movement.type !== "issue") {
    throw new Error("Issue movements must have type \"issue\".");
  }

  assertPositiveQuantity(movement.quantity);

  if (!movement.sourceLocationId) {
    throw new Error("An issue requires a source location.");
  }

  assertItemAndLocation(movement.itemId, movement.sourceLocationId);

  if (
    movement.destinationLocationId &&
    !getStockLocationById(movement.destinationLocationId)
  ) {
    throw new Error("The destination stock location does not exist.");
  }

  const available = getAvailableQuantity(
    movement.itemId,
    movement.sourceLocationId,
  );

  if (movement.quantity > available) {
    throw new Error(
      `Cannot issue ${movement.quantity}. Only ${available} is available at the source location.`,
    );
  }

  const stored = cloneMovement(movement);
  movementsStore = [...movementsStore, stored];
  persistClientStore();
  return cloneMovement(stored);
}

export function recordReturn(
  movement: StockMovement,
): StockMovement {
  if (movement.type !== "return") {
    throw new Error("Return movements must have type \"return\".");
  }

  assertPositiveQuantity(movement.quantity);

  if (!movement.sourceLocationId || !movement.destinationLocationId) {
    throw new Error(
      "A return requires both source and destination locations.",
    );
  }

  if (!movement.condition) {
    throw new Error("Return condition is required.");
  }

  assertItemAndLocation(movement.itemId, movement.sourceLocationId);
  assertItemAndLocation(movement.itemId, movement.destinationLocationId);

  const available = getAvailableQuantity(
    movement.itemId,
    movement.sourceLocationId,
  );

  if (movement.quantity > available) {
    throw new Error(
      `Cannot return ${movement.quantity}. Only ${available} is available at the source location.`,
    );
  }

  const stored = cloneMovement(movement);
  movementsStore = [...movementsStore, stored];
  persistClientStore();
  return cloneMovement(stored);
}

export function recordAdjustment(
  movement: StockMovement,
): StockMovement {
  if (movement.type !== "adjustment") {
    throw new Error("Adjustment movements must have type \"adjustment\".");
  }

  assertPositiveQuantity(movement.quantity);

  const locationId =
    movement.destinationLocationId ?? movement.sourceLocationId;

  if (!locationId) {
    throw new Error("An adjustment requires a stock location.");
  }

  if (!movement.adjustmentDirection) {
    throw new Error("Adjustment direction is required.");
  }

  assertItemAndLocation(movement.itemId, locationId);

  const available = getAvailableQuantity(movement.itemId, locationId);

  if (
    movement.adjustmentDirection === "decrease" &&
    movement.quantity > available
  ) {
    throw new Error(
      `Cannot decrease stock by ${movement.quantity}. Only ${available} is available.`,
    );
  }

  const stored = cloneMovement(movement);
  movementsStore = [...movementsStore, stored];
  persistClientStore();
  return cloneMovement(stored);
}

export function recordMovement(movement: StockMovement): StockMovement {
  if (movement.type === "issue") {
    return recordIssue(movement);
  }

  if (movement.type === "return") {
    return recordReturn(movement);
  }

  return recordAdjustment(movement);
}

export function resetInventoryModuleData(): void {
  sparePartsStore = seedSpareParts.map((item) => ({ ...item }));
  stockLocationsStore = seedStockLocations.map((location) => ({ ...location }));
  openingBalancesStore = seedOpeningBalances.map((balance) => ({ ...balance }));
  movementsStore = [];

  clientStoreLoaded = true;

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(INVENTORY_STORAGE_KEY);
  }
}

