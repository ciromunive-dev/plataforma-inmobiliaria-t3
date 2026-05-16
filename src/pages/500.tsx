import Layout from "~/components/Layout";
import Link from "next/link";

export default function Error500() {
  return (
    <Layout>
      <div className="text-center py-20" role="main" aria-labelledby="error-title">
        <h1 id="error-title" className="text-4xl font-bold text-gray-900 mb-2">500</h1>
        <p className="text-gray-500 mb-6">Ocurrió un error inesperado. Intenta de nuevo.</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm" aria-label="Volver al inicio de la aplicación">
          Volver al inicio
        </Link>
      </div>
    </Layout>
  );
}
