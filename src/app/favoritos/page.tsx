import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { ProductCard } from "@/components/zindo/ProductCard";
import { PlainBackLink } from "@/components/BackLink";

export const metadata: Metadata = { title: "Favoritos" };

export default async function FavoritosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/favoritos");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: {
          brand: { select: { slug: true } },
          variants: { where: { active: true } },
          images: { orderBy: { position: "asc" } },
        },
      },
    },
  });

  const activeFavorites = favorites.filter((f) => f.product.active);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PlainBackLink href="/tienda" label="Tienda" />
      <h1 className="text-2xl font-bold tracking-tight mt-3 mb-6">Favoritos</h1>

      {activeFavorites.length === 0 ? (
        <div className="rounded-lg border border-black/10 dark:border-white/15 p-6 text-center">
          <p className="text-black/60 dark:text-white/60">Todavía no guardaste ningún producto.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeFavorites.map(({ product }) => {
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
                  href={`/tienda/${product.brand.slug}/${product.slug}`}
                  name={product.name}
                  description={product.description}
                  priceLabel={priceLabel}
                  images={product.images}
                  productId={product.id}
                  isFavorited
                  canFavorite
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
