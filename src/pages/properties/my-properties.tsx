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
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-24 animate-pulse" />
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

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis propiedades</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {myProperties.length} {myProperties.length === 1 ? "publicación" : "publicaciones"}
          </p>
        </div>
        <Link href="/properties/new">
          <Button variant="primary">+ Nueva propiedad</Button>
        </Link>
      </div>

      {myProperties.length === 0 ? (
        <Card className="py-20 text-center">
          <p className="text-gray-400 mb-4">Aún no has publicado ninguna propiedad.</p>
          <Link href="/properties/new" className="text-blue-600 hover:underline text-sm">
            Publicar mi primera propiedad
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {myProperties.map((property) => (
            <Card key={property.id} padding="sm" className="flex overflow-hidden hover:shadow-sm transition-shadow">
              <div className="relative w-32 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {property.images?.[0] ? (
                  <Image src={property.images[0]} alt={property.title} fill className="object-cover" sizes="128px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Sin foto</span>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 flex items-center justify-between min-w-0">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{property.description}</p>
                  <div className="flex gap-3 text-xs text-gray-400 mt-2">
                    <span>🛏 {property.bedrooms}</span>
                    <span>🛁 {property.bathrooms}</span>
                    <span>📐 {property.area} m²</span>
                    <span className="text-blue-600 font-semibold">S/ {property.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4 shrink-0">
                  <Link href={`/properties/${property.id}`}>
                    <Button variant="outline">Ver / Editar</Button>
                  </Link>
                  <Button
                    variant="danger"
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
