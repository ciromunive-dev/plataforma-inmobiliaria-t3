import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import ImageUploader from "~/components/ImageUploader";

type FieldErrors = {
  title?: string;
  description?: string;
  price?: string;
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
};

export default function NewPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", description: "", price: "", bedrooms: "", bathrooms: "", area: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");

  const createMutation = api.property.create.useMutation({
    onSuccess: (property) => void router.push(`/properties/${property.id}`),
    onError: (err) => setError(err.message),
  });

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!form.title.trim()) errors.title = "El título es requerido";
    if (!form.description.trim()) errors.description = "La descripción es requerida";
    if (!form.price || Number(form.price) <= 0) errors.price = "Ingresa un precio válido";
    if (!form.bedrooms || Number(form.bedrooms) < 1) errors.bedrooms = "Mínimo 1 dormitorio";
    if (!form.bathrooms || Number(form.bathrooms) < 1) errors.bathrooms = "Mínimo 1 baño";
    if (!form.area || Number(form.area) <= 0) errors.area = "Ingresa un área válida";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    createMutation.mutate({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      images,
    });
  };

  const clearError = (key: keyof FieldErrors) =>
    setFieldErrors((f) => ({ ...f, [key]: undefined }));

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => { setForm((f) => ({ ...f, [key]: e.target.value })); clearError(key); }}
        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${fieldErrors[key] ? "border-red-400 bg-red-50" : "border-gray-300"}`}
      />
      {fieldErrors[key] && <p className="text-red-500 text-xs mt-1">{fieldErrors[key]}</p>}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          ← Volver al listado
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva propiedad</h1>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {field("Título", "title")}
          {field("Descripción", "description")}
          {field("Precio (S/)", "price", "number")}
          <div className="grid grid-cols-3 gap-4">
            {field("Dormitorios", "bedrooms", "number")}
            {field("Baños", "bathrooms", "number")}
            {field("Área (m²)", "area", "number")}
          </div>

          <ImageUploader images={images} onChange={setImages} folder="temp" />

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
          >
            {createMutation.isPending ? "Guardando..." : "Crear propiedad"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
