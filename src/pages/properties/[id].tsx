import Link from "next/link";
import Layout from "~/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ImageUploader from "~/components/ImageUploader";
import MapView from "~/components/MapView";
import MapPicker from "~/components/MapPicker";
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
          <div className="h-80 bg-gray-100 rounded-2xl" />
          <div className="h-8 bg-gray-100 rounded-xl w-2/3" />
          <div className="h-4 bg-gray-100 rounded-lg w-full" />
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium text-lg">Propiedad no encontrada</p>
          <Link href="/" className="mt-4 inline-flex items-center gap-1.5 text-blue-600 hover:underline text-sm">
            ← Volver al listado
          </Link>
        </div>
      </Layout>
    );
  }

  const isOwner = session?.user?.id === String(property.userId);

  const whatsappUrl = property.phone
    ? `https://wa.me/${property.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, estoy interesado en tu propiedad: ${property.title}`)}`
    : null;

  return (
    <Layout>
      <Head>
        <title>{property.title} | Plataforma Inmobiliaria</title>
        <meta name="description" content={property.description.slice(0, 155)} />
      </Head>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al listado
        </Link>

        {!editing ? (
          <>
            {property.images && property.images.length > 0 ? (
              <div className="mb-6">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 mb-3">
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
                  <div className="flex gap-2 flex-wrap">
                    {property.images.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          activeImage === i ? "border-blue-500 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={url} alt={`Miniatura ${i + 1}`} fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-gray-100 flex flex-col items-center justify-center gap-2 mb-6">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400 text-sm">Sin imágenes</span>
              </div>
            )}

            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{property.title}</h1>
              {isOwner && (
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>Eliminar</Button>
                </div>
              )}
            </div>

            <p className="text-3xl font-bold text-blue-600 mb-6">
              S/ {property.price.toLocaleString()}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
              {[
                { icon: "🛏️", label: "Dormitorios", value: property.bedrooms },
                { icon: "🛁", label: "Baños", value: property.bathrooms },
                { icon: "📐", label: "Área", value: `${property.area} m²` },
              ].map((s) => (
                <Card key={s.label} padding="sm" className="text-center">
                  <p className="text-2xl mb-1">{s.icon}</p>
                  <p className="text-lg font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </Card>
              ))}
            </div>

            <Card padding="md" className="mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </Card>

            {property.latitude && property.longitude && (
              <Card padding="md" className="mb-4">
                <MapView
                  latitude={property.latitude}
                  longitude={property.longitude}
                  address={property.address ?? undefined}
                />
              </Card>
            )}

            {/* Contacto */}
            {!isOwner && whatsappUrl && (
              <Card padding="md" className="mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contactar al vendedor</h2>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button fullWidth size="lg" className="bg-green-500 hover:bg-green-600 border-transparent text-white gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contactar por WhatsApp
                  </Button>
                </a>
              </Card>
            )}

            {property.user && (
              <p className="text-xs text-gray-400 mt-2">
                Publicado por <span className="font-medium text-gray-500">{property.user.name ?? property.user.email}</span>
              </p>
            )}
          </>
        ) : (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Editar propiedad</h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              <Input label="Título" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
              <Input label="Descripción" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
              <Input label="Precio (S/)" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Características</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input label="Dormitorios" type="number" value={form.bedrooms} onChange={(e) => setForm((f) => ({ ...f, bedrooms: e.target.value }))} required />
                  <Input label="Baños" type="number" value={form.bathrooms} onChange={(e) => setForm((f) => ({ ...f, bathrooms: e.target.value }))} required />
                  <Input label="Área (m²)" type="number" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} required />
                </div>
              </div>
              <Input
                label="WhatsApp de contacto"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+51 999 999 999"
                hint="Opcional. Los interesados podrán contactarte por WhatsApp."
              />
              <MapPicker
                latitude={form.latitude ? Number(form.latitude) : undefined}
                longitude={form.longitude ? Number(form.longitude) : undefined}
                address={form.address}
                onChange={(data) => setForm((f) => ({
                  ...f,
                  latitude: String(data.latitude),
                  longitude: String(data.longitude),
                  address: data.address,
                }))}
              />
              <ImageUploader images={images} onChange={setImages} folder={String(id)} />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" fullWidth loading={updateMutation.isPending} size="lg">
                  Guardar cambios
                </Button>
                <Button type="button" variant="outline" fullWidth onClick={() => setEditing(false)} size="lg">
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-sm w-full">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">¿Eliminar propiedad?</h3>
              <p className="text-sm text-gray-400 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="danger" fullWidth loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate({ id })}>
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
