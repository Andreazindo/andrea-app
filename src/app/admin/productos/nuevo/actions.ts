"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProductAction(formData: FormData) {
  await requireAdmin("/admin/productos");

  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const stockRaw = String(formData.get("stock") ?? "0").trim();
  const trackInventory = formData.get("trackInventory") === "on";

  if (!name) redirect("/admin/productos/nuevo?error=falta-nombre");
  if (!categoryId) redirect("/admin/productos/nuevo?error=falta-categoria");

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) redirect("/admin/productos/nuevo?error=categoria-invalida");

  const priceCents = Math.round(parseFloat(priceRaw.replace(",", ".")) * 100);
  if (!Number.isFinite(priceCents) || priceCents <= 0) {
    redirect("/admin/productos/nuevo?error=precio-invalido");
  }

  const stock = Number.parseInt(stockRaw, 10) || 0;

  const baseSlug = slugify(name) || "producto";
  let slug = baseSlug;
  let suffix = 1;
  while (
    await prisma.product.findUnique({
      where: { brandId_slug: { brandId: category.brandId, slug } },
    })
  ) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const product = await prisma.product.create({
    data: {
      brandId: category.brandId,
      categoryId: category.id,
      name,
      slug,
      description: description || null,
      variants: {
        create: {
          sku: `${slug}-${randomUUID().slice(0, 8)}`,
          name: "Único",
          priceCents,
          trackInventory,
          stock: trackInventory ? stock : 0,
        },
      },
    },
  });

  redirect(`/admin/productos/${product.id}?creado=1`);
}
