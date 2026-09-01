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

function whatsappNumberFromPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("52") ? digits : `52${digits}`;
}

export function buildWhatsappTempPasswordMessage(params: {
  name: string;
  email: string;
  tempPassword: string;
  loginUrl: string;
}): string {
  return `¡Hola ${params.name}! 🌿

Te generamos una contraseña temporal para tu cuenta en ZINDO:

Correo: ${params.email}
Contraseña temporal: ${params.tempPassword}

Inicia sesión aquí: ${params.loginUrl}

Guárdala en un lugar seguro. Si necesitas otra más adelante, solo escríbenos.
Equipo ZINDO 🌱`;
}

export function whatsappTempPasswordLink(params: {
  phone: string;
  name: string;
  email: string;
  tempPassword: string;
  loginUrl: string;
}): string {
  return `https://wa.me/${whatsappNumberFromPhone(params.phone)}?text=${encodeURIComponent(
    buildWhatsappTempPasswordMessage(params)
  )}`;
}

export function buildWhatsappAbandonedCartMessage(params: {
  name: string;
  itemsSummary: string;
  cartUrl: string;
}): string {
  return `¡Hola ${params.name}! 🌿

Vimos que dejaste esto en tu carrito de ZINDO:
${params.itemsSummary}

Sigue esperándote por si quieres completar tu compra:
${params.cartUrl}

Cualquier duda, aquí estamos.
Equipo ZINDO 🌱`;
}

export function whatsappAbandonedCartLink(params: {
  phone: string;
  name: string;
  itemsSummary: string;
  cartUrl: string;
}): string {
  return `https://wa.me/${whatsappNumberFromPhone(params.phone)}?text=${encodeURIComponent(
    buildWhatsappAbandonedCartMessage(params)
  )}`;
}
