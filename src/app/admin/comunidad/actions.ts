"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function approveCommunityPostAction(formData: FormData) {
  await requireAdmin("/admin/comunidad");
  const id = String(formData.get("postId") ?? "");
  await prisma.communityPost.update({ where: { id }, data: { approved: true } });
  redirect("/admin/comunidad?guardado=1");
}

export async function rejectCommunityPostAction(formData: FormData) {
  await requireAdmin("/admin/comunidad");
  const id = String(formData.get("postId") ?? "");
  await prisma.communityPost.delete({ where: { id } });
  redirect("/admin/comunidad?guardado=1");
}

export async function deleteCommunityCommentAction(formData: FormData) {
  await requireAdmin("/admin/comunidad");
  const id = String(formData.get("commentId") ?? "");
  await prisma.communityComment.delete({ where: { id } });
  redirect("/admin/comunidad?guardado=1");
}
