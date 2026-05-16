import Layout from "~/components/Layout";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useEffect } from "react";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";

export default function MyPropertiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") void router.push("/auth/login");
  }, [status, router]);

  const { data, isLoading } = api.property.getAll.useQuery(
    { page: 1 },
    { enabled: !!session },
  );

  const utils = api.useUtils();
  const deleteMutation = api.property.delete.useMutation({
    onSuccess: () => utils.property.getAll.invalidate(),
  });

  const myProperties = data?.items.filter(
    (p) => String(p.userId) === session?.user?.id,
  ) ?? [];

  if (status === "loading" || isLoading) {
    return (
      <Layout>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse" />
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Mis propiedades | Plataforma Inmobiliaria</title>
      </Head>

      <div className="flex items-start sm:items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis propiedades</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {myProperties.length} {myProperties.length === 1 ? "publicación" : "publicaciones"}
          </p>
        </div>
        <Link href="/properties/new">
          <Button variant="primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva propiedad
          </Button>
        </Link>
      </div>

      {myProperties.length === 0 ? (
        <Card className="py-16 sm:py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium mb-1">Aún no tienes propiedades</p>
          <p className="text-gray-400 text-sm mb-5">Publica tu primera propiedad y empieza a recibir consultas</p>
          <Link href="/properties/new">
            <Button variant="primary">Publicar propiedad</Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {myProperties.map((property) => (
            <Card key={property.id} padding="none" className="flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="relative w-full h-44 sm:w-36 sm:h-auto shrink-0 bg-gray-50">
                {property.images?.[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 144px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between min-w-0 gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-base">{property.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{property.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
                    <span>🛏 {property.bedrooms} dorm.</span>
                    <span>🛁 {property.bathrooms} baños</span>
                    <span>📐 {property.area} m²</span>
                    <span className="text-blue-600 font-bold">S/ {property.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Link href={`/properties/${property.id}`}>
                    <Button variant="outline" size="sm">Ver / Editar</Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={deleteMutation.isPending}
                    onClick={() => {
                      if (confirm("¿Eliminar esta propiedad?")) {
                        deleteMutation.mutate({ id: property.id });
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
