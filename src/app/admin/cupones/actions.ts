"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function createCouponAction(formData: FormData) {
  await requireAdmin("/admin/cupones");

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type") ?? "PERCENT");
  const valueRaw = String(formData.get("value") ?? "").trim();
  const maxRedemptionsRaw = String(formData.get("maxRedemptions") ?? "").trim();
  const expiresAtRaw = String(formData.get("expiresAt") ?? "").trim();

  const value = Math.round(Number(valueRaw));
  if (!code || (type !== "PERCENT" && type !== "FIXED") || !Number.isFinite(value) || value <= 0) {
    redirect("/admin/cupones?error=datos-invalidos");
  }
  if (type === "PERCENT" && value > 100) {
    redirect("/admin/cupones?error=porcentaje-invalido");
  }

  const valueStored = type === "FIXED" ? Math.round(value * 100) : value;
  const maxRedemptions = maxRedemptionsRaw ? Math.round(Number(maxRedemptionsRaw)) : null;
  const expiresAt = expiresAtRaw ? new Date(`${expiresAtRaw}T23:59:59`) : null;

  try {
    await prisma.coupon.create({
      data: {
        code,
        type: type as "PERCENT" | "FIXED",
        value: valueStored,
        maxRedemptions,
        expiresAt,
      },
    });
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
      redirect("/admin/cupones?error=codigo-en-uso");
    }
    throw err;
  }

  redirect("/admin/cupones?guardado=1");
}

export async function toggleCouponActiveAction(formData: FormData) {
  await requireAdmin("/admin/cupones");

  const id = String(formData.get("couponId") ?? "");
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) redirect("/admin/cupones");

  await prisma.coupon.update({ where: { id }, data: { active: !coupon.active } });

  redirect("/admin/cupones?guardado=1");
}
