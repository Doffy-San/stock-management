import type { SaleType, PackagingLevel } from "../types/article";
import type { MovementType } from "../types/stock";

export const saleTypeLabels: Record<SaleType, string> = {
  OnSite: "Sur place",
  Takeaway: "À emporter",
  Both: "Les deux",
};

export const packagingLevelLabels: Record<PackagingLevel, string> = {
  New: "Neuf",
  Refurbished: "Reconditionné",
  Unsellable: "Invendable",
};

export const movementTypeLabels: Record<MovementType, string> = {
  Supply: "Approvisionnement",
  Sale: "Vente",
  Inventory: "Inventaire",
};