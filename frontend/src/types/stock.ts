export type MovementType = "Supply" | "Sale" | "Loss" | "Expiry" | "Inventory";

export interface StockMovement {
  id: string;
  articleId: string;
  type: MovementType;
  quantity: number;
  date: string;
  comment: string | null;
}

// Motifs de sortie de stock (sous-ensemble de MovementType)
export type ReleaseReason = "Sale" | "Loss" | "Expiry";