import { useState, useMemo } from "react";
import { api } from "~/utils/api";

export type Filters = {
  search: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
};

const initialFilters: Filters = { search: "", minPrice: "", maxPrice: "", bedrooms: "" };

export function useProperties() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const { data, isLoading } = api.property.getAll.useQuery({ page });

  const filtered = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
      if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false;
      return true;
    });
  }, [data?.items, filters]);

  const setFilter = (key: keyof Filters) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFilters((f) => ({ ...f, [key]: e.target.value }));
      setPage(1);
    };

  const clearFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return {
    data,
    isLoading,
    filtered,
    filters,
    setFilter,
    clearFilters,
    activeFilterCount,
    isFiltering: activeFilterCount > 0,
    page,
    setPage,
  };
}
