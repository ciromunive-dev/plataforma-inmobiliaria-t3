import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function PropertyDetailPage() {
  const router = useRouter();
  const id = Number(router.query.id);
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", price: "", bedrooms: "", bathrooms: "", area: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [formError, setFormError] = useState("");

  const { data: property, isLoading } = api.property.getById.useQuery(
    { id },
    { enabled: !!id },
  );

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        description: property.description,
        price: String(property.price),
        bedrooms: String(property.bedrooms),
        bathrooms: String(property.bathrooms),
        area: String(property.area),
      });
      setImages(property.images ?? []);
      setActiveImage(0);
    }
  }, [property]);

  const utils = api.useUtils();

  const updateMutation = api.property.update.useMutation({
    onSuccess: async () => {
      await utils.property.getById.invalidate({ id });
      setEditing(false);
    },
  });

  const deleteMutation = api.property.delete.useMutation({
    onSuccess: () => void router.push("/"),
  });

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

  const addImage = () => {
    const url = imageUrl.trim();
    if (!url) return;
    if (images.length >= 6) { setFormError("Máximo 6 imágenes."); return; }
    try { new URL(url); } catch { setFormError("URL de imagen no válida."); return; }
    setImages((prev) => [...prev, url]);
    setImageUrl("");
    setFormError("");
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      images,
    });
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm";

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          ← Volver al listado
        </Link>

        {!editing ? (
          <>
            {/* Galería */}
            {property.images && property.images.length > 0 ? (
              <div className="mb-6">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 mb-2">
                  <img
                    src={property.images[activeImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/800x450?text=Sin+imagen")}
                  />
                </div>
                {property.images.length > 1 && (
                  <div className="flex gap-2">
                    {property.images.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          activeImage === i ? "border-blue-500" : "border-transparent"
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Miniatura ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = "https://placehold.co/64x64?text=X")}
                        />
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

            <p className="text-2xl font-bold text-blue-600 mb-6">
              S/ {property.price.toLocaleString()}
            </p>

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

            {/* Imágenes en edición */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imágenes <span className="text-gray-400 font-normal">({images.length}/6)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={addImage}
                  disabled={images.length >= 6}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  Agregar
                </button>
              </div>

              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {images.map((url, i) => (
                    <div key={i} className="relative group aspect-video">
                      <img
                        src={url}
                        alt={`Imagen ${i + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                        onError={(e) => (e.currentTarget.src = "https://placehold.co/300x200?text=Error")}
                      />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formError && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-200">
                {formError}
              </div>
            )}

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
