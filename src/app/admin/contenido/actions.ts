"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { EDITABLE_CONTENT_KEYS } from "@/lib/site-content";

export async function updateSiteContentAction(formData: FormData) {
  await requireAdmin("/admin/contenido");

  await Promise.all(
    EDITABLE_CONTENT_KEYS.map((key) => {
      const value = String(formData.get(key) ?? "").trim();
      return prisma.siteContent.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    })
  );

  redirect("/admin/contenido?guardado=1");
}

export async function addSalesPointAction(formData: FormData) {
  await requireAdmin("/admin/contenido");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name || !description) redirect("/admin/contenido?error=punto-invalido");

  const maxPosition = await prisma.salesPoint.aggregate({ _max: { position: true } });
  await prisma.salesPoint.create({
    data: { name, description, position: (maxPosition._max.position ?? -1) + 1 },
  });

  redirect("/admin/contenido?guardado=1");
}

export async function updateSalesPointAction(formData: FormData) {
  await requireAdmin("/admin/contenido");

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const active = formData.get("active") === "on";
  if (!name || !description) redirect("/admin/contenido?error=punto-invalido");

  await prisma.salesPoint.update({ where: { id }, data: { name, description, active } });

  redirect("/admin/contenido?guardado=1");
}

export async function deleteSalesPointAction(formData: FormData) {
  await requireAdmin("/admin/contenido");

  const id = String(formData.get("id") ?? "");
  await prisma.salesPoint.delete({ where: { id } });

  redirect("/admin/contenido?guardado=1");
}
