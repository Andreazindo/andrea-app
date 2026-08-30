import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { registerManualSaleAction } from "./actions";
import { PlainBackLink } from "@/components/BackLink";

export const metadata: Metadata = { title: "Registrar venta (Admin)" };

const ERROR_MESSAGES: Record<string, string> = {
  "falta-correo": "Ingresa el correo del cliente.",
  "metodo-invalido": "Elige un método de pago válido.",
  "falta-nombre-cliente-nuevo": "Es un cliente nuevo: ingresa su nombre.",
  "sin-productos": "Agrega al menos un producto con cantidad mayor a 0.",
  "stock-insuficiente": "No hay suficiente inventario disponible para uno de los productos.",
};

export default async function NuevaVentaManualPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; producto?: string }>;
}) {
  await requireAdmin();
  const { error, producto } = await searchParams;

  const brands = await prisma.brand.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: {
      categories: {
        orderBy: { name: "asc" },
        include: {
          products: {
            where: { active: true, isExternal: false },
            orderBy: { name: "asc" },
            include: { variants: { where: { active: true }, orderBy: { name: "asc" } } },
          },
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PlainBackLink href="/" label="Inicio" />
      <h1 className="text-2xl font-bold tracking-tight mt-3 mb-1">Registrar venta manual</h1>
      <p className="text-sm text-black/60 dark:text-white/60 mb-6">
        Para ventas cerradas fuera del sistema (transferencia o efectivo) que quieres dejar registradas.
      </p>

      {error && (
        <p className="mb-6 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-3 py-2">
          {ERROR_MESSAGES[error] ?? "No pudimos registrar la venta."}
          {producto ? ` (${producto})` : ""}
        </p>
      )}

      <form action={registerManualSaleAction} className="space-y-8">
        <section className="rounded-lg border border-black/10 dark:border-white/15 p-4 space-y-4">
          <h2 className="text-sm font-semibold">Cliente</h2>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="customerEmail">
              Correo
            </label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              required
              className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <p className="text-xs text-black/50 dark:text-white/50">
            Si el correo ya existe en el sistema, se usa ese cliente. Si es nuevo, completa nombre y teléfono.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="customerName">
                Nombre (cliente nuevo)
              </label>
              <input
                id="customerName"
                name="customerName"
                className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="customerPhone">
                Teléfono
              </label>
              <input
                id="customerPhone"
                name="customerPhone"
                className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-black/10 dark:border-white/15 p-4 space-y-4">
          <h2 className="text-sm font-semibold">Envío (opcional)</h2>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="shippingAddressLine">
              Dirección
            </label>
            <input
              id="shippingAddressLine"
              name="shippingAddressLine"
              className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="shippingCity">
                Ciudad
              </label>
              <input
                id="shippingCity"
                name="shippingCity"
                className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="shippingState">
                Estado
              </label>
              <input
                id="shippingState"
                name="shippingState"
                className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="shippingZip">
                C.P.
              </label>
              <input
                id="shippingZip"
                name="shippingZip"
                className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-black/10 dark:border-white/15 p-4 space-y-4">
          <h2 className="text-sm font-semibold">Pago</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="method">
                Método
              </label>
              <select
                id="method"
                name="method"
                className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
              >
                <option value="MANUAL_TRANSFER">Transferencia</option>
                <option value="MANUAL_CASH">Efectivo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="reference">
                Referencia (opcional)
              </label>
              <input
                id="reference"
                name="reference"
                placeholder="Folio, banco, nota..."
                className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-sm font-semibold">Productos</h2>
          {brands.map((brand) => {
            const hasProducts = brand.categories.some((c) => c.products.length > 0);
            if (!hasProducts) return null;
            return (
              <div key={brand.id}>
                <h3 className="text-sm font-semibold text-black/70 dark:text-white/70 mb-2">{brand.name}</h3>
                <div className="space-y-2">
                  {brand.categories.flatMap((category) =>
                    category.products.flatMap((product) =>
                      product.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="flex items-center justify-between gap-3 rounded-md border border-black/10 dark:border-white/15 px-3 py-2"
                        >
                          <div className="text-sm">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-black/50 dark:text-white/50"> — {variant.name}</span>
                            <span className="text-black/50 dark:text-white/50"> · {formatCents(variant.priceCents)}</span>
                          </div>
                          <input
                            type="number"
                            name={`qty_${variant.id}`}
                            min={0}
                            defaultValue={0}
                            className="w-20 rounded-md border border-black/15 dark:border-white/20 bg-transparent px-2 py-1 text-sm"
                          />
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <button
          type="submit"
          className="w-full rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-3 text-sm font-medium hover:opacity-90"
        >
          Registrar venta
        </button>
      </form>
    </div>
  );
}
