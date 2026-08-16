import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMercadoPagoPayment } from "@/lib/payments/mercadopago";
import { markOrderPaid } from "@/lib/orders";

export default async function MercadoPagoRetornoPage({
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

  if (paymentId && order.status === "PENDING_PAYMENT") {
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
      errorMessage = "No pudimos confirmar el pago con Mercado Pago todavía.";
    }
  }

  const refreshed = await prisma.order.findUnique({ where: { id: orderId } });

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      {refreshed?.status === "PAID" ? (
        <>
          <h1 className="text-2xl font-bold tracking-tight mb-2">¡Pago recibido!</h1>
          <p className="text-black/60 dark:text-white/60 mb-6">Tu pedido está confirmado.</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Pago en proceso</h1>
          <p className="text-black/60 dark:text-white/60 mb-6">
            {errorMessage ?? "Estamos confirmando tu pago con Mercado Pago."}
          </p>
        </>
      )}
      <Link href={`/pedidos/${orderId}`} className="text-sm font-medium hover:underline">
        Ver mi pedido
      </Link>
    </div>
  );
}
