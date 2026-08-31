import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { getAvailableStock } from "@/lib/inventory";
import { addToCartAction } from "@/app/carrito/actions";
import { ProductGallery } from "@/components/zindo/ProductGallery";
import { FavoriteButton } from "@/components/zindo/FavoriteButton";
import { zindoFontVars, zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";
import { getFavoritedProductIds } from "@/lib/favorites";
import { auth } from "@/lib/auth";

type Params = { brand: string; product: string };

const getProduct = cache(async (brandSlug: string, productSlug: string) => {
  const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
  if (!brand || !brand.active) return null;

  const product = await prisma.product.findUnique({
    where: { brandId_slug: { brandId: brand.id, slug: productSlug } },
    include: {
      category: true,
      variants: {
        where: { active: true },
        include: {
          kitComponents: { include: { componentVariant: { include: { product: true } } } },
        },
      },
      images: { orderBy: { position: "asc" } },
    },
  });
  if (!product || !product.active) return null;

  return product;
});

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { brand: brandSlug, product: productSlug } = await params;
  const product = await getProduct(brandSlug, productSlug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: product.images[0] ? { images: [{ url: product.images[0].url }] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { brand: brandSlug, product: productSlug } = await params;
  const product = await getProduct(brandSlug, productSlug);
  if (!product) notFound();

  // Los productos de la categoría "Programa" se muestran solo en Evolución Personal,
  // no en el listado de Tienda Wellness, así que su botón de volver debe apuntar ahí.
  const back =
    product.category?.slug === "programa"
      ? { href: "/evolucion-personal", label: "Evolución Personal" }
      : { href: "/tienda", label: "Tienda Wellness" };

  const variantsWithStock = await Promise.all(
    product.variants.map(async (variant) => ({
      variant,
      availableStock: await getAvailableStock(variant),
    }))
  );

  const path = `/tienda/${brandSlug}/${productSlug}`;
  const [session, favoritedIds] = await Promise.all([auth(), getFavoritedProductIds([product.id])]);
  const canFavorite = Boolean(session?.user?.id);

  return (
    <div className={zindoFontVars} style={{ backgroundColor: zindoColors.ivory, minHeight: "100%" }}>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <nav className="mb-6 flex items-center gap-2">
          <ZindoBackLink href={back.href} label={back.label} />
          <span className="text-sm" style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink, opacity: 0.5 }}>
            / {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="md:max-w-md">
            <ProductGallery name={product.name} images={product.images} />
          </div>

          <div>
            <div className="flex items-start justify-between gap-3">
              <h1
                className="text-2xl sm:text-3xl uppercase tracking-[0.1em]"
                style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
              >
                {product.name}
              </h1>
              <FavoriteButton
                productId={product.id}
                initialFavorited={favoritedIds.has(product.id)}
                canFavorite={canFavorite}
                path={path}
                size="lg"
                className="flex-none flex items-center justify-center rounded-full border border-[#9CBA9D] p-2 hover:bg-white/60 transition-colors"
              />
            </div>
            {product.description && (
              <p className="mt-3" style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}>
                {product.description}
              </p>
            )}

            {product.isExternal ? (
          <div className="mt-8 rounded-lg bg-white/70 border p-6" style={{ borderColor: zindoColors.sage }}>
            <p className="text-sm mb-4" style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}>
              Este producto se vende en Mercado Libre.
            </p>
            {product.externalUrl ? (
              <a
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: zindoColors.green }}
              >
                Comprar en Mercado Libre
              </a>
            ) : (
              <p className="text-sm" style={{ color: zindoColors.ink, opacity: 0.6 }}>
                Enlace de Mercado Libre pendiente de agregar.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {variantsWithStock.map(({ variant, availableStock }) => {
              const isKit = variant.kitComponents.length > 0;
              const outOfStock = availableStock !== null && availableStock <= 0;
              return (
                <div
                  key={variant.id}
                  className="rounded-lg bg-white/70 border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  style={{ borderColor: zindoColors.sage, fontFamily: "var(--font-zindo-body)" }}
                >
                  <div>
                    <p className="font-semibold" style={{ color: zindoColors.ink }}>
                      {variant.name}
                    </p>
                    {isKit && (
                      <p className="mt-1 text-xs" style={{ color: zindoColors.ink, opacity: 0.6 }}>
                        Incluye:{" "}
                        {variant.kitComponents
                          .map((kc) => `${kc.componentVariant.product.name} (${kc.componentVariant.name})`)
                          .join(", ")}
                      </p>
                    )}
                    <p className="mt-1 text-sm" style={{ color: zindoColors.ink, opacity: 0.7 }}>
                      {outOfStock
                        ? "Agotado"
                        : availableStock !== null
                        ? `${availableStock} disponibles`
                        : "Disponible"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold" style={{ color: zindoColors.green }}>
                      {formatCents(variant.priceCents)}
                    </span>
                    {outOfStock ? (
                      <button
                        type="button"
                        disabled
                        className="rounded-md px-4 py-2 text-sm font-medium cursor-not-allowed"
                        style={{ backgroundColor: "#00000020", color: zindoColors.ink }}
                      >
                        Agotado
                      </button>
                    ) : (
                      <form action={addToCartAction}>
                        <input type="hidden" name="variantId" value={variant.id} />
                        <input type="hidden" name="quantity" value={1} />
                        <button
                          type="submit"
                          className="rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                          style={{ backgroundColor: zindoColors.green }}
                        >
                          Agregar al carrito
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
