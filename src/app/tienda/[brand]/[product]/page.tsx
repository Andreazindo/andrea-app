import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { getAvailableStock } from "@/lib/inventory";
import { addToCartAction } from "@/app/carrito/actions";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ brand: string; product: string }>;
}) {
  const { brand: brandSlug, product: productSlug } = await params;

  const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
  if (!brand || !brand.active) notFound();

  const product = await prisma.product.findUnique({
    where: { brandId_slug: { brandId: brand.id, slug: productSlug } },
    include: {
      variants: {
        where: { active: true },
        include: {
          kitComponents: { include: { componentVariant: { include: { product: true } } } },
        },
      },
    },
  });

  if (!product || !product.active) notFound();

  const variantsWithStock = await Promise.all(
    product.variants.map(async (variant) => ({
      variant,
      availableStock: await getAvailableStock(variant),
    }))
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm text-black/50 dark:text-white/50 mb-6">
        <Link href={`/tienda/${brand.slug}`} className="hover:underline">
          {brand.name}
        </Link>
        <span className="mx-1">/</span>
        <span>{product.name}</span>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
      {product.description && (
        <p className="mt-3 text-black/70 dark:text-white/70">{product.description}</p>
      )}

      {product.isExternal ? (
        <div className="mt-8 rounded-lg border border-black/10 dark:border-white/15 p-6">
          <p className="text-sm text-black/60 dark:text-white/60 mb-4">
            Este producto se vende en Mercado Libre.
          </p>
          {product.externalUrl ? (
            <a
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium"
            >
              Comprar en Mercado Libre
            </a>
          ) : (
            <p className="text-sm text-black/50 dark:text-white/50">
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
                className="rounded-lg border border-black/10 dark:border-white/15 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="font-medium">{variant.name}</p>
                  {isKit && (
                    <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                      Incluye:{" "}
                      {variant.kitComponents
                        .map((kc) => `${kc.componentVariant.product.name} (${kc.componentVariant.name})`)
                        .join(", ")}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                    {outOfStock
                      ? "Agotado"
                      : availableStock !== null
                      ? `${availableStock} disponibles`
                      : "Disponible"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">{formatCents(variant.priceCents)}</span>
                  {outOfStock ? (
                    <button
                      type="button"
                      disabled
                      className="rounded-md bg-black/20 dark:bg-white/20 text-black/50 dark:text-white/50 px-4 py-2 text-sm font-medium cursor-not-allowed"
                    >
                      Agotado
                    </button>
                  ) : (
                    <form action={addToCartAction}>
                      <input type="hidden" name="variantId" value={variant.id} />
                      <input type="hidden" name="quantity" value={1} />
                      <button
                        type="submit"
                        className="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
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
  );
}
