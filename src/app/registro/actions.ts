"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/tienda");

  if (!name || !email || password.length < 8) {
    redirect(`/registro?error=datos-invalidos&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect(`/registro?error=correo-en-uso&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash,
      cart: { create: {} },
    },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
    throw error;
  }
}
