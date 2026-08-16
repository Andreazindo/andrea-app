"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAvailableStock } from "@/lib/inventory";

export async function createOrderAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/checkout");
  const userId = session.user.id;

  const shippingName = String(formData.get("shippingName") ?? "").trim();
  const shippingPhone = String(formData.get("shippingPhone") ?? "").trim();
  const shippingAddressLine = String(formData.get("shippingAddressLine") ?? "").trim();
  const shippingCity = String(formData.get("shippingCity") ?? "").trim();
  const shippingState = String(formData.get("shippingState") ?? "").trim();
  const shippingZip = String(formData.get("shippingZip") ?? "").trim();

  if (
    !shippingName ||
    !shippingPhone ||
    !shippingAddressLine ||
    !shippingCity ||
    !shippingState ||
    !shippingZip
  ) {
    redirect("/checkout?error=datos-incompletos");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { productVariant: { include: { product: { include: { brand: true } } } } } },
    },
  });

  if (!cart || cart.items.length === 0) redirect("/carrito");

  for (const item of cart.items) {
    const available = await getAvailableStock(item.productVariant);
    if (available !== null && available < item.quantity) {
      redirect("/carrito?error=stock-insuficiente");
    }
  }

  const subtotalCents = cart.items.reduce(
    (sum, item) => sum + item.productVariant.priceCents * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      status: "PENDING_PAYMENT",
      subtotalCents,
      shippingCents: 0,
      totalCents: subtotalCents,
      shippingName,
      shippingPhone,
      shippingAddressLine,
      shippingCity,
      shippingState,
      shippingZip,
      items: {
        create: cart.items.map((item) => ({
          productVariantId: item.productVariantId,
          brandCode: item.productVariant.product.brand.code,
          productName: item.productVariant.product.name,
          variantName: item.productVariant.name,
          unitPriceCents: item.productVariant.priceCents,
          quantity: item.quantity,
        })),
      },
    },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  redirect(`/pedidos/${order.id}`);
}
