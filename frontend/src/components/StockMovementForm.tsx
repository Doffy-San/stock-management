import { useState } from "react";
import type { Article } from "../types/article";
import { supplyStock, recordInventory } from "../api/stockApi";
import { Button } from "./ui/Button";

type MovementMode = "supply" | "inventory";

interface StockMovementFormProps {
  article: Article;
  mode: MovementMode;
  onSuccess: () => void;
  onCancel: () => void;
}

const inputClass =
  "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const labelClass = "text-sm font-medium text-gray-700 mb-1";

export function StockMovementForm({
  article,
  mode,
  onSuccess,
  onCancel,
}: StockMovementFormProps) {
  const [quantity, setQuantity] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    const parsedQuantity = parseInt(quantity) || 0;
    if (parsedQuantity <= 0) {
      setError("La quantité doit être supérieure à zéro.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        quantity: parsedQuantity,
        comment: comment.trim() === "" ? null : comment,
      };

      if (mode === "supply") {
        await supplyStock(article.id, payload);
      } else {
        await recordInventory(article.id, payload);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
        Article : <span className="font-medium text-gray-900">{article.name}</span>
        <br />
        Stock actuel :{" "}
        <span className="font-medium text-gray-900">{article.currentStock}</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col">
        <label className={labelClass}>
          {mode === "supply" ? "Quantité à ajouter" : "Quantité comptée"}
        </label>
        <input
          className={inputClass}
          type="number"
          min="1"
          placeholder="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelClass}>Commentaire (optionnel)</label>
        <input
          className={inputClass}
          placeholder="Ex : Livraison du fournisseur X"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex gap-2 justify-end mt-2 pt-3 border-t border-gray-100">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting
            ? "..."
            : mode === "supply"
            ? "Approvisionner"
            : "Valider l'inventaire"}
        </Button>
      </div>
    </div>
  );
}