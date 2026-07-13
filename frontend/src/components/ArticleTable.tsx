import { useNavigate } from "react-router-dom";
import type { Article, FoodArticle, NonFoodArticle } from "../types/article";
import { useSortableData } from "../hooks/useSortableData";
import { saleTypeLabels, packagingLevelLabels } from "../utils/labels";
import {
  formatDate,
  formatPrice,
  formatQuantity,
  isExpired,
  isExpiringSoon,
} from "../utils/formatters";
import { Badge } from "./ui/Badge";
import {
  PackagePlus,
  PackageMinus,
  ClipboardList,
  History,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";

interface ArticleTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onSupply: (article: Article) => void;
  onInventory: (article: Article) => void;
  onRelease: (article: Article) => void;
}

function isFoodArticle(article: Article): article is FoodArticle {
  return article.articleType === "Food";
}

function isNonFoodArticle(article: Article): article is NonFoodArticle {
  return article.articleType === "NonFood";
}

function getArticleDetail(article: Article): string {
  if (isFoodArticle(article)) {
    return `DLC : ${formatDate(article.expiryDate)} · ${saleTypeLabels[article.saleType]}`;
  }
  if (isNonFoodArticle(article)) {
    return packagingLevelLabels[article.packagingLevel];
  }
  return "";
}

export function ArticleTable({
  articles,
  onEdit,
  onDelete,
  onSupply,
  onInventory,
  onRelease,
}: ArticleTableProps) {
  const navigate = useNavigate();
  const { sortedItems, requestSort, sortConfig } = useSortableData<Article>(
    articles,
    "name",
  );

  const renderSortIcon = (key: keyof Article) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="inline ml-1" />
    ) : (
      <ArrowDown size={14} className="inline ml-1" />
    );
  };

  const sortableHeader =
    "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition";
  const staticHeader =
    "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider";

  const actionButton =
    "flex items-center gap-1 px-2 py-1 text-xs rounded transition whitespace-nowrap";

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Aucun article ne correspond à votre recherche.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className={sortableHeader}
                onClick={() => requestSort("name")}
              >
                Article {renderSortIcon("name")}
              </th>
              <th
                className={sortableHeader}
                onClick={() => requestSort("articleType")}
              >
                Type {renderSortIcon("articleType")}
              </th>
              <th
                className={sortableHeader}
                onClick={() => requestSort("priceIncludingTax")}
              >
                Prix TTC {renderSortIcon("priceIncludingTax")}
              </th>
              <th
                className={sortableHeader}
                onClick={() => requestSort("currentStock")}
              >
                Stock {renderSortIcon("currentStock")}
              </th>
              <th className={staticHeader}>Détails</th>
              <th className={`${staticHeader} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedItems.map((article) => {
              const outOfStock = article.currentStock <= 0;
              const lowStock =
                article.currentStock > 0 && article.currentStock < 10;
              const expired =
                isFoodArticle(article) && isExpired(article.expiryDate);
              const expiringSoon =
                isFoodArticle(article) && isExpiringSoon(article.expiryDate);

              const rowClass = expired
                ? "bg-red-50"
                : outOfStock
                  ? "bg-orange-50"
                  : "hover:bg-gray-50";

              const stockColor = outOfStock
                ? "red"
                : lowStock
                  ? "orange"
                  : "green";

              return (
                <tr key={article.id} className={`${rowClass} transition`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {article.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {article.reference}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={
                        article.articleType === "Food"
                          ? "Alimentaire"
                          : "Non alim."
                      }
                      color={article.articleType === "Food" ? "blue" : "orange"}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div>{formatPrice(article.priceIncludingTax)}</div>
                    <div className="text-xs text-gray-400">
                      HT {formatPrice(article.priceExcludingTax)} ·{" "}
                      {article.vatRate}%
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        label={formatQuantity(
                          article.currentStock,
                          article.unit,
                        )}
                        color={stockColor}
                      />
                      {outOfStock && (
                        <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                          <AlertTriangle size={14} /> Rupture
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <span
                      className={
                        expired
                          ? "text-red-600 font-medium"
                          : expiringSoon
                            ? "text-orange-600"
                            : ""
                      }
                    >
                      {getArticleDetail(article)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <button
                        onClick={() => onSupply(article)}
                        className={`${actionButton} text-blue-700 hover:bg-blue-50`}
                      >
                        <PackagePlus size={14} /> Approvisionner
                      </button>
                      <button
                        onClick={() => onRelease(article)}
                        className={`${actionButton} text-orange-700 hover:bg-orange-50`}
                      >
                        <PackageMinus size={14} /> Sortie
                      </button>
                      <button
                        onClick={() => onInventory(article)}
                        className={`${actionButton} text-gray-700 hover:bg-gray-100`}
                      >
                        <ClipboardList size={14} /> Inventaire
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/articles/${article.id}/history`)
                        }
                        className={`${actionButton} text-gray-700 hover:bg-gray-100`}
                      >
                        <History size={14} /> Historique
                      </button>
                      <button
                        onClick={() => onEdit(article)}
                        className={`${actionButton} text-gray-700 hover:bg-gray-100`}
                      >
                        <Pencil size={14} /> Modifier
                      </button>
                      <button
                        onClick={() => onDelete(article.id)}
                        className={`${actionButton} text-red-600 hover:bg-red-50`}
                      >
                        <Trash2 size={14} /> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
