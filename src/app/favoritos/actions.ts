"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavoriteAction(productId: string, path: string): Promise<{ favorited: boolean }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");
  const userId = session.user.id;

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId, productId } });
  }

  revalidatePath(path);
  revalidatePath("/favoritos");

  return { favorited: !existing };
}
