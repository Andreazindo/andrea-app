import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@/generated/prisma/enums";

export async function markOrderPaid(params: {
  orderId: string;
  method: PaymentMethod;
  externalId: string;
  amountCents: number;
  rawPayload?: unknown;
  recordedByUserId?: string;
}) {
  const { orderId, method, externalId, amountCents, rawPayload, recordedByUserId } = params;

  return prisma.$transaction(async (tx) => {
    const existingPayment = await tx.payment.findFirst({
      where: { orderId, method, externalId },
    });
    if (existingPayment) {
      return { alreadyProcessed: true as const };
    }

    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { productVariant: true } } },
    });
    if (!order) throw new Error(`Order ${orderId} no encontrada`);

    await tx.payment.create({
      data: {
        orderId,
        method,
        status: "APPROVED",
        amountCents,
        externalId,
        rawPayload: rawPayload as never,
        recordedByUserId,
      },
    });

    if (order.status === "PENDING_PAYMENT") {
      await tx.order.update({ where: { id: orderId }, data: { status: "PAID" } });

      for (const item of order.items) {
        if (item.productVariant.trackInventory) {
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          const components = await tx.kitComponent.findMany({
            where: { kitVariantId: item.productVariantId },
          });
          for (const component of components) {
            await tx.productVariant.update({
              where: { id: component.componentVariantId },
              data: { stock: { decrement: component.quantity * item.quantity } },
            });
          }
        }
      }
    } else if (order.shippingCents > 0 && !order.shippingPaidAt) {
      // Pago adicional sobre un pedido ya pagado: se asume que es el cobro de envío cotizado después.
      await tx.order.update({
        where: { id: orderId },
        data: { shippingPaidAt: new Date(), shippingPaymentUrl: null },
      });
    }

    return { alreadyProcessed: false as const };
  });
}
