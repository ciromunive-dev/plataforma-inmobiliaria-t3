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

  const inputClass = "w-full px-3 py-3 sm:py-2.5 border border-gray-200 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none bg-white hover:border-gray-300 transition-colors";

  const avgPrice = data?.items?.length
    ? Math.round(data.items.reduce((acc, p) => acc + p.price, 0) / data.items.length)
    : 0;

  return (
    <Layout>
      <Head>
        <title>Propiedades | Plataforma Inmobiliaria</title>
        <meta name="description" content="Explora propiedades en venta. Filtra por precio, dormitorios y más." />
      </Head>

      {/* Hero para no logueados */}
      {!session && !isLoading && (
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 sm:p-12 mb-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Encuentra tu próximo hogar
            </h1>
            <p className="text-blue-100 text-base sm:text-lg mb-6">
              Explora propiedades disponibles y encuentra la que mejor se adapta a ti.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white !text-blue-700 hover:bg-blue-50 border-0 shadow-lg">
                  Comenzar gratis
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-blue-700">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header logueado */}
      {session && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido, {session.user?.name ?? session.user?.email}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Explora y filtra las propiedades publicadas</p>
        </div>
      )}

      {/* Stats */}
      {!isLoading && data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total propiedades", value: data.total, icon: "🏘️" },
            { label: "En esta página", value: data.items.length, icon: "📄" },
            { label: "Precio promedio", value: `S/ ${avgPrice.toLocaleString()}`, icon: "💰" },
            { label: "Páginas", value: data.pageCount, icon: "📑" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
              <p className="text-lg mb-1">{stat.icon}</p>
              <p className="text-xs text-gray-500 truncate">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3 sm:p-4 mb-6 space-y-3">
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-0 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar propiedades..."
              value={filters.search}
              onChange={setFilter("search")}
              className="w-full pl-9 pr-3 py-3 sm:py-2.5 border border-gray-200 rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none hover:border-gray-300 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters || activeFilterCount > 0 ? "primary" : "outline"}
              onClick={() => setShowFilters((v) => !v)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filtros
              {activeFilterCount > 0 && (
                <span className="bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            {isFiltering && (
              <Button variant="ghost" onClick={clearFilters}>Limpiar</Button>
            )}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`min-h-[44px] px-3 transition-colors ${viewMode === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                aria-label="Vista en grilla"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`min-h-[44px] px-3 border-l border-gray-200 transition-colors ${viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                aria-label="Vista en lista"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
            <div>
              <label htmlFor="filter-min-price" className="block text-xs font-semibold text-gray-600 mb-1.5">Precio mínimo (S/)</label>
              <input id="filter-min-price" type="number" placeholder="0" value={filters.minPrice} onChange={setFilter("minPrice")} className={inputClass} />
            </div>
            <div>
              <label htmlFor="filter-max-price" className="block text-xs font-semibold text-gray-600 mb-1.5">Precio máximo (S/)</label>
              <input id="filter-max-price" type="number" placeholder="Sin límite" value={filters.maxPrice} onChange={setFilter("maxPrice")} className={inputClass} />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="filter-bedrooms" className="block text-xs font-semibold text-gray-600 mb-1.5">Dormitorios mínimos</label>
              <select id="filter-bedrooms" value={filters.bedrooms} onChange={setFilter("bedrooms")} className={inputClass}>
                <option value="">Cualquiera</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Skeletons */}
      {isLoading && (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                <div className="h-3 bg-gray-100 rounded-lg w-full" />
                <div className="h-5 bg-gray-100 rounded-lg w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 sm:py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          {isFiltering ? (
            <>
              <p className="text-gray-500 font-medium">Sin resultados para esos filtros</p>
              <p className="text-gray-400 text-sm mt-1">Intenta con otros parámetros de búsqueda</p>
              <button onClick={clearFilters} className="mt-4 text-blue-600 hover:underline text-sm font-medium">
                Limpiar filtros
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 font-medium">No hay propiedades aún</p>
              <p className="text-gray-400 text-sm mt-1">Sé el primero en publicar una propiedad</p>
            </>
          )}
        </div>
      )}

      {/* Listado */}
      {!isLoading && filtered.length > 0 && (
        <>
          {isFiltering && (
            <p className="text-xs text-gray-500 mb-4 font-medium">
              {filtered.length} {filtered.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
            </p>
          )}

          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-200 block group">
                  <div className="relative h-48 bg-gray-50">
                    {property.images?.[0] ? (
                      <Image src={property.images[0]} alt={property.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-400 text-xs">Sin imágenes</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/95 backdrop-blur-sm text-gray-900 font-bold text-sm px-3 py-1.5 rounded-xl shadow-sm">
                        S/ {property.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate text-base">{property.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{property.description}</p>
                    <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <span>🛏</span> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <span>🛁</span> {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <span>📐</span> {property.area} m²
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="flex flex-col gap-3">
              {filtered.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex overflow-hidden group">
                  <div className="relative w-28 sm:w-40 shrink-0 bg-gray-50">
                    {property.images?.[0] ? (
                      <Image src={property.images[0]} alt={property.title} fill className="object-cover" sizes="160px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{property.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                      <div className="flex gap-3 text-xs text-gray-400">
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
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                ← Anterior
              </Button>
              {Array.from({ length: data.pageCount }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => handlePageChange(p)}
                  className={`w-10 h-10 text-sm rounded-xl font-medium transition-all ${
                    p === page
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  }`}>
                  {p}
                </button>
              ))}
              <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page === data.pageCount}>
                Siguiente →
              </Button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
