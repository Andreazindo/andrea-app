import type { Metadata } from "next";
import { adminLoginAction } from "./actions";
import { PlainBackLink } from "@/components/BackLink";
import { AdminPageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Acceso administrador" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <PlainBackLink href="/" label="Inicio" />
      <div className="mt-3 mb-6">
        <AdminPageHeader title="Acceso administrador" subtitle="Solo para el equipo de Zindo." />
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-500/10 text-red-600 text-sm px-3 py-2">
          Correo o contraseña incorrectos.
        </p>
      )}

      <form action={adminLoginAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/admin"} />
        <div>
          <label className="block text-sm font-medium mb-1 text-[#1A1A1A]" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-[#9CBA9D]/60 bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C9A15B]/50 focus:border-[#C9A15B]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[#1A1A1A]" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-[#9CBA9D]/60 bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C9A15B]/50 focus:border-[#C9A15B]"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-[#0D3B36] px-4 py-2 text-sm font-medium text-white hover:bg-[#0D3B36]/90 transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
