"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function createCustomerAction(formData: FormData) {
  await requireAdmin("/admin/clientes");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !email) {
    redirect("/admin/clientes?error=datos-invalidos");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/admin/clientes?error=correo-en-uso");
  }

  const randomPasswordHash = await bcrypt.hash(randomUUID(), 10);
  const customer = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash: randomPasswordHash,
      role: "CUSTOMER",
      cart: { create: {} },
    },
  });

  redirect(`/admin/clientes/${customer.id}?creado=1`);
}
