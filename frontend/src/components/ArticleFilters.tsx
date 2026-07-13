import type { TypeFilter, StatusFilter } from "../hooks/useArticleFilters";
import { Search, X } from "lucide-react";

interface ArticleFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (value: TypeFilter) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  resultCount: number;
  totalCount: number;
}

const selectClass =
  "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

export function ArticleFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  resultCount,
  totalCount,
}: ArticleFiltersProps) {
  const hasActiveFilters =
    search !== "" || typeFilter !== "all" || statusFilter !== "all";

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Rechercher par nom ou référence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <select
          className={selectClass}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
        >
          <option value="all">Tous les types</option>
          <option value="Food">Alimentaire</option>
          <option value="NonFood">Non alimentaire</option>
        </select>

        <select
          className={selectClass}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="all">Tous les statuts</option>
          <option value="outOfStock">En rupture</option>
          <option value="expired">Périmés</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition whitespace-nowrap"
          >
            <X size={16} /> Réinitialiser
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <p className="text-xs text-gray-500 mt-3">
          {resultCount} article{resultCount > 1 ? "s" : ""} sur {totalCount}
        </p>
      )}
    </div>
  );
}