import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { updateCartItemAction, removeCartItemAction } from "@/app/carrito/actions";

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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/tienda" className="text-sm text-black/60 dark:text-white/60 hover:underline">
        ← Tienda
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mt-1 mb-6">Carrito</h1>

      {items.length === 0 ? (
        <div className="rounded-lg border border-black/10 dark:border-white/15 p-6 text-center">
          <p className="text-black/60 dark:text-white/60">Tu carrito está vacío.</p>
          <Link href="/tienda" className="mt-3 inline-block text-sm font-medium hover:underline">
            Ir a la tienda →
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-black/10 dark:border-white/15 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50">
                    {item.productVariant.product.brand.name}
                  </p>
                  <p className="font-medium">{item.productVariant.product.name}</p>
                  <p className="text-sm text-black/60 dark:text-white/60">{item.productVariant.name}</p>
                  <p className="mt-1 text-sm">{formatCents(item.productVariant.priceCents)} c/u</p>
                </div>
                <div className="flex items-center gap-3">
                  <form action={updateCartItemAction} className="flex items-center gap-2">
                    <input type="hidden" name="itemId" value={item.id} />
                    <input
                      type="number"
                      name="quantity"
                      min={0}
                      defaultValue={item.quantity}
                      className="w-16 rounded-md border border-black/15 dark:border-white/20 bg-transparent px-2 py-1 text-sm"
                    />
                    <button
                      type="submit"
                      className="rounded-md border border-black/15 dark:border-white/20 px-3 py-1 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      Actualizar
                    </button>
                  </form>
                  <form action={removeCartItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button
                      type="submit"
                      className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                      Quitar
                    </button>
                  </form>
                  <span className="font-semibold w-24 text-right">
                    {formatCents(item.productVariant.priceCents * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-black/10 dark:border-white/15 pt-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">{formatCents(total)}</span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block w-full text-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-3 text-sm font-medium hover:opacity-90"
          >
            Continuar al pago
          </Link>
        </>
      )}
    </div>
  );
}
