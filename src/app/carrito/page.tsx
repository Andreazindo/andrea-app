import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { updateCartItemAction, removeCartItemAction } from "@/app/carrito/actions";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { zindoColors } from "@/components/zindo/theme";

export const metadata: Metadata = { title: "Carrito" };

export default async function CarritoPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/carrito");

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { productVariant: { include: { product: { include: { brand: true } } } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => sum + item.productVariant.priceCents * item.quantity, 0);

  return (
    <ZindoContentPage title="Carrito" backHref="/tienda" backLabel="Tienda">
      {items.length === 0 ? (
        <div className="rounded-lg bg-white/70 border p-6 text-center" style={{ borderColor: zindoColors.sage }}>
          <p style={{ color: zindoColors.ink, opacity: 0.7 }}>Tu carrito está vacío.</p>
          <Link href="/tienda" className="mt-3 inline-block text-sm font-medium hover:underline" style={{ color: zindoColors.gold }}>
            Ir a la tienda →
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg bg-white/70 border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                style={{ borderColor: zindoColors.sage }}
              >
                <div>
                  <p className="text-xs" style={{ color: zindoColors.ink, opacity: 0.55 }}>
                    {item.productVariant.product.brand.name}
                  </p>
                  <p className="font-medium" style={{ color: zindoColors.ink }}>
                    {item.productVariant.product.name}
                  </p>
                  <p className="text-sm" style={{ color: zindoColors.ink, opacity: 0.7 }}>
                    {item.productVariant.name}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: zindoColors.ink, opacity: 0.85 }}>
                    {formatCents(item.productVariant.priceCents)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <form action={updateCartItemAction} className="flex items-center gap-2">
                    <input type="hidden" name="itemId" value={item.id} />
                    <input
                      type="number"
                      name="quantity"
                      min={0}
                      defaultValue={item.quantity}
                      className="w-16 rounded-md border bg-white px-2 py-1 text-sm"
                      style={{ borderColor: zindoColors.sage, color: zindoColors.ink }}
                    />
                    <button
                      type="submit"
                      className="rounded-md border px-3 py-1 text-sm font-medium hover:bg-white transition-colors"
                      style={{ borderColor: zindoColors.sage, color: zindoColors.green }}
                    >
                      Actualizar
                    </button>
                  </form>
                  <form action={removeCartItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button type="submit" className="text-sm text-red-600 hover:underline">
                      Quitar
                    </button>
                  </form>
                  <span className="font-semibold w-24 text-right" style={{ color: zindoColors.green }}>
                    {formatCents(item.productVariant.priceCents * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: zindoColors.sage }}>
            <span className="text-lg font-semibold" style={{ color: zindoColors.green }}>
              Total
            </span>
            <span className="text-lg font-semibold" style={{ color: zindoColors.green }}>
              {formatCents(total)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block w-full text-center rounded-md px-4 py-3 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: zindoColors.green }}
          >
            Continuar al pago
          </Link>
        </>
      )}
    </ZindoContentPage>
  );
}
