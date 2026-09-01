"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function approveReviewAction(formData: FormData) {
  await requireAdmin("/admin/resenas");
  const id = String(formData.get("reviewId") ?? "");
  await prisma.review.update({ where: { id }, data: { approved: true } });
  redirect("/admin/resenas?guardado=1");
}

export async function rejectReviewAction(formData: FormData) {
  await requireAdmin("/admin/resenas");
  const id = String(formData.get("reviewId") ?? "");
  await prisma.review.delete({ where: { id } });
  redirect("/admin/resenas?guardado=1");
}
