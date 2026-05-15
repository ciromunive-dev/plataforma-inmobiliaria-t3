import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

export default function NewPropertyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setForm] = useState({
    title: "", description: "", price: "", bedrooms: "", bathrooms: "", area: "",
  });
  const [error, setError] = useState("");

  const createMutation = api.property.create.useMutation({
    onSuccess: (property) => void router.push(`/properties/${property.id}`),
    onError: (err) => setError(err.message),
  });

  if (status === "loading") return null;

  if (!session) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-gray-500">Debes iniciar sesión para crear propiedades.</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline mt-4 inline-block">
            Iniciar sesión
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    createMutation.mutate({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
    });
  };

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        required
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
      />
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
