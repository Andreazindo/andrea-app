"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function submitCommunityPostAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=%2Fcomunidad");

  const content = String(formData.get("content") ?? "").trim();
  if (!content) redirect("/comunidad?comunidadError=1");

  await prisma.communityPost.create({
    data: { userId: session.user.id, content },
  });

  revalidatePath("/comunidad");
  redirect("/comunidad?publicacionEnviada=1");
}

export async function submitCommunityCommentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=%2Fcomunidad");

  const postId = String(formData.get("postId") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!postId || !content) redirect("/comunidad?comunidadError=1");

  await prisma.communityComment.create({
    data: { postId, userId: session.user.id, content },
  });

  revalidatePath("/comunidad");
  redirect("/comunidad?comentarioEnviado=1#post-" + postId);
}
