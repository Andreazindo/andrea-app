"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const VALID_KINDS = ["YOUTUBE", "DRIVE", "LINK", "COURSE", "IMAGE"] as const;

export async function addContentBlockAction(formData: FormData) {
  await requireAdmin("/admin/multimedia");

  const section = String(formData.get("section") ?? "").trim();
  const kind = String(formData.get("kind") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const priceInput = String(formData.get("price") ?? "").trim();
  const priceCents = priceInput ? Math.round(Number(priceInput) * 100) : null;

  if (!section || !VALID_KINDS.includes(kind as (typeof VALID_KINDS)[number]) || !title || !value) {
    redirect("/admin/multimedia?error=item-invalido");
  }

  const maxPosition = await prisma.contentBlock.aggregate({
    where: { section },
    _max: { position: true },
  });

  await prisma.contentBlock.create({
    data: {
      section,
      kind: kind as (typeof VALID_KINDS)[number],
      title,
      description: description || null,
      value,
      imageUrl: imageUrl || null,
      priceCents: priceCents !== null && !Number.isNaN(priceCents) ? priceCents : null,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  });

  redirect("/admin/multimedia?guardado=1");
}

export async function updateContentBlockAction(formData: FormData) {
  await requireAdmin("/admin/multimedia");

  const id = String(formData.get("id") ?? "");
  const kind = String(formData.get("kind") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const priceInput = String(formData.get("price") ?? "").trim();
  const priceCents = priceInput ? Math.round(Number(priceInput) * 100) : null;
  const active = formData.get("active") === "on";

  if (!id || !VALID_KINDS.includes(kind as (typeof VALID_KINDS)[number]) || !title || !value) {
    redirect("/admin/multimedia?error=item-invalido");
  }

  await prisma.contentBlock.update({
    where: { id },
    data: {
      kind: kind as (typeof VALID_KINDS)[number],
      title,
      description: description || null,
      value,
      imageUrl: imageUrl || null,
      priceCents: priceCents !== null && !Number.isNaN(priceCents) ? priceCents : null,
      active,
    },
  });

  redirect("/admin/multimedia?guardado=1");
}

export async function deleteContentBlockAction(formData: FormData) {
  await requireAdmin("/admin/multimedia");

  const id = String(formData.get("id") ?? "");
  await prisma.contentBlock.delete({ where: { id } });

  redirect("/admin/multimedia?guardado=1");
}
