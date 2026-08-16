import { Client, Environment, OrdersController, CheckoutPaymentIntent } from "@paypal/paypal-server-sdk";

export function isPaypalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

function getOrdersController() {
  const oAuthClientId = process.env.PAYPAL_CLIENT_ID;
  const oAuthClientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!oAuthClientId || !oAuthClientSecret) {
    throw new Error("PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET no están configurados");
  }

  const client = new Client({
    clientCredentialsAuthCredentials: { oAuthClientId, oAuthClientSecret },
    environment: process.env.PAYPAL_ENV === "live" ? Environment.Production : Environment.Sandbox,
  });

  return new OrdersController(client);
}

export async function createPaypalOrder(params: {
  orderId: string;
  totalCents: number;
  appUrl: string;
}) {
  const ordersController = getOrdersController();

  const { result } = await ordersController.createOrder({
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          referenceId: params.orderId,
          customId: params.orderId,
          amount: {
            currencyCode: "MXN",
            value: (params.totalCents / 100).toFixed(2),
          },
        },
      ],
      applicationContext: {
        returnUrl: `${params.appUrl}/pedidos/${params.orderId}/paypal/retorno`,
        cancelUrl: `${params.appUrl}/pedidos/${params.orderId}`,
      },
    },
  });

  const approveLink = result.links?.find((link) => link.rel === "approve");
  if (!approveLink) throw new Error("PayPal no devolvió un link de aprobación");

  return { paypalOrderId: result.id!, approveUrl: approveLink.href };
}

export async function capturePaypalOrder(paypalOrderId: string) {
  const ordersController = getOrdersController();
  const { result } = await ordersController.captureOrder({ id: paypalOrderId });

  const capture = result.purchaseUnits?.[0]?.payments?.captures?.[0];

  return {
    status: result.status,
    orderId: result.purchaseUnits?.[0]?.customId,
    captureId: capture?.id,
    amountCents: capture?.amount?.value ? Math.round(parseFloat(capture.amount.value) * 100) : 0,
  };
}
