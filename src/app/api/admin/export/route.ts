import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin("/admin");

  const [products, orders, customers, siteContent, salesPoints, contentBlocks] = await Promise.all([
    prisma.product.findMany({
      include: {
        brand: { select: { name: true, code: true } },
        category: { select: { name: true } },
        variants: true,
        images: true,
      },
    }),
    prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    }),
    prisma.siteContent.findMany(),
    prisma.salesPoint.findMany({ orderBy: { position: "asc" } }),
    prisma.contentBlock.findMany({ orderBy: [{ section: "asc" }, { position: "asc" }] }),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    products,
    orders,
    customers,
    siteContent,
    salesPoints,
    contentBlocks,
  };

  const fileName = `zindo-datos-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
