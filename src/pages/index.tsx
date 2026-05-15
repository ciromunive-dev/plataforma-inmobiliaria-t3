import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const { data: properties, isLoading } = api.property.getAll.useQuery();

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {session ? `Bienvenido, ${session.user?.name || session.user?.email}` : "Bienvenido"}
        </h1>
        <p className="text-gray-500 mt-1">
          Explora las propiedades disponibles en nuestra plataforma
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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

      {!isLoading && properties?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No hay propiedades registradas aún.</p>
        </div>
      )}

      {!isLoading && properties && properties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow block"
            >
              {/* Imagen principal */}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {property.description}
                </p>
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
      )}
    </Layout>
  );
}
