import { useState } from "react";
import type {
  Article,
  FoodArticle,
  NonFoodArticle,
  ArticleType,
  SaleType,
  PackagingLevel,
  UnitOfMeasure,
} from "../types/article";
import {
  createFoodArticle,
  createNonFoodArticle,
  updateFoodArticle,
  updateNonFoodArticle,
} from "../api/articleApi";
import { saleTypeLabels, packagingLevelLabels, unitLabels } from "../utils/labels";
import { Button } from "./ui/Button";

interface ArticleFormProps {
  articleToEdit?: Article;
  onSuccess: () => void;
  onCancel: () => void;
}

const SALE_TYPES: SaleType[] = ["OnSite", "Takeaway", "Both"];
const PACKAGING_LEVELS: PackagingLevel[] = ["New", "Refurbished", "Unsellable"];
const UNITS: UnitOfMeasure[] = ["Piece", "Kilogram", "Liter"];

const inputClass =
  "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const labelClass = "text-sm font-medium text-gray-700 mb-1";

export function ArticleForm({ articleToEdit, onSuccess, onCancel }: ArticleFormProps) {
  const isEditMode = articleToEdit !== undefined;

  const [articleType, setArticleType] = useState<ArticleType>(
    articleToEdit?.articleType ?? "Food"
  );
  const [reference, setReference] = useState(articleToEdit?.reference ?? "");
  const [name, setName] = useState(articleToEdit?.name ?? "");
  const [priceExcludingTax, setPriceExcludingTax] = useState(
    articleToEdit?.priceExcludingTax !== undefined
      ? String(articleToEdit.priceExcludingTax)
      : ""
  );
  const [unit, setUnit] = useState<UnitOfMeasure>(articleToEdit?.unit ?? "Piece");
  const [expiryDate, setExpiryDate] = useState(() => {
    if (isEditMode && articleToEdit.articleType === "Food") {
      const food = articleToEdit as FoodArticle;
      if (food.expiryDate) {
        const date = new Date(food.expiryDate);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0];
        }
      }
    }
    return "";
  });
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

  const validate = (): string | null => {
    if (!name.trim()) {
      return "Le nom de l'article est obligatoire.";
    }
    if (!isEditMode && !reference.trim()) {
      return "La référence EAN-13 est obligatoire.";
    }
    if (!isEditMode && !/^\d{13}$/.test(reference.trim())) {
      return "La référence doit contenir exactement 13 chiffres.";
    }
    const price = parseFloat(priceExcludingTax);
    if (isNaN(price) || price < 0) {
      return "Le prix HT doit être un nombre positif.";
    }
    if (articleType === "Food") {
      if (!expiryDate) {
        return "La date limite de consommation est obligatoire.";
      }
      const parsedDate = new Date(expiryDate);
      if (isNaN(parsedDate.getTime())) {
        return "La date limite de consommation est invalide.";
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    const price = parseFloat(priceExcludingTax);

    try {
      if (articleType === "Food") {
        if (isEditMode) {
          await updateFoodArticle(articleToEdit.id, {
            name,
            priceExcludingTax: price,
            expiryDate: new Date(expiryDate).toISOString(),
            saleType,
          });
        } else {
          await createFoodArticle({
            reference,
            name,
            priceExcludingTax: price,
            unit,
            expiryDate: new Date(expiryDate).toISOString(),
            saleType,
          });
        }
      } else {
        if (isEditMode) {
          await updateNonFoodArticle(articleToEdit.id, {
            name,
            priceExcludingTax: price,
            packagingLevel,
          });
        } else {
          await createNonFoodArticle({
            reference,
            name,
            priceExcludingTax: price,
            unit,
            packagingLevel,
          });
        }
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      {!isEditMode && (
        <div className="flex gap-4 bg-gray-50 p-3 rounded-md">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              className="accent-blue-600"
              checked={articleType === "Food"}
              onChange={() => setArticleType("Food")}
            />
            Alimentaire
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              className="accent-blue-600"
              checked={articleType === "NonFood"}
              onChange={() => setArticleType("NonFood")}
            />
            Non alimentaire
          </label>
        </div>
      )}

      {!isEditMode && (
        <div className="flex flex-col">
          <label className={labelClass}>Référence (EAN-13)</label>
          <input
            className={inputClass}
            placeholder="Ex : 3017620422003"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>
      )}

      <div className="flex flex-col">
        <label className={labelClass}>Nom de l'article</label>
        <input
          className={inputClass}
          placeholder="Ex : Nutella 400g"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelClass}>Prix HT (€)</label>
        <input
          className={inputClass}
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={priceExcludingTax}
          onChange={(e) => setPriceExcludingTax(e.target.value)}
        />
      </div>

      {!isEditMode && (
        <div className="flex flex-col">
          <label className={labelClass}>Unité de mesure du stock</label>
          <select
            className={inputClass}
            value={unit}
            onChange={(e) => setUnit(e.target.value as UnitOfMeasure)}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {unitLabels[u]}
              </option>
            ))}
          </select>
        </div>
      )}

      {articleType === "Food" && (
        <>
          <div className="flex flex-col">
            <label className={labelClass}>Date limite de consommation</label>
            <input
              className={inputClass}
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className={labelClass}>Type de vente</label>
            <select
              className={inputClass}
              value={saleType}
              onChange={(e) => setSaleType(e.target.value as SaleType)}
            >
              {SALE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {saleTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {articleType === "NonFood" && (
        <div className="flex flex-col">
          <label className={labelClass}>Niveau de packaging</label>
          <select
            className={inputClass}
            value={packagingLevel}
            onChange={(e) => setPackagingLevel(e.target.value as PackagingLevel)}
          >
            {PACKAGING_LEVELS.map((level) => (
              <option key={level} value={level}>
                {packagingLevelLabels[level]}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-2 justify-end mt-2 pt-3 border-t border-gray-100">
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