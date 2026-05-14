import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";

export default function PropertyDetailPage() {
  const router = useRouter();
  const id = Number(router.query.id);

  const { data: property, isLoading } = api.property.getById.useQuery(
    { id },
    { enabled: !!id },
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Propiedad no encontrada.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Volver al inicio
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          ← Volver al listado
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>

        <p className="text-2xl font-bold text-blue-600 mb-6">
          S/ {property.price.toLocaleString()}
        </p>

        <div className="flex gap-6 text-sm text-gray-600 mb-6 border-y border-gray-100 py-4">
          <span>🛏️ {property.bedrooms} dormitorios</span>
          <span>🛁 {property.bathrooms} baños</span>
          <span>📐 {property.area} m²</span>
        </div>

        <p className="text-gray-700 leading-relaxed">{property.description}</p>
      </div>
    </Layout>
  );
}
