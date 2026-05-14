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
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && properties && properties.length === 0 && (
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
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow block"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
