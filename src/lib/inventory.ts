import { prisma } from "@/lib/prisma";

export async function getAvailableStock(variant: {
  id: string;
  trackInventory: boolean;
  stock: number;
}): Promise<number | null> {
  if (variant.trackInventory) return variant.stock;

  const components = await prisma.kitComponent.findMany({
    where: { kitVariantId: variant.id },
    include: { componentVariant: true },
  });
  if (components.length === 0) return null;

  return Math.min(
    ...components.map((c) => Math.floor(c.componentVariant.stock / c.quantity))
  );
}
