import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PlainBackLink } from "@/components/BackLink";
import { createCouponAction, toggleCouponActiveAction } from "./actions";
import {
  AdminPageHeader,
  AdminFlash,
  adminCardClass as sectionClass,
  adminInputClass as inputClass,
  adminLabelClass as labelClass,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
} from "@/components/admin/ui";

export const metadata: Metadata = { title: "Cupones (Admin)" };

const ERROR_MESSAGES: Record<string, string> = {
  "datos-invalidos": "Completa el código y un valor válido.",
  "porcentaje-invalido": "El porcentaje debe ser entre 1 y 100.",
  "codigo-en-uso": "Ese código ya existe.",
};

function couponValueLabel(coupon: { type: string; value: number }): string {
  return coupon.type === "PERCENT" ? `${coupon.value}%` : formatCents(coupon.value);
}

export default async function CuponesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; guardado?: string }>;
}) {
  await requireAdmin("/admin/cupones");
  const { error, guardado } = await searchParams;

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div>
        <PlainBackLink href="/admin" label="Dashboard" />
        <div className="mt-3">
          <AdminPageHeader title="Cupones" subtitle={`${coupons.length} cupón${coupons.length === 1 ? "" : "es"}`} />
        </div>
      </div>

      <AdminFlash guardado={guardado} error={error} errorMessages={ERROR_MESSAGES} />

      <details className={sectionClass}>
        <summary className="text-sm font-semibold cursor-pointer text-[#0D3B36]">+ Nuevo cupón</summary>
        <form action={createCouponAction} className="space-y-3 mt-4">
          <div>
            <label className={labelClass} htmlFor="code">
              Código
            </label>
            <input id="code" name="code" required placeholder="ZINDO10" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="type">
                Tipo
              </label>
              <select id="type" name="type" defaultValue="PERCENT" className={inputClass}>
                <option value="PERCENT">Porcentaje</option>
                <option value="FIXED">Monto fijo (MXN)</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="value">
                Valor
              </label>
              <input id="value" name="value" type="number" step="0.01" min="0" required className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="maxRedemptions">
                Usos máximos (opcional)
              </label>
              <input id="maxRedemptions" name="maxRedemptions" type="number" min="1" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="expiresAt">
                Vence (opcional)
              </label>
              <input id="expiresAt" name="expiresAt" type="date" className={inputClass} />
            </div>
          </div>
          <button type="submit" className={adminButtonPrimaryClass}>
            Crear cupón
          </button>
        </form>
      </details>

      {coupons.length === 0 ? (
        <p className="text-sm text-[#1A1A1A]/60">No hay cupones todavía.</p>
      ) : (
        <div className="space-y-2">
          {coupons.map((coupon) => {
            const expired = coupon.expiresAt ? coupon.expiresAt < new Date() : false;
            const exhausted = coupon.maxRedemptions !== null && coupon.redemptions >= coupon.maxRedemptions;
            return (
              <div
                key={coupon.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-md border border-[#9CBA9D]/50 bg-white px-4 py-3"
              >
                <span className="text-sm font-mono font-semibold text-[#0D3B36]">{coupon.code}</span>
                <span className="text-sm text-[#1A1A1A]/70">{couponValueLabel(coupon)}</span>
                <span className="text-xs text-[#1A1A1A]/50">
                  {coupon.redemptions} usado{coupon.redemptions === 1 ? "" : "s"}
                  {coupon.maxRedemptions !== null && ` / ${coupon.maxRedemptions}`}
                </span>
                {coupon.expiresAt && (
                  <span className="text-xs text-[#1A1A1A]/50">
                    Vence {coupon.expiresAt.toLocaleDateString("es-MX")}
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full flex-none ${
                    coupon.active && !expired && !exhausted
                      ? "text-green-700 bg-green-500/10"
                      : "text-[#1A1A1A]/50 bg-black/5"
                  }`}
                >
                  {!coupon.active ? "Desactivado" : expired ? "Vencido" : exhausted ? "Agotado" : "Activo"}
                </span>
                <form action={toggleCouponActiveAction} className="sm:ml-auto">
                  <input type="hidden" name="couponId" value={coupon.id} />
                  <button type="submit" className={adminButtonSecondaryClass}>
                    {coupon.active ? "Desactivar" : "Activar"}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
