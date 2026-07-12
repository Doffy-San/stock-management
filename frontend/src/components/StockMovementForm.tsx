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

export function StockMovementForm({
  article,
  mode,
  onSuccess,
  onCancel,
}: StockMovementFormProps) {
  const [quantity, setQuantity] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        quantity,
        comment: comment.trim() === "" ? null : comment,
      };

      if (mode === "supply") {
        await supplyStock(article.id, payload);
      } else {
        await recordInventory(article.id, payload);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-600">
        Article : <span className="font-medium">{article.name}</span>
        <br />
        Stock actuel : <span className="font-medium">{article.currentStock}</span>
      </p>

      {error && (
        <div className="bg-red-100 text-red-800 text-sm p-2 rounded">{error}</div>
      )}

      <input
        className="border rounded px-3 py-2 text-sm"
        type="number"
        min="1"
        placeholder={mode === "supply" ? "Quantité à ajouter" : "Quantité comptée"}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
      />

      <input
        className="border rounded px-3 py-2 text-sm"
        placeholder="Commentaire (optionnel)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="flex gap-2 justify-end mt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "..." : mode === "supply" ? "Approvisionner" : "Valider l'inventaire"}
        </Button>
      </div>
    </div>
  );
}