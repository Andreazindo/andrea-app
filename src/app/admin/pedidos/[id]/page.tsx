import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PlainBackLink } from "@/components/BackLink";
import { updateOrderStatusAction, updateOrderShippingAction, updateOrderShippingCostAction, markWhatsappConfirmedAction } from "./actions";
import { whatsappLinkForOrder, whatsappShippingQuoteLink } from "@/lib/order-messages";
import {
  AdminPageHeader,
  AdminSectionTitle,
  adminCardClass as sectionClass,
  adminInputClass as inputClass,
  adminLabelClass as labelClass,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
} from "@/components/admin/ui";

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado",
  PROCESSING: "En preparación",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  MERCADO_PAGO: "Mercado Pago",
  PAYPAL: "PayPal",
  MANUAL_TRANSFER: "Transferencia",
  MANUAL_CASH: "Efectivo",
};

const ERROR_MESSAGES: Record<string, string> = {
  "estatus-invalido": "Elige un estatus válido.",
  "envio-invalido": "Completa nombre, teléfono, dirección, ciudad, estado y C.P.",
  "envio-costo-invalido": "Ingresa un costo de envío válido.",
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Pedido #${id.slice(-8).toUpperCase()} (Admin)` };
}

export default async function PedidoAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; guardado?: string }>;
}) {
  await requireAdmin("/admin/pedidos");
  const { id } = await params;
  const { error, guardado } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: true,
      coupon: { select: { code: true } },
      payments: { orderBy: { createdAt: "desc" }, include: { recordedByUser: { select: { name: true } } } },
    },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <div>
        <PlainBackLink href="/admin/pedidos" label="Pedidos" />
        <div className="mt-3">
          <AdminPageHeader title={`Pedido #${order.id.slice(-8).toUpperCase()}`} subtitle={new Date(order.createdAt).toLocaleString("es-MX")} />
        </div>
      </div>

      {guardado && (
        <p className="rounded-md bg-[#0D3B36]/10 text-[#0D3B36] text-sm px-3 py-2 font-medium">Cambios guardados.</p>
      )}
      {error && (
        <p className="rounded-md bg-red-500/10 text-red-600 text-sm px-3 py-2">
          {ERROR_MESSAGES[error] ?? "Revisa el formulario."}
        </p>
      )}

      <section className={sectionClass}>
        <AdminSectionTitle>Estatus</AdminSectionTitle>
        <form action={updateOrderStatusAction} className="flex items-center gap-3">
          <input type="hidden" name="orderId" value={order.id} />
          <select name="status" defaultValue={order.status} className={inputClass}>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button type="submit" className={adminButtonPrimaryClass}>
            Guardar
          </button>
        </form>
      </section>

      <section className={sectionClass}>
        <AdminSectionTitle>Cliente</AdminSectionTitle>
        <p className="text-sm text-[#1A1A1A]">
          {order.user.name} · {order.user.email}
          {order.user.phone && ` · ${order.user.phone}`}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={whatsappLinkForOrder(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-[#25D366] text-white px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Enviar confirmación por WhatsApp
          </a>
          {order.whatsappConfirmedAt ? (
            <span className="text-xs text-[#1A1A1A]/50">
              Confirmado el {new Date(order.whatsappConfirmedAt).toLocaleString("es-MX")}
            </span>
          ) : (
            <form action={markWhatsappConfirmedAction}>
              <input type="hidden" name="orderId" value={order.id} />
              <button type="submit" className={adminButtonSecondaryClass}>
                Marcar como confirmado
              </button>
            </form>
          )}
        </div>
      </section>

      <section className={sectionClass}>
        <AdminSectionTitle>Envío</AdminSectionTitle>
        <form action={updateOrderShippingAction} className="space-y-3">
          <input type="hidden" name="orderId" value={order.id} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="shippingName">
                Nombre
              </label>
              <input id="shippingName" name="shippingName" defaultValue={order.shippingName} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="shippingPhone">
                Teléfono
              </label>
              <input
                id="shippingPhone"
                name="shippingPhone"
                defaultValue={order.shippingPhone}
                required
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="shippingAddressLine">
              Dirección
            </label>
            <input
              id="shippingAddressLine"
              name="shippingAddressLine"
              defaultValue={order.shippingAddressLine}
              required
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass} htmlFor="shippingCity">
                Ciudad
              </label>
              <input
                id="shippingCity"
                name="shippingCity"
                defaultValue={order.shippingCity}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="shippingState">
                Estado
              </label>
              <input
                id="shippingState"
                name="shippingState"
                defaultValue={order.shippingState}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="shippingZip">
                C.P.
              </label>
              <input id="shippingZip" name="shippingZip" defaultValue={order.shippingZip} required className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="shippingCountry">
              País
            </label>
            <input
              id="shippingCountry"
              name="shippingCountry"
              defaultValue={order.shippingCountry}
              className={inputClass}
            />
          </div>
          <button type="submit" className={adminButtonSecondaryClass}>
            Guardar envío
          </button>
        </form>
      </section>

      <section className={sectionClass}>
        <AdminSectionTitle>Costo de envío</AdminSectionTitle>
        <p className="text-sm text-[#1A1A1A]/70">
          {order.shippingCents > 0
            ? order.shippingPaidAt
              ? `Envío pagado el ${new Date(order.shippingPaidAt).toLocaleString("es-MX")}.`
              : "Cotizado, pendiente de pago."
            : "Aún no se ha cotizado el envío."}
        </p>
        <form action={updateOrderShippingCostAction} className="flex items-end gap-3">
          <input type="hidden" name="orderId" value={order.id} />
          <div>
            <label className={labelClass} htmlFor="shippingPrice">
              Costo de envío (MXN)
            </label>
            <input
              id="shippingPrice"
              name="shippingPrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={(order.shippingCents / 100).toFixed(2)}
              required
              className={inputClass}
            />
          </div>
          <button type="submit" className={adminButtonSecondaryClass}>
            Guardar y generar liga de pago
          </button>
        </form>
        {order.shippingCents > 0 && !order.shippingPaidAt && order.shippingPaymentUrl && (
          <a
            href={whatsappShippingQuoteLink(order, formatCents(order.shippingCents), order.shippingPaymentUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-[#25D366] text-white px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Enviar cotización de envío por WhatsApp
          </a>
        )}
      </section>

      <section className={sectionClass}>
        <AdminSectionTitle>Productos</AdminSectionTitle>
        <ul className="space-y-1 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.productName} — {item.variantName} × {item.quantity}
              </span>
              <span className="font-medium">{formatCents(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        {order.discountCents > 0 && (
          <div className="flex justify-between border-t border-[#9CBA9D]/40 pt-3 text-sm text-green-700">
            <span>Descuento{order.coupon ? ` (${order.coupon.code})` : ""}</span>
            <span>-{formatCents(order.discountCents)}</span>
          </div>
        )}
        <div className={`flex justify-between text-sm text-[#1A1A1A] ${order.discountCents > 0 ? "" : "border-t border-[#9CBA9D]/40 pt-3"}`}>
          <span className="text-[#1A1A1A]">Envío</span>
          <span className="text-[#1A1A1A]">{formatCents(order.shippingCents)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-[#0D3B36]">
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>
      </section>

      <section className={sectionClass}>
        <AdminSectionTitle>Pagos</AdminSectionTitle>
        {order.payments.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">Sin pagos registrados.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {order.payments.map((payment) => (
              <li key={payment.id} className="flex flex-col gap-0.5">
                <span>
                  {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method} · {formatCents(payment.amountCents)} ·{" "}
                  <span className="font-medium">{payment.status}</span>
                </span>
                <span className="text-xs text-[#1A1A1A]/50">
                  {new Date(payment.createdAt).toLocaleString("es-MX")}
                  {payment.externalId && ` · ID: ${payment.externalId}`}
                  {payment.recordedByUser && ` · Registrado por ${payment.recordedByUser.name}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
