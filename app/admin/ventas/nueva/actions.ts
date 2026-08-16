"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getAvailableStock } from "@/lib/inventory";
import { markOrderPaid } from "@/lib/orders";

export async function registerManualSaleAction(formData: FormData) {
  const admin = await requireAdmin();

  const email = String(formData.get("customerEmail") ?? "").trim().toLowerCase();
  const name = String(formData.get("customerName") ?? "").trim();
  const phone = String(formData.get("customerPhone") ?? "").trim();
  const addressLine = String(formData.get("shippingAddressLine") ?? "").trim() || "No especificado";
  const city = String(formData.get("shippingCity") ?? "").trim() || "No especificado";
  const state = String(formData.get("shippingState") ?? "").trim() || "No especificado";
  const zip = String(formData.get("shippingZip") ?? "").trim() || "N/A";
  const method = String(formData.get("method") ?? "MANUAL_TRANSFER");
  const reference = String(formData.get("reference") ?? "").trim();

  if (!email) {
    redirect("/admin/ventas/nueva?error=falta-correo");
  }
  if (method !== "MANUAL_TRANSFER" && method !== "MANUAL_CASH") {
    redirect("/admin/ventas/nueva?error=metodo-invalido");
  }

  let customer = await prisma.user.findUnique({ where: { email } });
  if (!customer) {
    if (!name) {
      redirect("/admin/ventas/nueva?error=falta-nombre-cliente-nuevo");
    }
    const randomPasswordHash = await bcrypt.hash(randomUUID(), 10);
    customer = await prisma.user.create({
      data: {
        email,
        name,
        phone: phone || null,
        passwordHash: randomPasswordHash,
        role: "CUSTOMER",
        cart: { create: {} },
      },
    });
  }

  const variantIds: { variantId: string; quantity: number }[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("qty_")) continue;
    const quantity = Number(value);
    if (Number.isFinite(quantity) && quantity > 0) {
      variantIds.push({ variantId: key.replace("qty_", ""), quantity });
    }
  }

  if (variantIds.length === 0) {
    redirect("/admin/ventas/nueva?error=sin-productos");
  }

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds.map((v) => v.variantId) } },
    include: { product: { include: { brand: true } } },
  });

  for (const { variantId, quantity } of variantIds) {
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) continue;
    const available = await getAvailableStock(variant);
    if (available !== null && available < quantity) {
      redirect(`/admin/ventas/nueva?error=stock-insuficiente&producto=${encodeURIComponent(variant.name)}`);
    }
  }

  const subtotalCents = variantIds.reduce((sum, { variantId, quantity }) => {
    const variant = variants.find((v) => v.id === variantId);
    return sum + (variant?.priceCents ?? 0) * quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      status: "PENDING_PAYMENT",
      subtotalCents,
      shippingCents: 0,
      totalCents: subtotalCents,
      shippingName: name || customer.name,
      shippingPhone: phone || customer.phone || "No especificado",
      shippingAddressLine: addressLine,
      shippingCity: city,
      shippingState: state,
      shippingZip: zip,
      items: {
        create: variantIds.map(({ variantId, quantity }) => {
          const variant = variants.find((v) => v.id === variantId)!;
          return {
            productVariantId: variant.id,
            brandCode: variant.product.brand.code,
            productName: variant.product.name,
            variantName: variant.name,
            unitPriceCents: variant.priceCents,
            quantity,
          };
        }),
      },
    },
  });

  await markOrderPaid({
    orderId: order.id,
    method,
    externalId: reference || `manual-${order.id}`,
    amountCents: subtotalCents,
    recordedByUserId: admin.id,
  });

  redirect(`/pedidos/${order.id}`);
}
