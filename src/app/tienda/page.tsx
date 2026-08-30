import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/zindo/ProductCard";
import { formatCents } from "@/lib/money";
import { zindoColors } from "@/components/zindo/theme";

const CATEGORY_ORDER = ["yoga-face", "limpieza", "suplementos", "esencias", "catalogo-ml"];

async function getWellnessCategories() {
  const categories = await prisma.category.findMany({
    where: { slug: { in: CATEGORY_ORDER } },
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

  return CATEGORY_ORDER.map((slug) => categories.find((c) => c.slug === slug)).filter(
    (c): c is (typeof categories)[number] => Boolean(c)
  );
}

export default async function TiendaPage() {
  const categories = await getWellnessCategories();

  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 pt-14 pb-6 text-center">
        <h1
          className="text-2xl sm:text-3xl uppercase tracking-[0.15em]"
          style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
        >
          Tienda Wellness
        </h1>
        <p
          className="mt-3 max-w-lg mx-auto text-sm sm:text-base"
          style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
        >
          Elige lo que suma a tu bienestar.
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-16 space-y-14">
        {categories.map((category) => {
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
