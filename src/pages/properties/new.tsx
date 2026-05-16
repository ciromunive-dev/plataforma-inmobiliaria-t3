import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import ImageUploader from "~/components/ImageUploader";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Card from "~/components/ui/Card";

type FieldErrors = {
  title?: string; description?: string; price?: string;
  bedrooms?: string; bathrooms?: string; area?: string;
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
      title: form.title, description: form.description,
      price: Number(form.price), bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms), area: Number(form.area), images,
    });
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((f) => ({ ...f, [key]: undefined }));
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Volver al listado
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva propiedad</h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Título" value={form.title} onChange={set("title")} error={fieldErrors.title} placeholder="Ej. Casa moderna en Miraflores" />
            <Input label="Descripción" value={form.description} onChange={set("description")} error={fieldErrors.description} placeholder="Describe la propiedad..." />
            <Input label="Precio (S/)" type="number" value={form.price} onChange={set("price")} error={fieldErrors.price} placeholder="280000" />

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Características</p>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Dormitorios" type="number" value={form.bedrooms} onChange={set("bedrooms")} error={fieldErrors.bedrooms} placeholder="3" />
                <Input label="Baños" type="number" value={form.bathrooms} onChange={set("bathrooms")} error={fieldErrors.bathrooms} placeholder="2" />
                <Input label="Área (m²)" type="number" value={form.area} onChange={set("area")} error={fieldErrors.area} placeholder="90" />
              </div>
            </div>

            <ImageUploader images={images} onChange={setImages} folder="temp" />

            {error && (
              <div role="alert" className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth loading={createMutation.isPending}>
              Crear propiedad
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
