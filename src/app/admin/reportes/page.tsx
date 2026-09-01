import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PlainBackLink } from "@/components/BackLink";
import {
  AdminPageHeader,
  AdminSectionTitle,
  adminCardClass as sectionClass,
  adminInputClass as inputClass,
  adminLabelClass as labelClass,
  adminButtonSecondaryClass,
} from "@/components/admin/ui";

export const metadata: Metadata = { title: "Reportes (Admin)" };

const PAID_STATUSES = ["PAID", "PROCESSING", "SHIPPED"] as const;

const BRAND_LABELS: Record<string, string> = {
  DAVANA: "Davana",
  ZINDO: "Zindo",
  PROSPERMIND: "ProsperMind",
  STERIL_MIL: "Steril Mil",
};

function firstDayOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function ReportesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ desde?: string; hasta?: string }>;
}) {
  await requireAdmin("/admin/reportes");
  const { desde, hasta } = await searchParams;

  const from = desde || firstDayOfMonth();
  const to = hasta || todayStr();
  const fromDate = new Date(`${from}T00:00:00`);
  const toDate = new Date(`${to}T23:59:59`);

  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        status: { in: [...PAID_STATUSES] },
        createdAt: { gte: fromDate, lte: toDate },
      },
    },
    include: { order: { select: { id: true, createdAt: true } } },
  });

  const byBrand = new Map<string, { revenueCents: number; unitsSold: number; orderIds: Set<string> }>();
  for (const item of items) {
    const entry = byBrand.get(item.brandCode) ?? { revenueCents: 0, unitsSold: 0, orderIds: new Set<string>() };
    entry.revenueCents += item.unitPriceCents * item.quantity;
    entry.unitsSold += item.quantity;
    entry.orderIds.add(item.order.id);
    byBrand.set(item.brandCode, entry);
  }

  const rows = Array.from(byBrand.entries())
    .map(([brandCode, data]) => ({
      brandCode,
      revenueCents: data.revenueCents,
      unitsSold: data.unitsSold,
      orderCount: data.orderIds.size,
    }))
    .sort((a, b) => b.revenueCents - a.revenueCents);

  const totalRevenueCents = rows.reduce((sum, r) => sum + r.revenueCents, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <PlainBackLink href="/admin" label="Dashboard" />
        <div className="mt-3">
          <AdminPageHeader title="Reportes de ventas" subtitle="Desglose por marca en el periodo elegido." />
        </div>
      </div>

      <form className="flex flex-wrap items-end gap-3">
        <div>
          <label className={labelClass} htmlFor="desde">
            Desde
          </label>
          <input id="desde" name="desde" type="date" defaultValue={from} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="hasta">
            Hasta
          </label>
          <input id="hasta" name="hasta" type="date" defaultValue={to} className={inputClass} />
        </div>
        <button type="submit" className={adminButtonSecondaryClass}>
          Filtrar
        </button>
      </form>

      <section className={sectionClass}>
        <AdminSectionTitle>Ventas por marca</AdminSectionTitle>
        {rows.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">No hay ventas pagadas en ese periodo.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.brandCode} className="flex items-center justify-between gap-3 text-sm py-2 border-b border-[#9CBA9D]/30 last:border-0">
                <span className="font-medium text-[#0D3B36]">{BRAND_LABELS[row.brandCode] ?? row.brandCode}</span>
                <span className="text-[#1A1A1A]/60">{row.orderCount} pedido{row.orderCount === 1 ? "" : "s"}</span>
                <span className="text-[#1A1A1A]/60">{row.unitsSold} unidad{row.unitsSold === 1 ? "" : "es"}</span>
                <span className="font-semibold text-[#0D3B36]">{formatCents(row.revenueCents)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 text-base font-semibold text-[#0D3B36]">
              <span>Total</span>
              <span>{formatCents(totalRevenueCents)}</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
