import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { capturePaypalOrder } from "@/lib/payments/paypal";
import { markOrderPaid } from "@/lib/orders";
import { zindoColors } from "@/components/zindo/theme";

export default async function PaypalRetornoPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orderId } = await params;
  const { token } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/pedidos/${orderId}`);

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) notFound();

  let errorMessage: string | null = null;

  if (token && order.status === "PENDING_PAYMENT") {
    try {
      const capture = await capturePaypalOrder(token);
      if (capture.orderId !== orderId) {
        errorMessage = "El pago no corresponde a este pedido.";
      } else if (capture.status === "COMPLETED" && capture.captureId) {
        await markOrderPaid({
          orderId,
          method: "PAYPAL",
          externalId: capture.captureId,
          amountCents: capture.amountCents,
          rawPayload: capture,
        });
      }
    } catch {
      errorMessage = "No pudimos confirmar el pago con PayPal todavía.";
    }
  }

  const refreshed = await prisma.order.findUnique({ where: { id: orderId } });

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center" style={{ fontFamily: "var(--font-zindo-body)" }}>
      {refreshed?.status === "PAID" ? (
        <>
          <h1 className="text-2xl tracking-tight mb-2" style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}>
            ¡Pago recibido!
          </h1>
          <p className="mb-6" style={{ color: zindoColors.ink, opacity: 0.7 }}>
            Tu pedido está confirmado.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl tracking-tight mb-2" style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}>
            Pago en proceso
          </h1>
          <p className="mb-6" style={{ color: zindoColors.ink, opacity: 0.7 }}>
            {errorMessage ?? "Estamos confirmando tu pago con PayPal."}
          </p>
        </>
      )}
      <Link href={`/pedidos/${orderId}`} className="text-sm font-medium hover:underline" style={{ color: zindoColors.gold }}>
        Ver mi pedido
      </Link>
    </div>
  );
}
