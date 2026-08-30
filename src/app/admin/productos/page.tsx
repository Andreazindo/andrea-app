import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PlainBackLink } from "@/components/BackLink";

export const metadata: Metadata = { title: "Productos (Admin)" };

export default async function ProductosAdminPage() {
  await requireAdmin("/admin/productos");

  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      variants: true,
      images: { orderBy: { position: "asc" }, take: 1 },
    },
  });

  const byBrand = new Map<string, typeof products>();
  for (const product of products) {
    const key = product.brand.name;
    if (!byBrand.has(key)) byBrand.set(key, []);
    byBrand.get(key)!.push(product);
  }
  const brandNames = [...byBrand.keys()].sort();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
      <div>
        <PlainBackLink href="/" label="Inicio" />
        <div className="flex items-center justify-between gap-4 mt-3">
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <Link
            href="/admin/productos/nuevo"
            className="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            + Nuevo producto
          </Link>
        </div>
      </div>

      {brandNames.map((brandName) => {
        const items = byBrand.get(brandName)!.slice().sort((a, b) => a.name.localeCompare(b.name));
        return (
          <section key={brandName} className="space-y-2">
            <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">{brandName}</h2>
            <div className="space-y-2">
              {items.map((product) => {
                const prices = product.variants.map((v) => v.priceCents);
                const priceLabel = product.isExternal
                  ? "Mercado Libre"
                  : prices.length === 0
                  ? "Sin precio"
                  : prices.length === 1
                  ? formatCents(prices[0])
                  : `${formatCents(Math.min(...prices))} – ${formatCents(Math.max(...prices))}`;
                const thumb = product.images[0]?.url;
                return (
                  <Link
                    key={product.id}
                    href={`/admin/productos/${product.id}`}
                    className="flex items-center gap-3 rounded-md border border-black/10 dark:border-white/15 px-3 py-2 hover:border-black/30 dark:hover:border-white/40"
                  >
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="h-10 w-10 rounded object-cover flex-none" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-black/5 dark:bg-white/10 flex-none" />
                    )}
                    <div className="flex-1 text-sm">
                      <span className="font-medium">{product.name}</span>
                      {product.category && (
                        <span className="text-black/50 dark:text-white/50"> · {product.category.name}</span>
                      )}
                      {!product.active && (
                        <span className="ml-2 text-red-600 dark:text-red-400 text-xs font-medium">Inactivo</span>
                      )}
                    </div>
                    <span className="text-sm text-black/60 dark:text-white/60 flex-none">{priceLabel}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
