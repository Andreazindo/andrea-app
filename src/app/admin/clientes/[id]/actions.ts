"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

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
