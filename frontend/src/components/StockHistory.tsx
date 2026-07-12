import { useState, useEffect } from "react";
import type { StockMovement } from "../types/stock";
import { getStockHistory } from "../api/stockApi";
import { Badge } from "./ui/Badge";

interface StockHistoryProps {
  articleId: string;
}

const movementLabels: Record<string, { label: string; color: "green" | "red" | "blue" }> = {
  Supply: { label: "Approvisionnement", color: "green" },
  Sale: { label: "Vente", color: "red" },
  Inventory: { label: "Inventaire", color: "blue" },
};

export function StockHistory({ articleId }: StockHistoryProps) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStockHistory(articleId);
        setMovements(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load history.");
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, [articleId]);

  if (isLoading) {
    return <p className="text-sm text-gray-500 py-4">Chargement...</p>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-800 text-sm p-2 rounded">{error}</div>;
  }

  if (movements.length === 0) {
    return <p className="text-sm text-gray-500 py-4">Aucun mouvement pour cet article.</p>;
  }

  return (
    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
      {movements.map((movement) => {
        const info = movementLabels[movement.type] ?? { label: movement.type, color: "blue" as const };
        return (
          <div
            key={movement.id}
            className="flex justify-between items-center border-b border-gray-100 pb-2"
          >
            <div className="flex flex-col gap-1">
              <Badge label={info.label} color={info.color} />
              {movement.comment && (
                <span className="text-xs text-gray-500">{movement.comment}</span>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">Qté : {movement.quantity}</p>
              <p className="text-xs text-gray-400">
                {new Date(movement.date).toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}