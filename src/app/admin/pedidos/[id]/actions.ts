"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { createMercadoPagoPreference, isMercadoPagoConfigured } from "@/lib/payments/mercadopago";
import { getAppUrl } from "@/lib/app-url";

const VALID_STATUSES = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "CANCELLED", "REFUNDED"] as const;

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin("/admin/pedidos");

  const id = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!(VALID_STATUSES as readonly string[]).includes(status)) {
    redirect(`/admin/pedidos/${id}?error=estatus-invalido`);
  }

  await prisma.order.update({
    where: { id },
    data: { status: status as (typeof VALID_STATUSES)[number] },
  });

  redirect(`/admin/pedidos/${id}?guardado=1`);
}

export async function updateOrderShippingAction(formData: FormData) {
  await requireAdmin("/admin/pedidos");

  const id = String(formData.get("orderId") ?? "");
  const shippingName = String(formData.get("shippingName") ?? "").trim();
  const shippingPhone = String(formData.get("shippingPhone") ?? "").trim();
  const shippingAddressLine = String(formData.get("shippingAddressLine") ?? "").trim();
  const shippingCity = String(formData.get("shippingCity") ?? "").trim();
  const shippingState = String(formData.get("shippingState") ?? "").trim();
  const shippingZip = String(formData.get("shippingZip") ?? "").trim();
  const shippingCountry = String(formData.get("shippingCountry") ?? "").trim();

  if (!shippingName || !shippingPhone || !shippingAddressLine || !shippingCity || !shippingState || !shippingZip) {
    redirect(`/admin/pedidos/${id}?error=envio-invalido`);
  }

  await prisma.order.update({
    where: { id },
    data: {
      shippingName,
      shippingPhone,
      shippingAddressLine,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry: shippingCountry || "MX",
    },
  });

  redirect(`/admin/pedidos/${id}?guardado=1`);
}

export async function markWhatsappConfirmedAction(formData: FormData) {
  await requireAdmin("/admin/pedidos");

  const id = String(formData.get("orderId") ?? "");
  await prisma.order.update({ where: { id }, data: { whatsappConfirmedAt: new Date() } });

  redirect(`/admin/pedidos/${id}?guardado=1`);
}

export async function updateOrderShippingCostAction(formData: FormData) {
  await requireAdmin("/admin/pedidos");

  const id = String(formData.get("orderId") ?? "");
  const shippingPriceRaw = String(formData.get("shippingPrice") ?? "").trim();
  const shippingCents = Math.round(Number(shippingPriceRaw) * 100);

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order || !shippingPriceRaw || Number.isNaN(shippingCents) || shippingCents < 0) {
    redirect(`/admin/pedidos/${id}?error=envio-costo-invalido`);
  }

  let shippingPaymentUrl: string | null = null;

  if (shippingCents > 0 && isMercadoPagoConfigured()) {
    const appUrl = await getAppUrl();
    const preference = await createMercadoPagoPreference({
      orderId: order.id,
      items: [
        {
          title: `Envío — Pedido #${order.id.slice(-8).toUpperCase()}`,
          quantity: 1,
          unitPriceCents: shippingCents,
        },
      ],
      appUrl,
      returnPath: `/pedidos/${order.id}/mercadopago/envio-retorno`,
    });
    shippingPaymentUrl = preference.sandbox_init_point ?? preference.init_point ?? null;
  }

  await prisma.order.update({
    where: { id },
    data: {
      shippingCents,
      totalCents: order.subtotalCents + shippingCents,
      shippingPaymentUrl,
      shippingPaidAt: null,
    },
  });

  redirect(`/admin/pedidos/${id}?guardado=1`);
}
