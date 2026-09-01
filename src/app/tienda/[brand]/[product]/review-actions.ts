"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function submitReviewAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const productId = String(formData.get("productId") ?? "");
  const path = String(formData.get("path") ?? "/tienda");
  const rating = Math.round(Number(formData.get("rating") ?? 0));
  const comment = String(formData.get("comment") ?? "").trim();

  if (rating < 1 || rating > 5) {
    redirect(`${path}?resenaError=1`);
  }

  await prisma.review.upsert({
    where: { productId_userId: { productId, userId: session.user.id } },
    update: { rating, comment: comment || null, approved: false },
    create: { productId, userId: session.user.id, rating, comment: comment || null },
  });

  revalidatePath(path);
  redirect(`${path}?resenaEnviada=1`);
}
