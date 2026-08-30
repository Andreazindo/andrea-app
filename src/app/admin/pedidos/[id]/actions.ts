"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "CANCELLED", "REFUNDED"] as const;

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin("/admin/pedidos");

  const id = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!(VALID_STATUSES as readonly string[]).includes(status)) {
    redirect(`/admin/pedidos/${id}?error=estatus-invalido`);
  }

  await prisma.order.update({
    where: { id },
    data: { status: status as (typeof VALID_STATUSES)[number] },
  });

  redirect(`/admin/pedidos/${id}?guardado=1`);
}
