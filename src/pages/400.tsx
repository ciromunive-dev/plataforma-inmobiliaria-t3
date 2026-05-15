import Layout from "~/components/Layout";
import Link from "next/link";

export default function Error404() {
  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Esta página no existe.</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          Volver al inicio
        </Link>
      </div>
    </Layout>
  );
}
