import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PlainBackLink } from "@/components/BackLink";
import { updateOrderStatusAction } from "./actions";

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado",
  PROCESSING: "En preparación",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  MERCADO_PAGO: "Mercado Pago",
  PAYPAL: "PayPal",
  MANUAL_TRANSFER: "Transferencia",
  MANUAL_CASH: "Efectivo",
};

const ERROR_MESSAGES: Record<string, string> = {
  "estatus-invalido": "Elige un estatus válido.",
};

const sectionClass = "rounded-lg border border-black/10 dark:border-white/15 p-4 space-y-3";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Pedido #${id.slice(-8).toUpperCase()} (Admin)` };
}

export default async function PedidoAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; guardado?: string }>;
}) {
  await requireAdmin("/admin/pedidos");
  const { id } = await params;
  const { error, guardado } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: true,
      payments: { orderBy: { createdAt: "desc" }, include: { recordedByUser: { select: { name: true } } } },
    },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <div>
        <PlainBackLink href="/admin/pedidos" label="Pedidos" />
        <h1 className="text-2xl font-bold tracking-tight mt-3">Pedido #{order.id.slice(-8).toUpperCase()}</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          {new Date(order.createdAt).toLocaleString("es-MX")}
        </p>
      </div>

      {guardado && (
        <p className="rounded-md bg-green-500/10 text-green-700 dark:text-green-400 text-sm px-3 py-2">
          Estatus actualizado.
        </p>
      )}
      {error && (
        <p className="rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-3 py-2">
          {ERROR_MESSAGES[error] ?? "Revisa el formulario."}
        </p>
      )}

      <section className={sectionClass}>
        <h2 className="text-sm font-semibold">Estatus</h2>
        <form action={updateOrderStatusAction} className="flex items-center gap-3">
          <input type="hidden" name="orderId" value={order.id} />
          <select
            name="status"
            defaultValue={order.status}
            className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Guardar
          </button>
        </form>
      </section>

      <section className={sectionClass}>
        <h2 className="text-sm font-semibold">Cliente</h2>
        <p className="text-sm">
          {order.user.name} · {order.user.email}
          {order.user.phone && ` · ${order.user.phone}`}
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-sm font-semibold">Envío</h2>
        <p className="text-sm">
          {order.shippingName} · {order.shippingPhone}
          <br />
          {order.shippingAddressLine}, {order.shippingCity}, {order.shippingState} {order.shippingZip},{" "}
          {order.shippingCountry}
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-sm font-semibold">Productos</h2>
        <ul className="space-y-1 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.productName} — {item.variantName} × {item.quantity}
              </span>
              <span className="font-medium">{formatCents(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-black/10 dark:border-white/15 pt-3 text-sm">
          <span>Envío</span>
          <span>{formatCents(order.shippingCents)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-sm font-semibold">Pagos</h2>
        {order.payments.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50">Sin pagos registrados.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {order.payments.map((payment) => (
              <li key={payment.id} className="flex flex-col gap-0.5">
                <span>
                  {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method} · {formatCents(payment.amountCents)} ·{" "}
                  <span className="font-medium">{payment.status}</span>
                </span>
                <span className="text-xs text-black/50 dark:text-white/50">
                  {new Date(payment.createdAt).toLocaleString("es-MX")}
                  {payment.externalId && ` · ID: ${payment.externalId}`}
                  {payment.recordedByUser && ` · Registrado por ${payment.recordedByUser.name}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
