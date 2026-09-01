"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMercadoPagoPreference } from "@/lib/payments/mercadopago";
import { createPaypalOrder } from "@/lib/payments/paypal";
import { getAppUrl } from "@/lib/app-url";

async function loadOwnedPendingOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.userId !== userId) redirect("/carrito");
  if (order.status !== "PENDING_PAYMENT") redirect(`/pedidos/${orderId}`);
  return order;
}

export async function startMercadoPagoAction(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/pedidos/${orderId}`);

  const order = await loadOwnedPendingOrder(orderId, session.user.id);
  const appUrl = await getAppUrl();

  const preference = await createMercadoPagoPreference({
    orderId: order.id,
    items: order.items.map((item) => ({
      title: `${item.productName} — ${item.variantName}`,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    })),
    appUrl,
  });

  const redirectUrl = preference.sandbox_init_point ?? preference.init_point;
  if (!redirectUrl) throw new Error("Mercado Pago no devolvió una URL de pago");

  redirect(redirectUrl);
}

export async function startPaypalAction(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/pedidos/${orderId}`);

  const order = await loadOwnedPendingOrder(orderId, session.user.id);
  const appUrl = await getAppUrl();

  const { approveUrl } = await createPaypalOrder({
    orderId: order.id,
    totalCents: order.totalCents,
    appUrl,
  });

  redirect(approveUrl);
}
