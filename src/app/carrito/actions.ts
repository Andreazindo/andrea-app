"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAvailableStock } from "@/lib/inventory";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/carrito");
  return session.user.id;
}

async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId } });
}

export async function addToCartAction(formData: FormData) {
  const userId = await requireUserId();
  const variantId = String(formData.get("variantId") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));

  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant || !variant.active) redirect("/tienda");

  const cart = await getOrCreateCart(userId);
  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productVariantId: { cartId: cart.id, productVariantId: variantId } },
  });
  const desiredQuantity = (existingItem?.quantity ?? 0) + quantity;

  const available = await getAvailableStock(variant);
  const finalQuantity = available !== null ? Math.min(desiredQuantity, available) : desiredQuantity;

  await prisma.cartItem.upsert({
    where: { cartId_productVariantId: { cartId: cart.id, productVariantId: variantId } },
    update: { quantity: finalQuantity },
    create: { cartId: cart.id, productVariantId: variantId, quantity: finalQuantity },
  });

  revalidatePath("/carrito");
  redirect("/carrito");
}

export async function updateCartItemAction(formData: FormData) {
  const userId = await requireUserId();
  const itemId = String(formData.get("itemId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 0);

  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { productVariant: true },
  });
  if (!item || item.cartId !== cart.id) redirect("/carrito");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    const available = await getAvailableStock(item.productVariant);
    const finalQuantity = available !== null ? Math.min(quantity, available) : quantity;
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: finalQuantity } });
  }

  revalidatePath("/carrito");
  redirect("/carrito");
}

export async function removeCartItemAction(formData: FormData) {
  const userId = await requireUserId();
  const itemId = String(formData.get("itemId") ?? "");

  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { id: itemId, cartId: cart.id } });

  revalidatePath("/carrito");
  redirect("/carrito");
}
