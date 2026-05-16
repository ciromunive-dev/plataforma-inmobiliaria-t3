import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "~/components/Layout";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Card from "~/components/ui/Card";

type FieldErrors = { email?: string; password?: string };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!email) errors.email = "El correo es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Correo inválido";
    if (!password) errors.password = "La contraseña es requerida";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) setError("Credenciales inválidas");
    else void router.push("/");
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <span className="text-4xl">🏡</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Iniciar sesión</h1>
            <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors((f) => ({ ...f, email: undefined })); }}
                placeholder="tu@correo.com"
                error={fieldErrors.email}
              />
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: undefined })); }}
                placeholder="••••••••"
                error={fieldErrors.password}
              />

              {error && (
                <div role="alert" className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth loading={loading}>
                Ingresar
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              ¿No tienes cuenta?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                Regístrate
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
