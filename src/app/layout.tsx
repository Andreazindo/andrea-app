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
        <header className="border-b" style={{ borderColor: zindoColors.sage, fontFamily: "var(--font-zindo-body)" }}>
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/zindo/monograma.png" alt="Zindo" className="h-9 w-auto" />
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/tienda" className="hover:underline" style={{ color: zindoColors.green }}>
                Tienda
              </Link>
              {session?.user ? (
                <>
                  <Link href="/carrito" className="hover:underline" style={{ color: zindoColors.green }}>
                    Carrito
                  </Link>
                  {(session.user.role === "ADMIN" || session.user.role === "OWNER") && (
                    <Link href="/admin/ventas/nueva" className="hover:underline" style={{ color: zindoColors.green }}>
                      Registrar venta
                    </Link>
                  )}
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
            </nav>
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
