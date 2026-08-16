import { NextRequest, NextResponse } from "next/server";
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { getMercadoPagoPayment } from "@/lib/payments/mercadopago";
import { markOrderPaid } from "@/lib/orders";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const topic = url.searchParams.get("type") ?? url.searchParams.get("topic");

  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (secret) {
    try {
      WebhookSignatureValidator.validate({
        xSignature: request.headers.get("x-signature"),
        xRequestId: request.headers.get("x-request-id"),
        dataId,
        secret,
      });
    } catch (error) {
      if (error instanceof InvalidWebhookSignatureError) {
        return NextResponse.json({ error: "invalid signature" }, { status: 401 });
      }
      throw error;
    }
  }

  if (topic !== "payment" || !dataId) {
    return NextResponse.json({ ok: true });
  }

  try {
    const payment = await getMercadoPagoPayment(dataId);
    if (payment.status === "approved" && payment.external_reference) {
      await markOrderPaid({
        orderId: payment.external_reference,
        method: "MERCADO_PAGO",
        externalId: String(payment.id),
        amountCents: Math.round((payment.transaction_amount ?? 0) * 100),
        rawPayload: payment,
      });
    }
  } catch (error) {
    console.error("Error procesando webhook de Mercado Pago", error);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
