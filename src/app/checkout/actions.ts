"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAvailableStock } from "@/lib/inventory";

function computeDiscountCents(coupon: { type: string; value: number }, subtotalCents: number): number {
  if (coupon.type === "PERCENT") return Math.round((subtotalCents * coupon.value) / 100);
  return Math.min(coupon.value, subtotalCents);
}

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
  const shippingCountry = String(formData.get("shippingCountry") ?? "").trim();
  const couponCode = String(formData.get("couponCode") ?? "").trim().toUpperCase();
  const isGift = formData.get("isGift") === "1";
  const giftMessage = isGift ? String(formData.get("giftMessage") ?? "").trim() || null : null;

  if (
    !shippingName ||
    !shippingPhone ||
    !shippingAddressLine ||
    !shippingCity ||
    !shippingState ||
    !shippingZip ||
    !shippingCountry
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

  let couponId: string | null = null;
  let discountCents = 0;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    const expired = coupon?.expiresAt ? coupon.expiresAt < new Date() : false;
    const exhausted = coupon?.maxRedemptions !== null && coupon?.maxRedemptions !== undefined && coupon.redemptions >= coupon.maxRedemptions;
    if (!coupon || !coupon.active || expired || exhausted) {
      redirect("/checkout?error=cupon-invalido");
    }
    couponId = coupon.id;
    discountCents = computeDiscountCents(coupon, subtotalCents);
  }

  const totalCents = subtotalCents - discountCents;

  const order = await prisma.$transaction(async (tx) => {
    if (couponId) {
      const { count } = await tx.coupon.updateMany({
        where: { id: couponId, active: true },
        data: { redemptions: { increment: 1 } },
      });
      if (count === 0) throw new Error("cupon-invalido");
    }

    return tx.order.create({
      data: {
        userId,
        status: "PENDING_PAYMENT",
        subtotalCents,
        shippingCents: 0,
        discountCents,
        couponId,
        totalCents,
        shippingName,
        shippingPhone,
        shippingAddressLine,
        shippingCity,
        shippingState,
        shippingZip,
        shippingCountry,
        isGift,
        giftMessage,
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
  }).catch((err: unknown) => {
    if (err instanceof Error && err.message === "cupon-invalido") return null;
    throw err;
  });

  if (!order) redirect("/checkout?error=cupon-invalido");

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  redirect(`/pedidos/${order.id}`);
}
