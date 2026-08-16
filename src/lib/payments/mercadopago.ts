import { MercadoPagoConfig, Preference, Payment as MPPayment } from "mercadopago";

export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

function getClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN no está configurado");
  }
  return new MercadoPagoConfig({ accessToken });
}

export async function createMercadoPagoPreference(params: {
  orderId: string;
  items: { title: string; quantity: number; unitPriceCents: number }[];
  appUrl: string;
}) {
  const preference = new Preference(getClient());

  const response = await preference.create({
    body: {
      items: params.items.map((item, index) => ({
        id: `${params.orderId}-${index}`,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPriceCents / 100,
        currency_id: "MXN",
      })),
      external_reference: params.orderId,
      back_urls: {
        success: `${params.appUrl}/pedidos/${params.orderId}/mercadopago/retorno`,
        pending: `${params.appUrl}/pedidos/${params.orderId}/mercadopago/retorno`,
        failure: `${params.appUrl}/pedidos/${params.orderId}/mercadopago/retorno`,
      },
      auto_return: "approved",
      notification_url: `${params.appUrl}/api/webhooks/mercadopago`,
    },
  });

  return response;
}

export async function getMercadoPagoPayment(paymentId: string) {
  const payment = new MPPayment(getClient());
  return payment.get({ id: paymentId });
}
