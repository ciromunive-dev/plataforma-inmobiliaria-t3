import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Card from "~/components/ui/Card";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");

  const registerMutation = api.auth.register.useMutation({
    onSuccess: async () => {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) { setError("Cuenta creada. Inicia sesión."); void router.push("/auth/login"); }
      else void router.push("/");
    },
    onError: (err) => setError(err.message),
  });

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "El nombre es requerido";
    if (!email) errors.email = "El correo es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Correo inválido";
    if (!password) errors.password = "La contraseña es requerida";
    else if (password.length < 6) errors.password = "Mínimo 6 caracteres";
    if (!confirmPassword) errors.confirmPassword = "Confirma tu contraseña";
    else if (password !== confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    registerMutation.mutate({ name, email, password });
  };

  const clearError = (field: keyof FieldErrors) =>
    setFieldErrors((f) => ({ ...f, [field]: undefined }));

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
            <p className="text-sm text-gray-400 mt-1">Regístrate para acceder a todas las propiedades</p>
          </div>

          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre completo"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError("name"); }}
                placeholder="Juan Pérez"
                error={fieldErrors.name}
              />
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                placeholder="tu@correo.com"
                error={fieldErrors.email}
              />
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                placeholder="Mínimo 6 caracteres"
                error={fieldErrors.password}
              />
              <Input
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
                placeholder="Repite la contraseña"
                error={fieldErrors.confirmPassword}
              />

              {error && (
                <div role="alert" className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth loading={registerMutation.isPending} size="lg">
                Crear cuenta
              </Button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
                Inicia sesión
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
