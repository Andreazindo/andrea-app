import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandSlug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug: brandSlug },
    include: {
      categories: {
        orderBy: { name: "asc" },
        include: {
          products: {
            where: { active: true },
            orderBy: { name: "asc" },
            include: { variants: { where: { active: true } } },
          },
        },
      },
    },
  });

  if (!brand || !brand.active) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">{brand.name}</h1>
      {brand.description && (
        <p className="mt-2 text-black/60 dark:text-white/60">{brand.description}</p>
      )}

      <div className="mt-8 space-y-10">
        {brand.categories.map((category) => {
          const products = category.products;
          if (products.length === 0) return null;
          return (
            <section key={category.id}>
              <h2 className="text-lg font-semibold mb-4">{category.name}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {
                  const prices = product.variants.map((v) => v.priceCents);
                  const minPrice = prices.length ? Math.min(...prices) : null;
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/tienda/${brand.slug}/${product.slug}`}
                        className="block h-full rounded-lg border border-black/10 dark:border-white/15 p-4 hover:border-black/30 dark:hover:border-white/40 transition-colors"
                      >
                        <h3 className="font-medium">{product.name}</h3>
                        {product.description && (
                          <p className="mt-1 text-sm text-black/60 dark:text-white/60 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <p className="mt-3 text-sm font-semibold">
                          {product.isExternal
                            ? "Ver en Mercado Libre"
                            : minPrice !== null
                            ? `Desde ${formatCents(minPrice)}`
                            : "Consultar precio"}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
