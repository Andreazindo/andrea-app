"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleProductLikeAction(productId: string, liked: boolean, path?: string) {
  if (liked) {
    await prisma.product.update({
      where: { id: productId },
      data: { likesCount: { increment: 1 } },
    });
  } else {
    await prisma.product.updateMany({
      where: { id: productId, likesCount: { gt: 0 } },
      data: { likesCount: { decrement: 1 } },
    });
  }

  if (path) revalidatePath(path);
}
