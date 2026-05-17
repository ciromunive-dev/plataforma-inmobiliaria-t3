import { describe, it, expect } from "vitest";

type Filters = {
  search: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
};

const initialFilters: Filters = { search: "", minPrice: "", maxPrice: "", bedrooms: "" };

function getActiveFilterCount(filters: Filters): number {
  return Object.values(filters).filter(Boolean).length;
}

function clearFilters(): Filters {
  return { ...initialFilters };
}

describe("activeFilterCount", () => {
  it("retorna 0 sin filtros activos", () => {
    expect(getActiveFilterCount(initialFilters)).toBe(0);
  });

  it("retorna 1 con solo search activo", () => {
    expect(getActiveFilterCount({ ...initialFilters, search: "casa" })).toBe(1);
  });

  it("retorna 2 con search y minPrice activos", () => {
    expect(getActiveFilterCount({ ...initialFilters, search: "casa", minPrice: "100000" })).toBe(2);
  });

  it("retorna 4 con todos los filtros activos", () => {
    expect(getActiveFilterCount({ search: "casa", minPrice: "100000", maxPrice: "500000", bedrooms: "3" })).toBe(4);
  });

  it("no cuenta string vacío como filtro activo", () => {
    expect(getActiveFilterCount({ ...initialFilters, search: "" })).toBe(0);
  });
});

describe("clearFilters", () => {
  it("retorna todos los filtros vacíos", () => {
    const result = clearFilters();
    expect(result).toEqual(initialFilters);
  });

  it("resetea filtros que tenían valores", () => {
    const result = clearFilters();
    expect(getActiveFilterCount(result)).toBe(0);
  });
});
