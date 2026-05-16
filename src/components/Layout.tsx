import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "~/components/ui/Button";

const navLinks = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/properties/my-properties", label: "Mis propiedades", icon: "📋" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6 gap-4 fixed top-0 left-0 right-0 z-30">
        <Link
          href="/"
          className={`text-lg font-bold text-blue-600 shrink-0 ${session ? "w-52" : ""}`}
          aria-label="Ir al inicio"
        >
          Inmobiliaria
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:block">
                {session.user?.name ?? session.user?.email}
              </span>
              <Link href="/properties/new">
                <Button variant="primary">+ Publicar</Button>
              </Link>
              <Button variant="outline" onClick={() => signOut()} aria-label="Cerrar sesión">
                Salir
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="outline">Iniciar sesión</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary">Registrarse</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="flex pt-14 flex-1">
        {session && (
          <aside className="w-52 bg-white border-r border-gray-200 fixed top-14 left-0 bottom-0 z-20 flex flex-col py-4 px-3">
            <nav aria-label="Navegación principal" className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto px-3 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
            </div>
          </aside>
        )}

        <main
          id="main-content"
          className={`flex-1 px-6 py-6 min-w-0 ${session ? "ml-52" : ""}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
