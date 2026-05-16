import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "~/components/ui/Button";

const navLinks = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/properties/my-properties", label: "Mis propiedades", icon: "📋" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 sm:px-6 gap-4 fixed top-0 left-0 right-0 z-30">
        {session && (
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 shrink-0"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <Link
          href="/"
          className={`text-lg font-bold text-blue-600 shrink-0 ${session ? "md:w-52" : ""}`}
          aria-label="Ir al inicio"
        >
          Inmobiliaria
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <>
              <span className="text-sm text-gray-500 hidden lg:block truncate max-w-[160px]">
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

      {/* Overlay mobile */}
      {session && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex pt-14 flex-1">
        {session && (
          <aside
            className={`
              w-64 bg-white border-r border-gray-200 fixed top-14 left-0 bottom-0 z-20
              flex flex-col py-4 px-3 transition-transform duration-200
              md:translate-x-0 md:w-52
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            <nav aria-label="Navegación principal" className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
          className={`flex-1 px-4 sm:px-6 py-6 min-w-0 ${session ? "md:ml-52" : ""}`}
        >
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
