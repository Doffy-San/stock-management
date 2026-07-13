import { useState, useMemo } from "react";
import type { Article, ArticleType, FoodArticle } from "../types/article";
import { isExpired } from "../utils/formatters";

export type StatusFilter = "all" | "outOfStock" | "expired";
export type TypeFilter = "all" | "Food" | "NonFood";

function isFoodArticle(article: Article): article is FoodArticle {
  return article.articleType === "Food";
}

export function useArticleFilters(articles: Article[]) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Filtre recherche (nom ou référence)
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        article.name.toLowerCase().includes(query) ||
        article.reference.toLowerCase().includes(query);

      // Filtre type
      const matchesType =
        typeFilter === "all" || article.articleType === typeFilter;

      // Filtre statut
      let matchesStatus = true;
      if (statusFilter === "outOfStock") {
        matchesStatus = article.currentStock <= 0;
      } else if (statusFilter === "expired") {
        matchesStatus = isFoodArticle(article) && isExpired(article.expiryDate);
      }

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [articles, search, typeFilter, statusFilter]);

  return {
    filteredArticles,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
  };
}