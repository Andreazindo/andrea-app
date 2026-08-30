import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { createOrderAction } from "./actions";
import { PlainBackLink } from "@/components/BackLink";

export const metadata: Metadata = { title: "Datos de envío" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/checkout");

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { productVariant: { include: { product: true } } } } },
  });

  const items = cart?.items ?? [];
  if (items.length === 0) redirect("/carrito");

  const total = items.reduce((sum, item) => sum + item.productVariant.priceCents * item.quantity, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PlainBackLink href="/carrito" label="Carrito" />
      <h1 className="text-2xl font-bold tracking-tight mt-3 mb-6">Datos de envío</h1>

      {error === "datos-incompletos" && (
        <p className="mb-4 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-3 py-2">
          Completa todos los campos para continuar.
        </p>
      )}

      <div className="rounded-lg border border-black/10 dark:border-white/15 p-4 mb-6">
        <h2 className="text-sm font-semibold mb-3">Resumen</h2>
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.quantity}× {item.productVariant.product.name} — {item.productVariant.name}
              </span>
              <span>{formatCents(item.productVariant.priceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/15 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCents(total)}</span>
        </div>
      </div>

      <form action={createOrderAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="shippingName">
            Nombre completo
          </label>
          <input
            id="shippingName"
            name="shippingName"
            required
            defaultValue={session.user.name ?? ""}
            className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="shippingPhone">
            Teléfono
          </label>
          <input
            id="shippingPhone"
            name="shippingPhone"
            type="tel"
            required
            className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="shippingAddressLine">
            Dirección
          </label>
          <input
            id="shippingAddressLine"
            name="shippingAddressLine"
            required
            className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="shippingCity">
              Ciudad
            </label>
            <input
              id="shippingCity"
              name="shippingCity"
              required
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
              required
              className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="shippingZip">
            Código postal
          </label>
          <input
            id="shippingZip"
            name="shippingZip"
            required
            className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-3 text-sm font-medium hover:opacity-90"
        >
          Continuar al pago
        </button>
      </form>
    </div>
  );
}
