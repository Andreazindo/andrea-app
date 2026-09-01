import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PlainBackLink } from "@/components/BackLink";
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
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <div>
        <PlainBackLink href="/tienda" label="Tienda" />
        <h1 className="text-2xl font-bold tracking-tight mt-3 mb-1">Mi cuenta</h1>
        <p className="text-sm text-black/60 dark:text-white/60">{user.email}</p>
      </div>

      {guardado && (
        <p className="rounded-md bg-green-500/10 text-green-700 dark:text-green-400 text-sm px-3 py-2">
          Datos guardados.
        </p>
      )}
      {passwordCambiada && (
        <p className="rounded-md bg-green-500/10 text-green-700 dark:text-green-400 text-sm px-3 py-2">
          Contraseña actualizada.
        </p>
      )}
      {error && (
        <p className="rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-3 py-2">
          {ERROR_MESSAGES[error] ?? "Revisa el formulario."}
        </p>
      )}

      <section className="rounded-lg border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h2 className="font-semibold text-sm">Mis datos</h2>
        <form action={updateProfileAction} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              defaultValue={user.name}
              required
              className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={user.phone ?? ""}
              className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Guardar
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h2 className="font-semibold text-sm">Cambiar contraseña</h2>
        <form action={changePasswordAction} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="currentPassword">
              Contraseña actual
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="newPassword">
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirmar nueva contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Actualizar contraseña
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-black/10 dark:border-white/15 p-4 space-y-3">
        <h2 className="font-semibold text-sm">Mis pedidos ({user.orders.length})</h2>
        {user.orders.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">Todavía no tienes pedidos.</p>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/15 -mx-4 -mb-4">
            {user.orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/pedidos/${order.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <span className="font-mono text-black/60 dark:text-white/60">#{order.id.slice(-8).toUpperCase()}</span>
                  <span className="text-black/60 dark:text-white/60">{STATUS_LABELS[order.status] ?? order.status}</span>
                  <span className="text-black/50 dark:text-white/50">{new Date(order.createdAt).toLocaleDateString("es-MX")}</span>
                  <span className="font-semibold">{formatCents(order.totalCents)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
