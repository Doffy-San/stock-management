import type { Article } from "../types/article";
import { ArticleCard } from "./ArticleCard";

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onSupply: (article: Article) => void;
  onInventory: (article: Article) => void;
  onViewHistory: (article: Article) => void;
}

export function ArticleList({
  articles,
  onEdit,
  onDelete,
  onSupply,
  onInventory,
  onViewHistory,
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        Aucun article pour le moment. Créez-en un pour commencer.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onEdit={onEdit}
          onDelete={onDelete}
          onSupply={onSupply}
          onInventory={onInventory}
          onViewHistory={onViewHistory}
        />
      ))}
    </div>
  );
}