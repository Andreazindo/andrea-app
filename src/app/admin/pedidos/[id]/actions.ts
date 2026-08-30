"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

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
