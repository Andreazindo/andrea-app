import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { zindoColors } from "@/components/zindo/theme";
import { updateProfileAction, changePasswordAction } from "./actions";

export const metadata: Metadata = { title: "Mi cuenta" };

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado",
  PROCESSING: "En preparación",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const ERROR_MESSAGES: Record<string, string> = {
  "datos-invalidos": "Ingresa tu nombre.",
  "password-corta": "La nueva contraseña debe tener al menos 8 caracteres.",
  "password-no-coincide": "La confirmación no coincide con la nueva contraseña.",
  "password-actual-incorrecta": "Tu contraseña actual no es correcta.",
};

const inputClass = "w-full rounded-md border bg-white px-3 py-2 text-sm";
const inputStyle = { borderColor: zindoColors.sage, color: zindoColors.ink };
const labelClass = "block text-sm font-medium mb-1";

export default async function CuentaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; guardado?: string; passwordCambiada?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cuenta");

  const { error, guardado, passwordCambiada } = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, totalCents: true, createdAt: true },
      },
    },
  });
  if (!user) redirect("/login?callbackUrl=/cuenta");

  return (
    <ZindoContentPage title="Mi cuenta" subtitle={user.email} backHref="/tienda" backLabel="Tienda">
      {guardado && (
        <p className="rounded-md bg-green-500/10 text-green-700 text-sm px-3 py-2">Datos guardados.</p>
      )}
      {passwordCambiada && (
        <p className="rounded-md bg-green-500/10 text-green-700 text-sm px-3 py-2">Contraseña actualizada.</p>
      )}
      {error && (
        <p className="rounded-md bg-red-500/10 text-red-600 text-sm px-3 py-2">
          {ERROR_MESSAGES[error] ?? "Revisa el formulario."}
        </p>
      )}

      <section className="rounded-lg bg-white/70 border p-4 space-y-3" style={{ borderColor: zindoColors.sage }}>
        <h2 className="font-semibold text-sm" style={{ color: zindoColors.green }}>
          Mis datos
        </h2>
        <form action={updateProfileAction} className="space-y-3">
          <div>
            <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="name">
              Nombre
            </label>
            <input id="name" name="name" defaultValue={user.name} required className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="phone">
              Teléfono
            </label>
            <input id="phone" name="phone" defaultValue={user.phone ?? ""} className={inputClass} style={inputStyle} />
          </div>
          <button
            type="submit"
            className="rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: zindoColors.green }}
          >
            Guardar
          </button>
        </form>
      </section>

      <section className="rounded-lg bg-white/70 border p-4 space-y-3" style={{ borderColor: zindoColors.sage }}>
        <h2 className="font-semibold text-sm" style={{ color: zindoColors.green }}>
          Cambiar contraseña
        </h2>
        <form action={changePasswordAction} className="space-y-3">
          <div>
            <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="currentPassword">
              Contraseña actual
            </label>
            <input id="currentPassword" name="currentPassword" type="password" required className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="newPassword">
              Nueva contraseña
            </label>
            <input id="newPassword" name="newPassword" type="password" required minLength={8} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="confirmPassword">
              Confirmar nueva contraseña
            </label>
            <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} className={inputClass} style={inputStyle} />
          </div>
          <button
            type="submit"
            className="rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: zindoColors.green }}
          >
            Actualizar contraseña
          </button>
        </form>
      </section>

      <section className="rounded-lg bg-white/70 border p-4 space-y-3" style={{ borderColor: zindoColors.sage }}>
        <h2 className="font-semibold text-sm" style={{ color: zindoColors.green }}>
          Mis pedidos ({user.orders.length})
        </h2>
        {user.orders.length === 0 ? (
          <p className="text-sm" style={{ color: zindoColors.ink, opacity: 0.6 }}>
            Todavía no tienes pedidos.
          </p>
        ) : (
          <ul className="divide-y -mx-4 -mb-4" style={{ borderColor: zindoColors.sage }}>
            {user.orders.map((order) => (
              <li key={order.id} className="border-t first:border-t-0" style={{ borderColor: zindoColors.sage }}>
                <Link
                  href={`/pedidos/${order.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-white/60 transition-colors"
                >
                  <span className="font-mono" style={{ color: zindoColors.ink, opacity: 0.65 }}>
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span style={{ color: zindoColors.ink, opacity: 0.65 }}>{STATUS_LABELS[order.status] ?? order.status}</span>
                  <span style={{ color: zindoColors.ink, opacity: 0.55 }}>{new Date(order.createdAt).toLocaleDateString("es-MX")}</span>
                  <span className="font-semibold" style={{ color: zindoColors.green }}>
                    {formatCents(order.totalCents)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </ZindoContentPage>
  );
}
