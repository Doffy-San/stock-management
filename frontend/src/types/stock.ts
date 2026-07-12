export type MovementType = "Supply" | "Sale" | "Inventory";

export interface StockMovement {
  id: string;
  articleId: string;
  type: MovementType;
  quantity: number;
  date: string;
  comment: string | null;
}