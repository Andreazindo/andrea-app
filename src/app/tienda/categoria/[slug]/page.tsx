import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { ProductCard } from "@/components/zindo/ProductCard";
import { zindoColors } from "@/components/zindo/theme";

async function getCategory(slug: string) {
  return prisma.category.findFirst({
    where: { slug },
    include: {
      brand: { select: { slug: true } },
      products: {
        where: { active: true },
        orderBy: { name: "asc" },
        include: {
          variants: { where: { active: true } },
          images: { orderBy: { position: "asc" } },
        },
      },
    },
  });
}

export default async function TiendaCategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category || category.products.length === 0) notFound();

  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 pt-14 pb-6 text-center">
        <Link
          href="/tienda"
          className="text-sm hover:underline"
          style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.gold }}
        >
          ‹ Tienda Wellness
        </Link>
        <h1
          className="mt-3 text-2xl sm:text-3xl uppercase tracking-[0.15em]"
          style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
        >
          {category.name}
        </h1>
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-16">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.products.map((product) => {
            const prices = product.variants.map((v) => v.priceCents);
            const minPrice = prices.length ? Math.min(...prices) : null;
            const priceLabel = product.isExternal
              ? "Ver en Mercado Libre"
              : minPrice !== null
              ? `Desde ${formatCents(minPrice)}`
              : "Consultar precio";
            return (
              <li key={product.id}>
                <ProductCard
                  href={`/tienda/${category.brand.slug}/${product.slug}`}
                  name={product.name}
                  description={product.description}
                  priceLabel={priceLabel}
                  images={product.images}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
