import { useState, useMemo } from "react";

export type SortDirection = "asc" | "desc";

interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export function useSortableData<T>(items: T[], initialKey: keyof T) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: initialKey,
    direction: "asc",
  });

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [items, sortConfig]);

  const requestSort = (key: keyof T) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  return { sortedItems, requestSort, sortConfig };
}