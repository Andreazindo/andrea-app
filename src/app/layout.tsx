import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { zindoFontVars, zindoColors } from "@/components/zindo/theme";
import { HeaderNav } from "@/components/zindo/HeaderNav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ZINDO",
    template: "%s · ZINDO",
  },
  description: "Un espacio de bienestar y de desarrollo personal hacia una forma consciente de vivir.",
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
            <HeaderNav
              userName={session?.user?.name ?? null}
              isAdmin={session?.user?.role === "ADMIN" || session?.user?.role === "OWNER"}
              logoutAction={logoutAction}
            />
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
