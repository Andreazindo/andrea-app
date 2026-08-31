import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getFavoritedProductIds(productIds: string[]): Promise<Set<string>> {
  const session = await auth();
  if (!session?.user?.id || productIds.length === 0) return new Set();

  const rows = await prisma.favorite.findMany({
    where: { userId: session.user.id, productId: { in: productIds } },
    select: { productId: true },
  });
  return new Set(rows.map((r) => r.productId));
}
