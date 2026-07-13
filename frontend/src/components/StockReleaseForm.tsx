import { useState } from "react";
import type { Article } from "../types/article";
import type { ReleaseReason } from "../types/stock";
import { releaseStock } from "../api/stockApi";
import { releaseReasonLabels } from "../utils/labels";
import { unitSymbols } from "../utils/labels";
import { formatQuantity } from "../utils/formatters";
import { Button } from "./ui/Button";

interface StockReleaseFormProps {
  article: Article;
  onSuccess: () => void;
  onCancel: () => void;
}

const RELEASE_REASONS: ReleaseReason[] = ["Sale", "Loss", "Expiry"];

const inputClass =
  "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const labelClass = "text-sm font-medium text-gray-700 mb-1";

export function StockReleaseForm({ article, onSuccess, onCancel }: StockReleaseFormProps) {
  const [reason, setReason] = useState<ReleaseReason>("Sale");
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
    if (parsedQuantity > article.currentStock) {
      setError(
        `Quantité supérieure au stock disponible (${formatQuantity(article.currentStock, article.unit)}).`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await releaseStock(article.id, {
        type: reason,
        quantity: parsedQuantity,
        comment: comment.trim() === "" ? null : comment,
      });
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
        <span className="font-medium text-gray-900">
          {formatQuantity(article.currentStock, article.unit)}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col">
        <label className={labelClass}>Motif de la sortie</label>
        <select
          className={inputClass}
          value={reason}
          onChange={(e) => setReason(e.target.value as ReleaseReason)}
        >
          {RELEASE_REASONS.map((r) => (
            <option key={r} value={r}>
              {releaseReasonLabels[r]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className={labelClass}>Quantité à retirer</label>
        <div className="flex items-center gap-2">
          <input
            className={`${inputClass} flex-1`}
            type="number"
            min="1"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
            {unitSymbols[article.unit]}
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <label className={labelClass}>Commentaire (optionnel)</label>
        <input
          className={inputClass}
          placeholder="Ex : Casse en rayon"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex gap-2 justify-end mt-2 pt-3 border-t border-gray-100">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "..." : "Valider la sortie"}
        </Button>
      </div>
    </div>
  );
}