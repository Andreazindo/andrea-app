import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { ProductCard } from "@/components/zindo/ProductCard";
import { zindoFontVars, zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";

async function getBrandWithCatalog(brandSlug: string) {
  return prisma.brand.findUnique({
    where: { slug: brandSlug },
    include: {
      categories: {
        orderBy: { name: "asc" },
        include: {
          products: {
            where: { active: true },
            orderBy: { name: "asc" },
            include: {
              variants: { where: { active: true } },
              images: { orderBy: { position: "asc" } },
            },
          },
        },
      },
    },
  });
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandSlug } = await params;

  const brand = await getBrandWithCatalog(brandSlug);

  if (!brand || !brand.active) notFound();

  return (
    <div className={zindoFontVars} style={{ backgroundColor: zindoColors.ivory }}>
      <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill priority className="object-cover" />
        <div className="relative z-10">
          <ZindoBackLink href="/tienda" label="Tienda Wellness" />
          <Image
            src="/zindo/logo.png"
            alt="Zindo"
            width={1080}
            height={1080}
            className="mt-3 w-72 sm:w-96 mx-auto h-auto"
            priority
          />
          <p
            className="mt-6 text-sm sm:text-base tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.green }}
          >
            {brand.code === "ZINDO" ? "“Tu mente crea tu realidad”" : brand.name}
          </p>
          {brand.description && (
            <p
              className="mt-4 max-w-xl mx-auto text-sm sm:text-base"
              style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
            >
              {brand.description}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-14">
        {brand.categories.map((category) => {
          const products = category.products;
          if (products.length === 0) return null;
          return (
            <section key={category.id}>
              <h2
                className="text-xl sm:text-2xl uppercase tracking-[0.15em] mb-6"
                style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
              >
                {category.name}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
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
                        href={`/tienda/${brand.slug}/${product.slug}`}
                        name={product.name}
                        description={product.description}
                        priceLabel={priceLabel}
                        images={product.images}
                      />
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
