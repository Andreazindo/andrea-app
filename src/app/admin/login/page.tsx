import type { Metadata } from "next";
import { adminLoginAction } from "./actions";
import { PlainBackLink } from "@/components/BackLink";

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
      <h1 className="text-2xl font-bold tracking-tight mt-3 mb-1">Acceso administrador</h1>
      <p className="text-sm text-black/60 dark:text-white/60 mb-6">Solo para el equipo de Zindo.</p>

      {error && (
        <p className="mb-4 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-3 py-2">
          Correo o contraseña incorrectos.
        </p>
      )}

      <form action={adminLoginAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/admin"} />
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
