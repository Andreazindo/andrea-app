import Link from "next/link";
import type { Metadata } from "next";
import { loginAction } from "./actions";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { zindoColors } from "@/components/zindo/theme";

export const metadata: Metadata = { title: "Iniciar sesión" };

const inputClass = "w-full rounded-md border bg-white px-3 py-2 text-sm";
const inputStyle = { borderColor: zindoColors.sage, color: zindoColors.ink };
const labelClass = "block text-sm font-medium mb-1";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;

  return (
    <ZindoContentPage title="Iniciar sesión" backHref="/" backLabel="Inicio">
      <div className="max-w-sm mx-auto w-full">
        {error && (
          <p className="mb-4 rounded-md bg-red-500/10 text-red-600 text-sm px-3 py-2">
            Correo o contraseña incorrectos.
          </p>
        )}

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/tienda"} />
          <div>
            <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="email">
              Correo
            </label>
            <input id="email" name="email" type="email" required className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="password">
              Contraseña
            </label>
            <input id="password" name="password" type="password" required className={inputClass} style={inputStyle} />
          </div>
          <button
            type="submit"
            className="w-full rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: zindoColors.green }}
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-sm" style={{ color: zindoColors.ink, opacity: 0.7 }}>
          ¿Aún no tienes cuenta?{" "}
          <Link
            href={`/registro${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="font-medium hover:underline"
            style={{ color: zindoColors.gold }}
          >
            Crea una
          </Link>
        </p>
      </div>
    </ZindoContentPage>
  );
}
