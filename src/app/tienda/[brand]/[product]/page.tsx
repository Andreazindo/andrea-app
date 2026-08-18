import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { getAvailableStock } from "@/lib/inventory";
import { addToCartAction } from "@/app/carrito/actions";
import { zindoFontVars, zindoColors } from "@/components/zindo/theme";
import type { Product, ProductVariant, KitComponent } from "@/generated/prisma/client";

type VariantWithStock = {
  variant: ProductVariant & {
    kitComponents: (KitComponent & {
      componentVariant: ProductVariant & { product: Product };
    })[];
  };
  availableStock: number | null;
};

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
    <div className={zindoFontVars} style={{ backgroundColor: zindoColors.ivory, minHeight: "100%" }}>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="text-sm mb-6" style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.green }}>
          <Link href={`/tienda/${brand.slug}`} className="hover:underline">
            {brand.name}
          </Link>
          <span className="mx-1">/</span>
          <span>{product.name}</span>
        </nav>

        <h1
          className="text-2xl sm:text-3xl uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
        >
          {product.name}
        </h1>
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
  );
}
