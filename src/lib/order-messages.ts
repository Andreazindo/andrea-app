type OrderForMessage = {
  id: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine: string;
  shippingCity: string;
  shippingCountry: string;
  items: { productName: string; variantName: string; quantity: number }[];
};

export function orderNumber(order: { id: string }): string {
  return order.id.slice(-8).toUpperCase();
}

function productSummary(order: OrderForMessage): string {
  return order.items.map((item) => `${item.quantity}× ${item.productName} (${item.variantName})`).join(", ");
}

export function buildWhatsappConfirmationMessage(order: OrderForMessage): string {
  return `¡Hola ${order.shippingName}! 🌿✨

Tu pedido #${orderNumber(order)} ya está confirmado, gracias por confiar en ZINDO 💛

🧴 Producto: ${productSummary(order)}
📦 Llega a: ${order.shippingAddressLine}, ${order.shippingCity}

En cuanto confirmemos el costo y tiempo de envío te avisamos por aquí, y de nuevo en cuanto tu pedido esté en camino.

Cualquier duda, aquí estamos.
Con cariño, tu equipo ZINDO 🌱`;
}

function whatsappNumber(order: OrderForMessage): string {
  const digits = order.shippingPhone.replace(/\D/g, "");
  return order.shippingCountry === "US"
    ? digits.startsWith("1") && digits.length === 11
      ? digits
      : `1${digits}`
    : digits.startsWith("52")
    ? digits
    : `52${digits}`;
}

export function whatsappLinkForOrder(order: OrderForMessage): string {
  return `https://wa.me/${whatsappNumber(order)}?text=${encodeURIComponent(buildWhatsappConfirmationMessage(order))}`;
}

export function buildWhatsappShippingQuoteMessage(
  order: OrderForMessage,
  shippingCostFormatted: string,
  shippingPaymentUrl: string
): string {
  return `¡Hola ${order.shippingName}! 🌿

Ya tenemos el costo de envío de tu pedido #${orderNumber(order)}: ${shippingCostFormatted}.

Puedes pagarlo aquí de forma segura con Mercado Pago:
${shippingPaymentUrl}

En cuanto se confirme el pago preparamos tu envío. ¡Gracias por tu confianza! 💛
Equipo ZINDO 🌱`;
}

export function whatsappShippingQuoteLink(
  order: OrderForMessage,
  shippingCostFormatted: string,
  shippingPaymentUrl: string
): string {
  return `https://wa.me/${whatsappNumber(order)}?text=${encodeURIComponent(
    buildWhatsappShippingQuoteMessage(order, shippingCostFormatted, shippingPaymentUrl)
  )}`;
}
