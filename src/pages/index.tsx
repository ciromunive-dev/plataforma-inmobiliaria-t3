import { useSession } from "next-auth/react";
import { useState } from "react";
import Layout from "~/components/Layout";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useProperties } from "~/hooks/useProperties";
import Button from "~/components/ui/Button";

type ViewMode = "grid" | "list";

export default function Home() {
  const { data: session } = useSession();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const {
    data, isLoading, filtered, filters, setFilter,
    clearFilters, activeFilterCount, isFiltering, page, setPage,
  } = useProperties();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white";

  const avgPrice = data?.items?.length
    ? Math.round(data.items.reduce((acc, p) => acc + p.price, 0) / data.items.length)
    : 0;

  return (
    <Layout>
      <Head>
        <title>Propiedades | Plataforma Inmobiliaria</title>
        <meta name="description" content="Explora propiedades en venta. Filtra por precio, dormitorios y más." />
      </Head>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {session ? `Bienvenido, ${session.user?.name ?? session.user?.email}` : "Propiedades disponibles"}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Explora y filtra las propiedades publicadas</p>
      </div>

      {!isLoading && data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total propiedades", value: data.total },
            { label: "En esta página", value: data.items.length },
            { label: "Precio promedio", value: `S/ ${avgPrice.toLocaleString()}` },
            { label: "Páginas", value: data.pageCount },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-3 mb-5 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={filters.search}
            onChange={setFilter("search")}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <Button
            variant={showFilters || activeFilterCount > 0 ? "primary" : "outline"}
            onClick={() => setShowFilters((v) => !v)}
          >
            ⚙ Filtros
            {activeFilterCount > 0 && (
              <span className="bg-white text-blue-600 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {isFiltering && (
            <Button variant="outline" onClick={clearFilters}>Limpiar</Button>
          )}

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 text-sm transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
              aria-label="Vista en grilla"
            >⊞</button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 text-sm border-l border-gray-300 transition-colors ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
              aria-label="Vista en lista"
            >☰</button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Precio mínimo (S/)</label>
              <input type="number" placeholder="0" value={filters.minPrice} onChange={setFilter("minPrice")} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Precio máximo (S/)</label>
              <input type="number" placeholder="Sin límite" value={filters.maxPrice} onChange={setFilter("maxPrice")} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Dormitorios mínimos</label>
              <select value={filters.bedrooms} onChange={setFilter("bedrooms")} className={inputClass}>
                <option value="">Cualquiera</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          {isFiltering ? (
            <>
              <p className="text-gray-400">No hay propiedades que coincidan con los filtros.</p>
              <button onClick={clearFilters} className="text-blue-600 hover:underline mt-2 text-sm">Limpiar filtros</button>
            </>
          ) : (
            <p className="text-gray-400">No hay propiedades registradas aún.</p>
          )}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <>
          {isFiltering && (
            <p className="text-xs text-gray-500 mb-3">
              {filtered.length} {filtered.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
            </p>
          )}

          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all block group">
                  <div className="relative h-44 bg-gray-100">
                    {property.images?.[0] ? (
                      <Image src={property.images[0]} alt={property.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Sin imágenes</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <span className="text-white font-bold text-base">S/ {property.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{property.description}</p>
                    <div className="flex gap-3 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                      <span>🛏 {property.bedrooms}</span>
                      <span>🛁 {property.bathrooms}</span>
                      <span>📐 {property.area} m²</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="flex flex-col gap-2">
              {filtered.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-sm hover:border-gray-300 transition-all flex overflow-hidden group">
                  <div className="relative w-36 shrink-0 bg-gray-100">
                    {property.images?.[0] ? (
                      <Image src={property.images[0]} alt={property.title} fill className="object-cover" sizes="144px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin foto</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{property.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>🛏 {property.bedrooms}</span>
                        <span>🛁 {property.bathrooms}</span>
                        <span>📐 {property.area} m²</span>
                      </div>
                      <span className="text-blue-600 font-bold text-sm">S/ {property.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isFiltering && data && data.pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                ← Anterior
              </Button>
              {Array.from({ length: data.pageCount }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 text-sm rounded-lg transition-colors ${p === page ? "bg-blue-600 text-white" : "border border-gray-300 hover:bg-gray-50 text-gray-700"}`}>
                  {p}
                </button>
              ))}
              <Button variant="outline" onClick={() => handlePageChange(page + 1)} disabled={page === data.pageCount}>
                Siguiente →
              </Button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
