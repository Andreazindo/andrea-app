import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { isMercadoPagoConfigured } from "@/lib/payments/mercadopago";
import { isPaypalConfigured } from "@/lib/payments/paypal";
import { startMercadoPagoAction, startPaypalAction } from "./actions";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { zindoColors } from "@/components/zindo/theme";

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

  const isConfirmed = ["PAID", "PROCESSING", "SHIPPED"].includes(order.status);

  return (
    <ZindoContentPage title={`Pedido #${order.id.slice(-8).toUpperCase()}`} backHref="/tienda" backLabel="Tienda">
      {isConfirmed && (
        <div className="mb-2 rounded-lg bg-green-500/10 p-4">
          <p className="font-semibold text-green-700">¡Pedido confirmado! 🌿</p>
          <p className="mt-1 text-sm text-green-700/90">
            Gracias, {order.shippingName}. Te contactamos por WhatsApp para confirmar el costo y tiempo de envío.
            Gracias por darte este espacio de bienestar 💛
          </p>
        </div>
      )}

      <p className="text-sm" style={{ color: zindoColors.ink, opacity: 0.7 }}>
        Estatus: <span className="font-medium">{STATUS_LABELS[order.status] ?? order.status}</span>
      </p>

      {order.isGift && (
        <div className="rounded-lg bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold text-amber-700">🎁 Marcado como regalo</p>
          {order.giftMessage && <p className="mt-1 text-amber-700/90">"{order.giftMessage}"</p>}
        </div>
      )}

      <div className="rounded-lg bg-white/70 border p-4" style={{ borderColor: zindoColors.sage }}>
        <ul className="space-y-1 text-sm" style={{ color: zindoColors.ink }}>
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.quantity}× {item.productName} — {item.variantName}
              </span>
              <span>{formatCents(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        {order.discountCents > 0 && (
          <div className="mt-3 pt-3 border-t flex justify-between text-sm" style={{ borderColor: zindoColors.sage, color: zindoColors.green }}>
            <span>Descuento</span>
            <span>-{formatCents(order.discountCents)}</span>
          </div>
        )}
        <div
          className={`flex justify-between font-semibold ${order.discountCents > 0 ? "mt-1" : "mt-3 pt-3 border-t"}`}
          style={{ borderColor: zindoColors.sage, color: zindoColors.green }}
        >
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>
      </div>

      <div className="rounded-lg bg-white/70 border p-4 text-sm" style={{ borderColor: zindoColors.sage, color: zindoColors.ink }}>
        <h2 className="font-semibold mb-2" style={{ color: zindoColors.green }}>
          Envío
        </h2>
        <p>{order.shippingName}</p>
        <p>{order.shippingPhone}</p>
        <p>{order.shippingAddressLine}</p>
        <p>
          {order.shippingCity}, {order.shippingState}, {order.shippingZip},{" "}
          {order.shippingCountry === "US" ? "Estados Unidos" : "México"}
        </p>
        <p className="mt-3 text-xs" style={{ opacity: 0.65 }}>
          El costo de envío se confirma por WhatsApp según tu dirección, no está incluido en el total pagado.
        </p>
      </div>

      {order.status === "PENDING_PAYMENT" && isOwner ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold" style={{ color: zindoColors.green }}>
            Elige cómo pagar
          </h2>

          <form action={startMercadoPagoAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              disabled={!isMercadoPagoConfigured()}
              title={!isMercadoPagoConfigured() ? "Pendiente de conectar credenciales de Mercado Pago" : undefined}
              className="w-full rounded-md bg-[#009ee3] text-white px-4 py-3 text-sm font-medium hover:opacity-90 disabled:bg-black/20 disabled:text-black/50 disabled:cursor-not-allowed"
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
              className="w-full rounded-md bg-[#ffc439] text-black px-4 py-3 text-sm font-medium hover:opacity-90 disabled:bg-black/20 disabled:text-black/50 disabled:cursor-not-allowed"
            >
              {isPaypalConfigured() ? "Pagar con PayPal" : "PayPal (pendiente de conectar)"}
            </button>
          </form>
        </div>
      ) : (
        <Link href="/tienda" className="text-sm font-medium hover:underline" style={{ color: zindoColors.gold }}>
          Seguir comprando →
        </Link>
      )}
    </ZindoContentPage>
  );
}
