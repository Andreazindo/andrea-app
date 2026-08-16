import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-black/10 dark:border-white/15">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-semibold tracking-tight">
              Andrea
            </a>
            <nav className="flex gap-4 text-sm">
              <a href="/tienda" className="hover:underline">
                Tienda
              </a>
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
