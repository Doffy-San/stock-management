import { useState } from "react";
import type { Article, FoodArticle, NonFoodArticle, ArticleType, SaleType, PackagingLevel } from "../types/article";
import {
  createFoodArticle,
  createNonFoodArticle,
  updateFoodArticle,
  updateNonFoodArticle,
} from "../api/articleApi";
import { Button } from "./ui/Button";

interface ArticleFormProps {
  articleToEdit?: Article;
  onSuccess: () => void;
  onCancel: () => void;
}

const SALE_TYPES: SaleType[] = ["OnSite", "Takeaway", "Both"];
const PACKAGING_LEVELS: PackagingLevel[] = ["New", "Refurbished", "Unsellable"];

export function ArticleForm({ articleToEdit, onSuccess, onCancel }: ArticleFormProps) {
  const isEditMode = articleToEdit !== undefined;

  const [articleType, setArticleType] = useState<ArticleType>(
    articleToEdit?.articleType ?? "Food"
  );
  const [reference, setReference] = useState(articleToEdit?.reference ?? "");
  const [name, setName] = useState(articleToEdit?.name ?? "");
  const [priceExcludingTax, setPriceExcludingTax] = useState(
    articleToEdit?.priceExcludingTax ?? 0
  );
  const [expiryDate, setExpiryDate] = useState(
    isEditMode && articleToEdit.articleType === "Food"
      ? (articleToEdit as FoodArticle).expiryDate.split("T")[0]
      : ""
  );
  const [saleType, setSaleType] = useState<SaleType>(
    isEditMode && articleToEdit.articleType === "Food"
      ? (articleToEdit as FoodArticle).saleType
      : "OnSite"
  );
  const [packagingLevel, setPackagingLevel] = useState<PackagingLevel>(
    isEditMode && articleToEdit.articleType === "NonFood"
      ? (articleToEdit as NonFoodArticle).packagingLevel
      : "New"
  );

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (articleType === "Food") {
        if (isEditMode) {
          await updateFoodArticle(articleToEdit.id, {
            name,
            priceExcludingTax,
            expiryDate: new Date(expiryDate).toISOString(),
            saleType,
          });
        } else {
          await createFoodArticle({
            reference,
            name,
            priceExcludingTax,
            expiryDate: new Date(expiryDate).toISOString(),
            saleType,
          });
        }
      } else {
        if (isEditMode) {
          await updateNonFoodArticle(articleToEdit.id, {
            name,
            priceExcludingTax,
            packagingLevel,
          });
        } else {
          await createNonFoodArticle({
            reference,
            name,
            priceExcludingTax,
            packagingLevel,
          });
        }
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
      {error && (
        <div className="bg-red-100 text-red-800 text-sm p-2 rounded">{error}</div>
      )}

      {!isEditMode && (
        <div className="flex gap-2">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              checked={articleType === "Food"}
              onChange={() => setArticleType("Food")}
            />
            Alimentaire
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              checked={articleType === "NonFood"}
              onChange={() => setArticleType("NonFood")}
            />
            Non alimentaire
          </label>
        </div>
      )}

      {!isEditMode && (
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="Référence EAN-13"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
      )}

      <input
        className="border rounded px-3 py-2 text-sm"
        placeholder="Nom de l'article"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border rounded px-3 py-2 text-sm"
        type="number"
        step="0.01"
        placeholder="Prix HT"
        value={priceExcludingTax}
        onChange={(e) => setPriceExcludingTax(parseFloat(e.target.value) || 0)}
      />

      {articleType === "Food" && (
        <>
          <input
            className="border rounded px-3 py-2 text-sm"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 text-sm"
            value={saleType}
            onChange={(e) => setSaleType(e.target.value as SaleType)}
          >
            {SALE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </>
      )}

      {articleType === "NonFood" && (
        <select
          className="border rounded px-3 py-2 text-sm"
          value={packagingLevel}
          onChange={(e) => setPackagingLevel(e.target.value as PackagingLevel)}
        >
          {PACKAGING_LEVELS.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      )}

      <div className="flex gap-2 justify-end mt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "..." : isEditMode ? "Modifier" : "Créer"}
        </Button>
      </div>
    </div>
  );
}