import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMercadoPagoPayment } from "@/lib/payments/mercadopago";
import { markOrderPaid } from "@/lib/orders";
import { zindoColors } from "@/components/zindo/theme";

export default async function MercadoPagoEnvioRetornoPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ payment_id?: string; collection_id?: string }>;
}) {
  const { orderId } = await params;
  const sp = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/pedidos/${orderId}`);

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) notFound();

  const paymentId = sp.payment_id ?? sp.collection_id;
  let errorMessage: string | null = null;

  if (paymentId && !order.shippingPaidAt) {
    try {
      const payment = await getMercadoPagoPayment(paymentId);
      if (payment.external_reference !== orderId) {
        errorMessage = "El pago no corresponde a este pedido.";
      } else if (payment.status === "approved") {
        await markOrderPaid({
          orderId,
          method: "MERCADO_PAGO",
          externalId: String(payment.id),
          amountCents: Math.round((payment.transaction_amount ?? 0) * 100),
          rawPayload: payment,
        });
      }
    } catch {
      errorMessage = "No pudimos confirmar el pago del envío con Mercado Pago todavía.";
    }
  }

  const refreshed = await prisma.order.findUnique({ where: { id: orderId } });

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center" style={{ fontFamily: "var(--font-zindo-body)" }}>
      {refreshed?.shippingPaidAt ? (
        <>
          <h1 className="text-2xl tracking-tight mb-2" style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}>
            ¡Envío pagado!
          </h1>
          <p className="mb-6" style={{ color: zindoColors.ink, opacity: 0.7 }}>
            Gracias, ya registramos el pago de tu envío.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl tracking-tight mb-2" style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}>
            Pago en proceso
          </h1>
          <p className="mb-6" style={{ color: zindoColors.ink, opacity: 0.7 }}>
            {errorMessage ?? "Estamos confirmando el pago de tu envío con Mercado Pago."}
          </p>
        </>
      )}
      <Link href={`/pedidos/${orderId}`} className="text-sm font-medium hover:underline" style={{ color: zindoColors.gold }}>
        Ver mi pedido
      </Link>
    </div>
  );
}
