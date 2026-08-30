"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function updateProductAction(formData: FormData) {
  await requireAdmin("/admin/productos");

  const id = String(formData.get("productId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const active = formData.get("active") === "on";

  if (!name) redirect(`/admin/productos/${id}?error=falta-nombre`);

  const category = categoryId ? await prisma.category.findUnique({ where: { id: categoryId } }) : null;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description: description || null,
      active,
      ...(category ? { categoryId: category.id, brandId: category.brandId } : {}),
    },
  });

  redirect(`/admin/productos/${id}?guardado=1`);
}

export async function updateVariantAction(formData: FormData) {
  await requireAdmin("/admin/productos");

  const id = String(formData.get("variantId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const stockRaw = String(formData.get("stock") ?? "0").trim();
  const trackInventory = formData.get("trackInventory") === "on";
  const active = formData.get("active") === "on";

  const priceCents = Math.round(parseFloat(priceRaw.replace(",", ".")) * 100);
  if (!name || !Number.isFinite(priceCents) || priceCents <= 0) {
    redirect(`/admin/productos/${productId}?error=variante-invalida`);
  }

  const stock = Number.parseInt(stockRaw, 10) || 0;

  await prisma.productVariant.update({
    where: { id },
    data: { name, priceCents, stock: trackInventory ? stock : 0, trackInventory, active },
  });

  redirect(`/admin/productos/${productId}?guardado=1`);
}

export async function addVariantAction(formData: FormData) {
  await requireAdmin("/admin/productos");

  const productId = String(formData.get("productId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const stockRaw = String(formData.get("stock") ?? "0").trim();
  const trackInventory = formData.get("trackInventory") === "on";

  const priceCents = Math.round(parseFloat(priceRaw.replace(",", ".")) * 100);
  if (!name || !Number.isFinite(priceCents) || priceCents <= 0) {
    redirect(`/admin/productos/${productId}?error=variante-invalida`);
  }

  const stock = Number.parseInt(stockRaw, 10) || 0;

  await prisma.productVariant.create({
    data: {
      productId,
      sku: `${productId}-${randomUUID().slice(0, 8)}`,
      name,
      priceCents,
      trackInventory,
      stock: trackInventory ? stock : 0,
    },
  });

  redirect(`/admin/productos/${productId}?guardado=1`);
}
