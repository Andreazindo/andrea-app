import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { isMercadoPagoConfigured } from "@/lib/payments/mercadopago";
import { isPaypalConfigured } from "@/lib/payments/paypal";
import { startMercadoPagoAction, startPaypalAction } from "./actions";
import { PlainBackLink } from "@/components/BackLink";

export const metadata: Metadata = { title: "Mi pedido" };

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado",
  PROCESSING: "En preparación",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export default async function PedidoPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/pedidos/${orderId}`);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payments: true },
  });

  const isOwner = order?.userId === session.user.id;
  const isStaff = session.user.role === "ADMIN" || session.user.role === "OWNER";
  if (!order || (!isOwner && !isStaff)) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PlainBackLink href="/tienda" label="Tienda" />
      <h1 className="text-2xl font-bold tracking-tight mt-3 mb-1">
        Pedido #{order.id.slice(-8).toUpperCase()}
      </h1>
      <p className="text-sm text-black/60 dark:text-white/60 mb-6">
        Estatus: <span className="font-medium">{STATUS_LABELS[order.status] ?? order.status}</span>
      </p>

      <div className="rounded-lg border border-black/10 dark:border-white/15 p-4 mb-6">
        <ul className="space-y-1 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.quantity}× {item.productName} — {item.variantName}
              </span>
              <span>{formatCents(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/15 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>
      </div>

      <div className="rounded-lg border border-black/10 dark:border-white/15 p-4 mb-6 text-sm">
        <h2 className="font-semibold mb-2">Envío</h2>
        <p>{order.shippingName}</p>
        <p>{order.shippingPhone}</p>
        <p>{order.shippingAddressLine}</p>
        <p>
          {order.shippingCity}, {order.shippingState}, {order.shippingZip},{" "}
          {order.shippingCountry === "US" ? "Estados Unidos" : "México"}
        </p>
        <p className="mt-3 text-xs text-black/60 dark:text-white/60">
          El costo de envío se confirma por WhatsApp según tu dirección, no está incluido en el total pagado.
        </p>
      </div>

      {order.status === "PENDING_PAYMENT" && isOwner ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Elige cómo pagar</h2>

          <form action={startMercadoPagoAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              disabled={!isMercadoPagoConfigured()}
              title={!isMercadoPagoConfigured() ? "Pendiente de conectar credenciales de Mercado Pago" : undefined}
              className="w-full rounded-md bg-[#009ee3] text-white px-4 py-3 text-sm font-medium hover:opacity-90 disabled:bg-black/20 dark:disabled:bg-white/20 disabled:text-black/50 dark:disabled:text-white/50 disabled:cursor-not-allowed"
            >
              {isMercadoPagoConfigured()
                ? "Pagar con Mercado Pago"
                : "Mercado Pago (pendiente de conectar)"}
            </button>
          </form>

          <form action={startPaypalAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              disabled={!isPaypalConfigured()}
              title={!isPaypalConfigured() ? "Pendiente de conectar credenciales de PayPal" : undefined}
              className="w-full rounded-md bg-[#ffc439] text-black px-4 py-3 text-sm font-medium hover:opacity-90 disabled:bg-black/20 dark:disabled:bg-white/20 disabled:text-black/50 dark:disabled:text-white/50 disabled:cursor-not-allowed"
            >
              {isPaypalConfigured() ? "Pagar con PayPal" : "PayPal (pendiente de conectar)"}
            </button>
          </form>
        </div>
      ) : (
        <Link href="/tienda" className="text-sm font-medium hover:underline">
          Seguir comprando →
        </Link>
      )}
    </div>
  );
}
