import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { updateProductAction, updateVariantAction, addVariantAction } from "./actions";
import { PlainBackLink } from "@/components/BackLink";
import {
  AdminPageHeader,
  AdminSectionTitle,
  adminCardClass as sectionClass,
  adminInputClass as inputClass,
  adminLabelClass as labelClass,
  adminButtonPrimaryClass as primaryButtonClass,
  adminButtonSecondaryClass as secondaryButtonClass,
} from "@/components/admin/ui";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, select: { name: true } });
  return { title: product ? `${product.name} (Admin)` : "Producto (Admin)" };
}

const ERROR_MESSAGES: Record<string, string> = {
  "falta-nombre": "El nombre es obligatorio.",
  "variante-invalida": "Revisa el nombre y el precio de la variante (debe ser mayor a 0).",
};

export default async function EditarProductoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; guardado?: string; creado?: string }>;
}) {
  await requireAdmin("/admin/productos");
  const { id } = await params;
  const { error, guardado, creado } = await searchParams;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { name: "asc" } },
      images: { orderBy: { position: "asc" } },
    },
  });
  if (!product) notFound();

  const categories = await prisma.category.findMany({
    include: { brand: true },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      <div>
        <PlainBackLink href="/admin/productos" label="Productos" />
        <div className="mt-3">
          <AdminPageHeader title={product.name} />
        </div>
      </div>

      {creado && (
        <p className="rounded-md bg-[#0D3B36]/10 text-[#0D3B36] text-sm px-3 py-2 font-medium">
          Producto creado. Para las fotos, mándamelas por chat y yo las subo por ahora.
        </p>
      )}
      {guardado && (
        <p className="rounded-md bg-[#0D3B36]/10 text-[#0D3B36] text-sm px-3 py-2 font-medium">Cambios guardados.</p>
      )}
      {error && (
        <p className="rounded-md bg-red-500/10 text-red-600 text-sm px-3 py-2">
          {ERROR_MESSAGES[error] ?? "Revisa el formulario."}
        </p>
      )}

      <section className={sectionClass}>
        <AdminSectionTitle>Datos del producto</AdminSectionTitle>
        <form action={updateProductAction} className="space-y-4">
          <input type="hidden" name="productId" value={product.id} />
          <div>
            <label className={labelClass} htmlFor="name">
              Nombre
            </label>
            <input id="name" name="name" defaultValue={product.name} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product.description ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="categoryId">
              Categoría
            </label>
            <select id="categoryId" name="categoryId" defaultValue={product.categoryId ?? ""} className={inputClass}>
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand.name} — {c.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={product.active} />
            Producto activo (visible en la tienda)
          </label>
          <button type="submit" className={primaryButtonClass}>
            Guardar
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <AdminSectionTitle>Fotos</AdminSectionTitle>
        {product.images.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">Sin fotos todavía.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={img.url}
                alt=""
                className="aspect-square w-full rounded-md object-cover border border-[#9CBA9D]/50"
              />
            ))}
          </div>
        )}
        <p className="text-xs text-[#1A1A1A]/50">
          Por ahora las fotos se suben manualmente — mándamelas por chat y las agrego.
        </p>
      </section>

      <section className="space-y-4">
        <AdminSectionTitle>Precios / variantes</AdminSectionTitle>
        {product.variants.map((variant) => (
          <form key={variant.id} action={updateVariantAction} className={sectionClass}>
            <input type="hidden" name="variantId" value={variant.id} />
            <input type="hidden" name="productId" value={product.id} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor={`name-${variant.id}`}>
                  Nombre
                </label>
                <input id={`name-${variant.id}`} name="name" defaultValue={variant.name} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor={`price-${variant.id}`}>
                  Precio (MXN)
                </label>
                <input
                  id={`price-${variant.id}`}
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={(variant.priceCents / 100).toFixed(2)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="trackInventory" defaultChecked={variant.trackInventory} />
                  Controlar inventario
                </label>
                <input name="stock" type="number" min="0" defaultValue={variant.stock} className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={variant.active} />
                Variante activa
              </label>
            </div>
            <button type="submit" className={secondaryButtonClass}>
              Guardar variante
            </button>
          </form>
        ))}

        <details className={sectionClass}>
          <summary className="text-sm font-semibold cursor-pointer text-[#0D3B36]">+ Agregar variante</summary>
          <form action={addVariantAction} className="mt-4 space-y-4">
            <input type="hidden" name="productId" value={product.id} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="new-name">
                  Nombre
                </label>
                <input id="new-name" name="name" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="new-price">
                  Precio (MXN)
                </label>
                <input id="new-price" name="price" type="number" step="0.01" min="0" required className={inputClass} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="trackInventory" defaultChecked />
              Controlar inventario
            </label>
            <div>
              <label className={labelClass} htmlFor="new-stock">
                Stock inicial
              </label>
              <input id="new-stock" name="stock" type="number" min="0" defaultValue={0} className={inputClass} />
            </div>
            <button type="submit" className={secondaryButtonClass}>
              Agregar variante
            </button>
          </form>
        </details>
      </section>
    </div>
  );
}
