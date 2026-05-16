import Link from "next/link";
import Layout from "~/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ImageUploader from "~/components/ImageUploader";
import Head from "next/head";
import { useRouter } from "next/router";
import { useProperty } from "~/hooks/useProperty";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Card from "~/components/ui/Card";

export default function PropertyDetailPage() {
  const router = useRouter();
  const id = Number(router.query.id);
  const { data: session } = useSession();

  const {
    property, isLoading, editing, setEditing,
    confirmDelete, setConfirmDelete, activeImage, setActiveImage,
    form, setForm, images, setImages, handleUpdate,
    updateMutation, deleteMutation,
  } = useProperty(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto animate-pulse space-y-4">
          <div className="h-72 bg-gray-200 rounded-xl" />
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
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

  const isOwner = session?.user?.id === String(property.userId);

  return (
    <Layout>
      <Head>
        <title>{property.title} | Plataforma Inmobiliaria</title>
        <meta name="description" content={property.description.slice(0, 155)} />
      </Head>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          ← Volver al listado
        </Link>

        {!editing ? (
          <>
            {/* Galería */}
            {property.images && property.images.length > 0 ? (
              <div className="mb-6">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100 mb-2">
                  <Image
                    src={property.images[activeImage]!}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority
                  />
                </div>
                {property.images.length > 1 && (
                  <div className="flex gap-2">
                    {property.images.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          activeImage === i ? "border-blue-500" : "border-transparent"
                        }`}
                      >
                        <Image src={url} alt={`Miniatura ${i + 1}`} fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                <span className="text-gray-400 text-sm">Sin imágenes</span>
              </div>
            )}

            {/* Título y acciones */}
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              {isOwner && (
                <div className="flex gap-2 ml-4 shrink-0">
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                    Eliminar
                  </Button>
                </div>
              )}
            </div>

            {/* Precio */}
            <p className="text-2xl font-bold text-blue-600 mb-5">
              S/ {property.price.toLocaleString()}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: "🛏️", label: "Dormitorios", value: property.bedrooms },
                { icon: "🛁", label: "Baños", value: property.bathrooms },
                { icon: "📐", label: "Área", value: `${property.area} m²` },
              ].map((s) => (
                <Card key={s.label} padding="sm" className="text-center">
                  <p className="text-xl">{s.icon}</p>
                  <p className="text-lg font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Descripción */}
            <Card padding="md" className="mb-4">
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </Card>

            {property.user && (
              <p className="text-xs text-gray-400">
                Publicado por {property.user.name ?? property.user.email}
              </p>
            )}
          </>
        ) : (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Editar propiedad</h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              <Input
                label="Título"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
              <Input
                label="Descripción"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />
              <Input
                label="Precio (S/)"
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Características</p>
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Dormitorios" type="number" value={form.bedrooms}
                    onChange={(e) => setForm((f) => ({ ...f, bedrooms: e.target.value }))} required />
                  <Input label="Baños" type="number" value={form.bathrooms}
                    onChange={(e) => setForm((f) => ({ ...f, bathrooms: e.target.value }))} required />
                  <Input label="Área (m²)" type="number" value={form.area}
                    onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} required />
                </div>
              </div>

              <ImageUploader images={images} onChange={setImages} folder={String(id)} />

              <div className="flex gap-3">
                <Button type="submit" fullWidth loading={updateMutation.isPending}>
                  Guardar cambios
                </Button>
                <Button type="button" variant="outline" fullWidth onClick={() => setEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Modal eliminar */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar propiedad?</h3>
              <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  fullWidth
                  loading={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate({ id })}
                >
                  Sí, eliminar
                </Button>
                <Button variant="outline" fullWidth onClick={() => setConfirmDelete(false)}>
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
