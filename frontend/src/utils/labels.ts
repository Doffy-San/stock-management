import type { SaleType, PackagingLevel, UnitOfMeasure  } from "../types/article";
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

// Symboles courts pour l'affichage des quantités (ex : "400 L")
export const unitSymbols: Record<UnitOfMeasure, string> = {
  Piece: "pc",
  Kilogram: "kg",
  Liter: "L",
};

// Libellés complets pour les sélecteurs
export const unitLabels: Record<UnitOfMeasure, string> = {
  Piece: "Pièce",
  Kilogram: "Kilogramme",
  Liter: "Litre",
};