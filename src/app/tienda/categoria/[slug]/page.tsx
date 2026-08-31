import Image from "next/image";
import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { ProductCard } from "@/components/zindo/ProductCard";
import { ZindoMarbleFade } from "@/components/zindo/MarbleFade";
import { zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";

const getCategory = cache(async (slug: string) => {
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
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: category?.name ?? "Tienda Wellness" };
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
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
        <ZindoMarbleFade />
        <div className="relative z-10">
          <h1
            className="text-2xl sm:text-3xl uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            {category.name}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-6">
        <ZindoBackLink href="/tienda" label="Tienda Wellness" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
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
                  productId={product.id}
                  likesCount={product.likesCount}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
