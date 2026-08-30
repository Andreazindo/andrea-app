import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { zindoFontVars, zindoColors } from "@/components/zindo/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zindo · Davana, ProsperMind y Steril Mil",
  description: "Catálogo y tienda en línea de las marcas de Andrea, bajo la identidad de Zindo.",
};

async function logoutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html lang="es" className={`${zindoFontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: zindoColors.ivory, color: zindoColors.ink }}>
        <header
          className="sticky top-0 z-50 border-b backdrop-blur"
          style={{ borderColor: zindoColors.sage, fontFamily: "var(--font-zindo-body)", backgroundColor: `${zindoColors.ivory}f2` }}
        >
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center flex-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/zindo/monograma.png" alt="Zindo" className="h-9 w-auto" />
            </Link>
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-4 text-sm flex-wrap justify-end">
                {session?.user ? (
                  <>
                    <span className="hidden sm:inline" style={{ color: zindoColors.ink, opacity: 0.5 }}>
                      {session.user.name}
                    </span>
                    <form action={logoutAction}>
                      <button type="submit" className="hover:underline" style={{ color: zindoColors.green }}>
                        Cerrar sesión
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="hover:underline" style={{ color: zindoColors.green }}>
                      Iniciar sesión
                    </Link>
                    <Link href="/registro" className="hover:underline" style={{ color: zindoColors.green }}>
                      Crear cuenta
                    </Link>
                  </>
                )}
                <Link href="/tienda" className="hover:underline" style={{ color: zindoColors.green }}>
                  Tienda
                </Link>
                {session?.user && (session.user.role === "ADMIN" || session.user.role === "OWNER") && (
                  <Link href="/admin/ventas/nueva" className="hover:underline" style={{ color: zindoColors.green }}>
                    Registrar venta
                  </Link>
                )}
                <Link href="/contacto" className="hover:underline" style={{ color: zindoColors.green }}>
                  Contacto
                </Link>
              </nav>
              {session?.user && (
                <Link
                  href="/carrito"
                  aria-label="Carrito"
                  className="flex items-center justify-center rounded-full border p-2 hover:bg-white/60 flex-none"
                  style={{ borderColor: zindoColors.sage }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={zindoColors.green}
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M6 6h15l-1.5 9h-12z" />
                    <path d="M6 6 5 3H2" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer
          className="border-t py-6 text-center text-xs"
          style={{ borderColor: zindoColors.sage, color: zindoColors.ink, opacity: 0.6, fontFamily: "var(--font-zindo-body)" }}
        >
          © {new Date().getFullYear()} Zindo
        </footer>
      </body>
    </html>
  );
}
