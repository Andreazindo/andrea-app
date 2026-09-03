"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

export function OrderCreatedTracker({
  orderId,
  totalCents,
  brandCodes,
}: {
  orderId: string;
  totalCents: number;
  brandCodes: string[];
}) {
  useEffect(() => {
    track("Pedido creado", {
      orderId,
      totalMXN: Math.round(totalCents / 100),
      marcas: brandCodes.join(","),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
