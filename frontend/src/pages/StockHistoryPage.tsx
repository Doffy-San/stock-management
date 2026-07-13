import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { StockMovement } from "../types/stock";
import type { Article } from "../types/article";
import { getStockHistory } from "../api/stockApi";
import { getArticles } from "../api/articleApi";
import { movementTypeLabels } from "../utils/labels";
import { formatDate, formatQuantity } from "../utils/formatters";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ArrowLeft } from "lucide-react";

const movementColors: Record<string, "green" | "red" | "blue" | "orange"> = {
  Supply: "green",
  Sale: "red",
  Loss: "orange",
  Expiry: "orange",
  Inventory: "blue",
};

export function StockHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [history, articles] = await Promise.all([
          getStockHistory(id!),
          getArticles(),
        ]);
        setMovements(history);
        setArticle(articles.find((a) => a.id === id) ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate("/")}>
            <span className="flex items-center gap-1">
              <ArrowLeft size={16} /> Retour
            </span>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Historique des mouvements
            </h1>
            <p className="text-sm text-gray-500">
              {article ? article.name : "Entrées, sorties et inventaires"}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {isLoading && <p className="text-center text-gray-500 py-8">Chargement...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
            {error}
          </div>
        )}

        {!isLoading && !error && movements.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            Aucun mouvement enregistré pour cet article.
          </div>
        )}

        {!isLoading && !error && movements.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantité</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Commentaire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {movements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <Badge
                          label={movementTypeLabels[movement.type]}
                          color={movementColors[movement.type] ?? "blue"}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {article
                          ? formatQuantity(movement.quantity, article.unit)
                          : movement.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(movement.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {movement.comment ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}