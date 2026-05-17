import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import ImageUploader from "~/components/ImageUploader";
import MapPicker from "~/components/MapPicker";
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
    title: "", description: "", price: "", bedrooms: "", bathrooms: "", area: "", phone: "",
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
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
      bathrooms: Number(form.bathrooms), area: Number(form.area),
      images,
      phone: form.phone || undefined,
      address: location?.address,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((f) => ({ ...f, [key]: undefined }));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al listado
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nueva propiedad</h1>
          <p className="text-sm text-gray-400 mt-1">Completa los datos para publicar tu propiedad</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Título" value={form.title} onChange={set("title")} error={fieldErrors.title} placeholder="Ej. Casa moderna en Miraflores" />
            <Input label="Descripción" value={form.description} onChange={set("description")} error={fieldErrors.description} placeholder="Describe la propiedad..." />
            <Input label="Precio (S/)" type="number" value={form.price} onChange={set("price")} error={fieldErrors.price} placeholder="280000" />

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Características</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input label="Dormitorios" type="number" value={form.bedrooms} onChange={set("bedrooms")} error={fieldErrors.bedrooms} placeholder="3" />
                <Input label="Baños" type="number" value={form.bathrooms} onChange={set("bathrooms")} error={fieldErrors.bathrooms} placeholder="2" />
                <Input label="Área (m²)" type="number" value={form.area} onChange={set("area")} error={fieldErrors.area} placeholder="90" />
              </div>
            </div>

            <Input
              label="WhatsApp de contacto"
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="+51 999 999 999"
              hint="Opcional. Los interesados podrán contactarte por WhatsApp."
            />

            <MapPicker
              latitude={location?.latitude}
              longitude={location?.longitude}
              address={location?.address}
              onChange={setLocation}
            />

            <ImageUploader images={images} onChange={setImages} folder="temp" />

            {error && (
              <div role="alert" className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <Button type="submit" fullWidth loading={createMutation.isPending} size="lg">
              Publicar propiedad
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
