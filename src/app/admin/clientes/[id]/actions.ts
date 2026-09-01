"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const TEMP_PASSWORD_CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

function generateTempPassword(): string {
  return Array.from(randomBytes(10), (b) => TEMP_PASSWORD_CHARSET[b % TEMP_PASSWORD_CHARSET.length]).join("");
}

export async function updateCustomerAction(formData: FormData) {
  await requireAdmin("/admin/clientes");

  const id = String(formData.get("customerId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !email) {
    redirect(`/admin/clientes/${id}?error=datos-invalidos`);
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { name, email, phone: phone || null },
    });
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
      redirect(`/admin/clientes/${id}?error=correo-en-uso`);
    }
    throw err;
  }

  redirect(`/admin/clientes/${id}?guardado=1`);
}

export async function resetCustomerPasswordAction(formData: FormData) {
  await requireAdmin("/admin/clientes");

  const id = String(formData.get("customerId") ?? "");
  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({ where: { id }, data: { passwordHash } });

  redirect(`/admin/clientes/${id}?tempPassword=${encodeURIComponent(tempPassword)}`);
}
