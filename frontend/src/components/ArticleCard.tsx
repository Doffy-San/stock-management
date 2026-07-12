import type { Article, FoodArticle, NonFoodArticle } from "../types/article";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

interface ArticleCardProps {
  article: Article;
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
  onDelete,
  onSupply,
  onInventory,
  onViewHistory,
}: ArticleCardProps) {
  const stockColor = article.currentStock > 0 ? "green" : "red";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">{article.name}</h3>
          <p className="text-sm text-gray-500">{article.reference}</p>
        </div>
        <Badge
          label={article.articleType === "Food" ? "Alimentaire" : "Non alimentaire"}
          color={article.articleType === "Food" ? "blue" : "orange"}
        />
      </div>

      <div className="flex gap-4 text-sm text-gray-700">
        <span>HT : {article.priceExcludingTax.toFixed(2)} €</span>
        <span>TTC : {article.priceIncludingTax.toFixed(2)} €</span>
        <span>TVA : {article.vatRate} %</span>
      </div>

      {isFoodArticle(article) && (
        <div className="flex gap-2 text-sm text-gray-600">
          <Badge label={`DLC : ${new Date(article.expiryDate).toLocaleDateString("fr-FR")}`} color="gray" />
          <Badge label={article.saleType} color="gray" />
        </div>
      )}

      {isNonFoodArticle(article) && (
        <div className="text-sm text-gray-600">
          <Badge label={article.packagingLevel} color="gray" />
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Stock vendable :</span>
        <Badge label={`${article.currentStock}`} color={stockColor} />
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <Button variant="primary" onClick={() => onSupply(article)}>
          Approvisionner
        </Button>
        <Button variant="secondary" onClick={() => onInventory(article)}>
          Inventaire
        </Button>
        <Button variant="secondary" onClick={() => onViewHistory(article)}>
          Historique
        </Button>
        <Button variant="danger" onClick={() => onDelete(article.id)}>
          Supprimer
        </Button>
      </div>
    </div>
  );
}