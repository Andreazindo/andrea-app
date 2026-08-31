import { prisma } from "@/lib/prisma";

export async function getContentBlocks(section: string) {
  return prisma.contentBlock.findMany({
    where: { section, active: true },
    orderBy: { position: "asc" },
  });
}
