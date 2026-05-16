import Link from "next/link";
import Layout from "~/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ImageUploader from "~/components/ImageUploader";
import Head from "next/head";
import { useRouter } from "next/router";
import { useProperty } from "~/hooks/useProperty";

export default function PropertyDetailPage() {
  const router = useRouter();
  const id = Number(router.query.id);
  const { data: session } = useSession();

  const {
    property,
    isLoading,
    editing,
    setEditing,
    confirmDelete,
    setConfirmDelete,
    activeImage,
    setActiveImage,
    form,
    setForm,
    images,
    setImages,
    handleUpdate,
    updateMutation,
    deleteMutation,
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
  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm";

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

            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              {isOwner && (
                <div className="flex gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>

            <p className="text-2xl font-bold text-blue-600 mb-6">S/ {property.price.toLocaleString()}</p>

            <div className="flex gap-6 text-sm text-gray-600 mb-6 border-y border-gray-100 py-4">
              <span>🛏️ {property.bedrooms} dormitorios</span>
              <span>🛁 {property.bathrooms} baños</span>
              <span>📐 {property.area} m²</span>
            </div>

            <p className="text-gray-700 leading-relaxed">{property.description}</p>

            {property.user && (
              <p className="text-xs text-gray-400 mt-6">
                Publicado por {property.user.name ?? property.user.email}
              </p>
            )}
          </>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-5 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900">Editar propiedad</h2>

            {(["title", "description"] as const).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                <input
                  className={inputClass}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
              <input type="number" className={inputClass} value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {(["bedrooms", "bathrooms", "area"] as const).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                  <input type="number" className={inputClass} value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} required />
                </div>
              ))}
            </div>

            <ImageUploader images={images} onChange={setImages} folder={String(id)} />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar propiedad?</h3>
              <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => deleteMutation.mutate({ id })}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors text-sm"
                >
                  {deleteMutation.isPending ? "Eliminando..." : "Sí, eliminar"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
