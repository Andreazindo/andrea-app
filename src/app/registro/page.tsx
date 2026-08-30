import Link from "next/link";
import type { Metadata } from "next";
import { registerAction } from "./actions";
import { PlainBackLink } from "@/components/BackLink";

export const metadata: Metadata = { title: "Crear cuenta" };

const ERROR_MESSAGES: Record<string, string> = {
  "datos-invalidos": "Revisa tus datos: el nombre, correo y una contraseña de al menos 8 caracteres son obligatorios.",
  "correo-en-uso": "Ya existe una cuenta con ese correo. Intenta iniciar sesión.",
};

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <PlainBackLink href="/" label="Inicio" />
      <h1 className="text-2xl font-bold tracking-tight mt-3 mb-6">Crear cuenta</h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-3 py-2">
          {ERROR_MESSAGES[error] ?? "No pudimos crear tu cuenta."}
        </p>
      )}

      <form action={registerAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/tienda"} />
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
          />
        </div>
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
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Teléfono (opcional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
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
            minLength={8}
            className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-sm text-black/60 dark:text-white/60">
        ¿Ya tienes cuenta?{" "}
        <Link href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
