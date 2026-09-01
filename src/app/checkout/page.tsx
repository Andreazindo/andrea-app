import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { createOrderAction } from "./actions";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { zindoColors } from "@/components/zindo/theme";

export const metadata: Metadata = { title: "Datos de envío" };

const inputClass = "w-full rounded-md border bg-white px-3 py-2 text-sm";
const inputStyle = { borderColor: zindoColors.sage, color: zindoColors.ink };
const labelClass = "block text-sm font-medium mb-1";

function computeDiscountCents(coupon: { type: string; value: number }, subtotalCents: number): number {
  if (coupon.type === "PERCENT") return Math.round((subtotalCents * coupon.value) / 100);
  return Math.min(coupon.value, subtotalCents);
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; coupon?: string }>;
}) {
  const { error, coupon: couponCodeParam } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/checkout");

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { productVariant: { include: { product: true } } } } },
  });

  const items = cart?.items ?? [];
  if (items.length === 0) redirect("/carrito");

  const subtotal = items.reduce((sum, item) => sum + item.productVariant.priceCents * item.quantity, 0);

  let appliedCoupon: { code: string; type: string; value: number } | null = null;
  let couponError: string | null = null;
  if (couponCodeParam) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCodeParam.trim().toUpperCase() } });
    const expired = coupon?.expiresAt ? coupon.expiresAt < new Date() : false;
    const exhausted = coupon?.maxRedemptions !== null && coupon?.maxRedemptions !== undefined && coupon.redemptions >= coupon.maxRedemptions;
    if (!coupon || !coupon.active || expired || exhausted) {
      couponError = "Ese código no es válido o ya venció.";
    } else {
      appliedCoupon = coupon;
    }
  }

  const discount = appliedCoupon ? computeDiscountCents(appliedCoupon, subtotal) : 0;
  const total = subtotal - discount;

  return (
    <ZindoContentPage title="Datos de envío" backHref="/carrito" backLabel="Carrito">
      {error === "datos-incompletos" && (
        <p className="mb-4 rounded-md bg-red-500/10 text-red-600 text-sm px-3 py-2">
          Completa todos los campos para continuar.
        </p>
      )}
      {error === "cupon-invalido" && (
        <p className="mb-4 rounded-md bg-red-500/10 text-red-600 text-sm px-3 py-2">
          Ese código de descuento ya no es válido, quítalo para continuar.
        </p>
      )}

      <div className="rounded-lg bg-white/70 border p-4 mb-6" style={{ borderColor: zindoColors.sage }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: zindoColors.green }}>
          Resumen
        </h2>
        <ul className="space-y-1 text-sm" style={{ color: zindoColors.ink }}>
          {items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.quantity}× {item.productVariant.product.name} — {item.productVariant.name}
              </span>
              <span>{formatCents(item.productVariant.priceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <form method="GET" className="mt-3 pt-3 border-t flex gap-2" style={{ borderColor: zindoColors.sage }}>
          <input
            type="text"
            name="coupon"
            defaultValue={appliedCoupon?.code ?? couponCodeParam ?? ""}
            placeholder="Código de descuento"
            className={`flex-1 ${inputClass}`}
            style={inputStyle}
          />
          <button
            type="submit"
            className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-white transition-colors"
            style={{ borderColor: zindoColors.sage, color: zindoColors.green }}
          >
            Aplicar
          </button>
        </form>
        {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}
        {appliedCoupon && (
          <p className="mt-2 text-xs" style={{ color: zindoColors.green }}>
            Código {appliedCoupon.code} aplicado.{" "}
            <a href="/checkout" className="underline">
              Quitar
            </a>
          </p>
        )}

        {appliedCoupon && (
          <div className="mt-3 pt-3 border-t flex justify-between text-sm" style={{ borderColor: zindoColors.sage, color: zindoColors.ink }}>
            <span>Subtotal</span>
            <span>{formatCents(subtotal)}</span>
          </div>
        )}
        {appliedCoupon && (
          <div className="flex justify-between text-sm" style={{ color: zindoColors.green }}>
            <span>Descuento</span>
            <span>-{formatCents(discount)}</span>
          </div>
        )}
        <div className="mt-3 pt-3 border-t flex justify-between font-semibold" style={{ borderColor: zindoColors.sage, color: zindoColors.green }}>
          <span>Total</span>
          <span>{formatCents(total)}</span>
        </div>
        <p className="mt-3 text-xs" style={{ color: zindoColors.ink, opacity: 0.6 }}>
          El costo de envío no está incluido. Te lo confirmamos por WhatsApp según tu dirección, antes de despachar tu pedido.
        </p>
      </div>

      <form action={createOrderAction} className="space-y-4">
        {appliedCoupon && <input type="hidden" name="couponCode" value={appliedCoupon.code} />}
        <div>
          <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="shippingName">
            Nombre completo
          </label>
          <input
            id="shippingName"
            name="shippingName"
            required
            defaultValue={session.user.name ?? ""}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="shippingPhone">
            Teléfono
          </label>
          <input id="shippingPhone" name="shippingPhone" type="tel" required className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="shippingAddressLine">
            Dirección
          </label>
          <input id="shippingAddressLine" name="shippingAddressLine" required className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="shippingCountry">
            País
          </label>
          <select id="shippingCountry" name="shippingCountry" required defaultValue="MX" className={inputClass} style={inputStyle}>
            <option value="MX">México</option>
            <option value="US">Estados Unidos</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="shippingCity">
              Ciudad
            </label>
            <input id="shippingCity" name="shippingCity" required className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="shippingState">
              Estado
            </label>
            <input id="shippingState" name="shippingState" required className={inputClass} style={inputStyle} />
          </div>
        </div>
        <div>
          <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="shippingZip">
            Código postal
          </label>
          <input id="shippingZip" name="shippingZip" required className={inputClass} style={inputStyle} />
        </div>
        <div className="rounded-lg bg-white/70 border p-4 space-y-3" style={{ borderColor: zindoColors.sage }}>
          <label className="flex items-center gap-2 text-sm font-medium" style={{ color: zindoColors.ink }}>
            <input type="checkbox" name="isGift" value="1" />
            🎁 Es un regalo
          </label>
          <div>
            <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="giftMessage">
              Mensaje para incluir (opcional)
            </label>
            <textarea
              id="giftMessage"
              name="giftMessage"
              rows={3}
              placeholder="Ej. ¡Feliz cumpleaños! Con cariño, ..."
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-md px-4 py-3 text-sm font-medium text-white hover:opacity-90"
          style={{ backgroundColor: zindoColors.green }}
        >
          Continuar al pago
        </button>
      </form>
    </ZindoContentPage>
  );
}
