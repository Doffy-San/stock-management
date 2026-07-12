import type { Article, FoodArticle, NonFoodArticle } from "../types/article";
import {saleTypeLabels, packagingLevelLabels} from "../utils/label";
import {formatPrice, formatDate, isExpired, isExpiringSoon} from "../utils/format";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { PackagePlus, ClipboardList, History, Pencil, Trash2, AlertTriangle } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onSupply: (article: Article) => void;
  onInventory: (article: Article) => void;
  onViewHistory: (article: Article) => void;
}

function isFoodArticle(article: Article): article is FoodArticle {
  return article.articleType === "Food";
}

function isNonFoodArticle(article: Article): article is NonFoodArticle {
  return article.articleType === "NonFood";
}

export function ArticleCard({
  article,
  onEdit,
  onDelete,
  onSupply,
  onInventory,
  onViewHistory,
}: ArticleCardProps) {
  const isOutOfStock = article.currentStock <= 0;
  const stockColor = isOutOfStock ? "red" : article.currentStock < 10 ? "orange" : "green";

  const expired = isFoodArticle(article) && isExpired(article.expiryDate);
  const expiringSoon = isFoodArticle(article) && isExpiringSoon(article.expiryDate);

  const borderClass = expired
    ? "border-red-300"
    : isOutOfStock
    ? "border-orange-200"
    : "border-gray-200";

    console.log("expiryDate reçu:", isFoodArticle(article) ? article.expiryDate : "n/a");

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border ${borderClass} p-4 flex flex-col gap-3 hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{article.name}</h3>
          <p className="text-sm text-gray-500">{article.reference}</p>
        </div>
        <Badge
          label={article.articleType === "Food" ? "Alimentaire" : "Non alimentaire"}
          color={article.articleType === "Food" ? "blue" : "orange"}
        />
      </div>

      {(expired || isOutOfStock) && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 text-xs px-2 py-1 rounded">
          <AlertTriangle size={14} />
          {expired ? "Produit périmé" : "Rupture de stock"}
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
        <span>HT : {formatPrice(article.priceExcludingTax)}</span>
        <span>TTC : {formatPrice(article.priceIncludingTax)}</span>
        <span className="text-gray-500">TVA : {article.vatRate} %</span>
      </div>

      {isFoodArticle(article) && (
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <Badge
            label={`DLC : ${formatDate(article.expiryDate)}`}
            color={expired ? "red" : expiringSoon ? "orange" : "gray"}
          />
          <Badge label={saleTypeLabels[article.saleType]} color="gray" />
        </div>
      )}

      {isNonFoodArticle(article) && (
        <div className="text-sm text-gray-600">
          <Badge label={packagingLevelLabels[article.packagingLevel]} color="gray" />
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <span className="text-sm font-medium text-gray-700">Stock vendable :</span>
        <Badge label={`${article.currentStock}`} color={stockColor} />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-100">
        <Button variant="primary" onClick={() => onSupply(article)}>
          <span className="flex items-center justify-center gap-1">
            <PackagePlus size={16} /> Approvisionner
          </span>
        </Button>
        <Button variant="secondary" onClick={() => onInventory(article)}>
          <span className="flex items-center justify-center gap-1">
            <ClipboardList size={16} /> Inventaire
          </span>
        </Button>
        <Button variant="secondary" onClick={() => onViewHistory(article)}>
          <span className="flex items-center justify-center gap-1">
            <History size={16} /> Historique
          </span>
        </Button>
        <Button variant="secondary" onClick={() => onEdit(article)}>
          <span className="flex items-center justify-center gap-1">
            <Pencil size={16} /> Modifier
          </span>
        </Button>
        <Button variant="danger" onClick={() => onDelete(article.id)} className="col-span-2">
          <span className="flex items-center justify-center gap-1">
            <Trash2 size={16} /> Supprimer
          </span>
        </Button>
      </div>
    </div>
  );
}