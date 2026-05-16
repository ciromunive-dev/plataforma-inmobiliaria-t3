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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 fixed top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto w-full h-full flex items-center px-4 sm:px-6 gap-4">
          {session && (
            <button
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 shrink-0"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Ir al inicio">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-base font-bold text-gray-900 hidden sm:block">Inmobiliaria</span>
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <>
                <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {(session.user?.name ?? session.user?.email ?? "U")[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-600 truncate max-w-[140px]">
                    {session.user?.name ?? session.user?.email}
                  </span>
                </div>
                <Link href="/properties/new">
                  <Button variant="primary" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Publicar
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut()} aria-label="Cerrar sesión">
                  Salir
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">Iniciar sesión</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Overlay mobile */}
      {session && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex pt-16 flex-1">
        {session && (
          <aside
            className={`
              w-64 md:w-56 bg-white border-r border-gray-100 fixed top-16 left-0 bottom-0 z-20
              flex flex-col py-4 px-3 transition-transform duration-200 shadow-xl md:shadow-none
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto px-3 py-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(session.user?.name ?? session.user?.email ?? "U")[0]?.toUpperCase()}
                </div>
                <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
              </div>
            </div>
          </aside>
        )}

        <main
          id="main-content"
          className={`flex-1 min-w-0 ${session ? "md:ml-56" : ""}`}
        >
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
