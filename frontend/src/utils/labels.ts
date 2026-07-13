import type { SaleType, PackagingLevel, UnitOfMeasure  } from "../types/article";
import type { MovementType, ReleaseReason  } from "../types/stock";

export const saleTypeLabels: Record<SaleType, string> = {
  OnSite: "Sur place",
  Takeaway: "À emporter",
  Both: "Sur place + À emporter",
};

export const packagingLevelLabels: Record<PackagingLevel, string> = {
  New: "Neuf",
  Refurbished: "Reconditionné",
  Unsellable: "Invendable",
};

export const movementTypeLabels: Record<MovementType, string> = {
  Supply: "Approvisionnement",
  Sale: "Vente",
  Loss: "Perte / casse",
  Expiry: "Péremption",
  Inventory: "Inventaire",
};

export const releaseReasonLabels: Record<ReleaseReason, string> = {
  Sale: "Vente",
  Loss: "Perte / casse",
  Expiry: "Péremption",
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