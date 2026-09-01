import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { getAvailableStock } from "@/lib/inventory";
import { addToCartAction } from "@/app/carrito/actions";
import { submitReviewAction } from "./review-actions";
import { ProductGallery } from "@/components/zindo/ProductGallery";
import { LikeButton } from "@/components/zindo/LikeButton";
import { zindoFontVars, zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";

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

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ resenaEnviada?: string; resenaError?: string }>;
}) {
  const { brand: brandSlug, product: productSlug } = await params;
  const { resenaEnviada, resenaError } = await searchParams;
  const product = await getProduct(brandSlug, productSlug);
  if (!product) notFound();

  const session = await auth();

  const [approvedReviews, myReview] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id, approved: true },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    session?.user?.id
      ? prisma.review.findUnique({
          where: { productId_userId: { productId: product.id, userId: session.user.id } },
        })
      : null,
  ]);

  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
      : null;

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
              <LikeButton
                productId={product.id}
                initialCount={product.likesCount}
                path={path}
                size="lg"
                className="flex-none flex items-center gap-1 rounded-full border border-[#9CBA9D] p-2 hover:bg-white/60 transition-colors"
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

        <div className="mt-16 max-w-2xl">
          <h2
            className="text-lg uppercase tracking-[0.1em] mb-4"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            Reseñas {averageRating !== null && `· ${averageRating.toFixed(1)} / 5 (${approvedReviews.length})`}
          </h2>

          {resenaEnviada && (
            <p className="mb-4 text-sm rounded-md px-3 py-2" style={{ backgroundColor: "#0D3B3620", color: zindoColors.green }}>
              Gracias, tu reseña se envió y quedará visible en cuanto la aprobemos.
            </p>
          )}
          {resenaError && (
            <p className="mb-4 text-sm rounded-md px-3 py-2 bg-red-500/10 text-red-600">
              Elige una calificación de 1 a 5.
            </p>
          )}

          {approvedReviews.length === 0 ? (
            <p className="text-sm" style={{ color: zindoColors.ink, opacity: 0.6 }}>
              Este producto todavía no tiene reseñas.
            </p>
          ) : (
            <ul className="space-y-4 mb-8">
              {approvedReviews.map((review) => (
                <li key={review.id} className="rounded-lg bg-white/70 border p-4" style={{ borderColor: zindoColors.sage }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: zindoColors.ink }}>
                      {review.user.name}
                    </span>
                    <span style={{ color: zindoColors.gold }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  </div>
                  {review.comment && (
                    <p className="mt-1 text-sm" style={{ color: zindoColors.ink, opacity: 0.8 }}>
                      {review.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {session?.user?.id ? (
            <div className="rounded-lg bg-white/70 border p-4" style={{ borderColor: zindoColors.sage }}>
              <p className="text-sm font-semibold mb-3" style={{ color: zindoColors.ink }}>
                {myReview ? "Actualiza tu reseña" : "Deja tu reseña"}
              </p>
              <form action={submitReviewAction} className="space-y-3">
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="path" value={`/tienda/${brandSlug}/${productSlug}`} />
                <div>
                  <label className="block text-sm mb-1" style={{ color: zindoColors.ink }}>
                    Calificación
                  </label>
                  <select
                    name="rating"
                    defaultValue={myReview?.rating ?? 5}
                    className="rounded-md border px-3 py-2 text-sm"
                    style={{ borderColor: zindoColors.sage }}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {"★".repeat(n)} ({n})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: zindoColors.ink }}>
                    Comentario (opcional)
                  </label>
                  <textarea
                    name="comment"
                    rows={3}
                    defaultValue={myReview?.comment ?? ""}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    style={{ borderColor: zindoColors.sage }}
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                  style={{ backgroundColor: zindoColors.green }}
                >
                  {myReview ? "Actualizar reseña" : "Enviar reseña"}
                </button>
                {myReview && !myReview.approved && (
                  <p className="text-xs" style={{ color: zindoColors.ink, opacity: 0.5 }}>
                    Tu reseña está pendiente de aprobación.
                  </p>
                )}
              </form>
            </div>
          ) : (
            <p className="text-sm" style={{ color: zindoColors.ink, opacity: 0.6 }}>
              <a href="/login" className="underline">
                Inicia sesión
              </a>{" "}
              para dejar tu reseña.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
