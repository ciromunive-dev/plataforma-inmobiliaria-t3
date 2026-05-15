import { describe, it, expect } from "vitest";

// Lógica de filtros (la misma que usa index.tsx)
type Property = {
  id: number;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
};

function filterProperties(properties: Property[], filters: {
  search: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}) {
  return properties.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false;
    return true;
  });
}

const mockProperties: Property[] = [
  { id: 1, title: "Casa en Miraflores", description: "Hermosa casa con jardín", price: 450000, bedrooms: 3, bathrooms: 2, area: 150, images: [] },
  { id: 2, title: "Departamento en San Isidro", description: "Moderno depa con vista", price: 280000, bedrooms: 2, bathrooms: 1, area: 80, images: [] },
  { id: 3, title: "Casa en Surco", description: "Casa amplia con piscina", price: 600000, bedrooms: 4, bathrooms: 3, area: 200, images: [] },
];

describe("filterProperties", () => {
  it("retorna todas las propiedades sin filtros", () => {
    const result = filterProperties(mockProperties, { search: "", minPrice: "", maxPrice: "", bedrooms: "" });
    expect(result).toHaveLength(3);
  });

  it("filtra por texto en el título", () => {
    const result = filterProperties(mockProperties, { search: "miraflores", minPrice: "", maxPrice: "", bedrooms: "" });
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Casa en Miraflores");
  });

  it("filtra por texto en la descripción", () => {
    const result = filterProperties(mockProperties, { search: "piscina", minPrice: "", maxPrice: "", bedrooms: "" });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(3);
  });

  it("filtra por precio mínimo", () => {
    const result = filterProperties(mockProperties, { search: "", minPrice: "400000", maxPrice: "", bedrooms: "" });
    expect(result).toHaveLength(2);
  });

  it("filtra por precio máximo", () => {
    const result = filterProperties(mockProperties, { search: "", minPrice: "", maxPrice: "300000", bedrooms: "" });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(2);
  });

  it("filtra por rango de precio", () => {
    const result = filterProperties(mockProperties, { search: "", minPrice: "300000", maxPrice: "500000", bedrooms: "" });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(1);
  });

  it("filtra por dormitorios mínimos", () => {
    const result = filterProperties(mockProperties, { search: "", minPrice: "", maxPrice: "", bedrooms: "3" });
    expect(result).toHaveLength(2);
  });

  it("combina múltiples filtros", () => {
    const result = filterProperties(mockProperties, { search: "casa", minPrice: "400000", maxPrice: "", bedrooms: "3" });
    expect(result).toHaveLength(2);
  });

  it("retorna vacío si no hay coincidencias", () => {
    const result = filterProperties(mockProperties, { search: "penthouse", minPrice: "", maxPrice: "", bedrooms: "" });
    expect(result).toHaveLength(0);
  });
});
