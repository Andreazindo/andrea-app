import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andrea · Davana, Zindo, ProsperMind y Steril Mil",
  description: "Catálogo y tienda en línea de las marcas de Andrea.",
};

async function logoutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-black/10 dark:border-white/15">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">
              Andrea
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/tienda" className="hover:underline">
                Tienda
              </Link>
              {session?.user ? (
                <>
                  <Link href="/carrito" className="hover:underline">
                    Carrito
                  </Link>
                  <span className="text-black/50 dark:text-white/50 hidden sm:inline">
                    {session.user.name}
                  </span>
                  <form action={logoutAction}>
                    <button type="submit" className="hover:underline">
                      Cerrar sesión
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:underline">
                    Iniciar sesión
                  </Link>
                  <Link href="/registro" className="hover:underline">
                    Crear cuenta
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/10 dark:border-white/15 py-6 text-center text-xs text-black/50 dark:text-white/50">
          © {new Date().getFullYear()} Andrea
        </footer>
      </body>
    </html>
  );
}
