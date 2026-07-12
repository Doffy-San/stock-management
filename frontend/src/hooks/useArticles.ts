import { useState, useEffect, useCallback } from "react";
import type { Article } from "../types/article";
import { getArticles } from "../api/articleApi";

interface UseArticlesResult {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useArticles(): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load articles.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { articles, isLoading, error, refresh };
}