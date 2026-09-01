"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cuenta");

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name) {
    redirect("/cuenta?error=datos-invalidos");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone: phone || null },
  });

  redirect("/cuenta?guardado=1");
}

export async function changePasswordAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cuenta");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    redirect("/cuenta?error=password-corta");
  }
  if (newPassword !== confirmPassword) {
    redirect("/cuenta?error=password-no-coincide");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login?callbackUrl=/cuenta");

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    redirect("/cuenta?error=password-actual-incorrecta");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash } });

  redirect("/cuenta?passwordCambiada=1");
}
