import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Link from "next/link";
import { useState, useMemo } from "react";

type Filters = {
  search: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
};

const initialFilters: Filters = { search: "", minPrice: "", maxPrice: "", bedrooms: "" };

export default function Home() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

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

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const isFiltering = activeFilterCount > 0;

  const set = (key: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((f) => ({ ...f, [key]: e.target.value }));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {session ? `Bienvenido, ${session.user?.name || session.user?.email}` : "Bienvenido"}
        </h1>
        <p className="text-gray-500 mt-1">Explora las propiedades disponibles en nuestra plataforma</p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={filters.search}
            onChange={set("search")}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {isFiltering && (
            <button
              onClick={() => { setFilters(initialFilters); setPage(1); }}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Precio mínimo (S/)</label>
              <input type="number" placeholder="0" value={filters.minPrice} onChange={set("minPrice")} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Precio máximo (S/)</label>
              <input type="number" placeholder="Sin límite" value={filters.maxPrice} onChange={set("maxPrice")} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Dormitorios mínimos</label>
              <select value={filters.bedrooms} onChange={set("bedrooms")} className={inputClass}>
                <option value="">Cualquiera</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Resultados */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20">
          {isFiltering ? (
            <>
              <p className="text-gray-400 text-lg">No hay propiedades que coincidan con los filtros.</p>
              <button
                onClick={() => { setFilters(initialFilters); setPage(1); }}
                className="text-blue-600 hover:underline mt-3 inline-block text-sm"
              >
                Limpiar filtros
              </button>
            </>
          ) : (
            <p className="text-gray-400 text-lg">No hay propiedades registradas aún.</p>
          )}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <>
          {isFiltering && (
            <p className="text-sm text-gray-500 mb-4">
              {filtered.length} {filtered.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow block"
              >
                <div className="h-48 bg-gray-100 overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "https://placehold.co/400x200?text=Sin+imagen")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Sin imágenes</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{property.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{property.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-blue-600">
                      S/ {property.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>🛏️ {property.bedrooms} dorm.</span>
                    <span>🛁 {property.bathrooms} baños</span>
                    <span>📐 {property.area} m²</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Paginación */}
          {!isFiltering && data && data.pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>

              {Array.from({ length: data.pageCount }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    p === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data.pageCount}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
