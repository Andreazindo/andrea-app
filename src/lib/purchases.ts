import { prisma } from "@/lib/prisma";

const PAID_STATUSES = ["PAID", "PROCESSING", "SHIPPED"] as const;

export async function userHasPurchased(userId: string, productId: string): Promise<boolean> {
  const item = await prisma.orderItem.findFirst({
    where: {
      order: { userId, status: { in: [...PAID_STATUSES] } },
      productVariant: { productId },
    },
    select: { id: true },
  });
  return item !== null;
}
