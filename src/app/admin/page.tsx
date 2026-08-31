import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PlainBackLink } from "@/components/BackLink";
import { AdminPageHeader, AdminSectionTitle, adminCardClass } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Dashboard (Admin)" };

const PAID_STATUSES = ["PAID", "PROCESSING", "SHIPPED"] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado",
  PROCESSING: "En preparación",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_DOT: Record<string, string> = {
  PENDING_PAYMENT: "bg-[#C9A15B]",
  PAID: "bg-[#0D3B36]",
  PROCESSING: "bg-[#0D3B36]",
  SHIPPED: "bg-[#9CBA9D]",
  CANCELLED: "bg-red-400",
  REFUNDED: "bg-red-400",
};

function StatCard({ label, value, accent = "#0D3B36" }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className={`${adminCardClass} border-l-4`} style={{ borderLeftColor: accent }}>
      <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1A]/50">{label}</p>
      <p className="text-2xl font-bold tracking-tight mt-1" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  await requireAdmin("/admin");

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalAgg, monthAgg, statusGroups, recentOrders, lowStock, productCount, customerCount] =
    await Promise.all([
      prisma.order.aggregate({
        where: { status: { in: [...PAID_STATUSES] } },
        _sum: { totalCents: true },
        _count: true,
      }),
      prisma.order.aggregate({
        where: { status: { in: [...PAID_STATUSES] }, createdAt: { gte: startOfMonth } },
        _sum: { totalCents: true },
        _count: true,
      }),
      prisma.order.groupBy({ by: ["status"], _count: true }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.productVariant.findMany({
        where: { trackInventory: true, active: true, stock: { lte: 3 } },
        include: { product: { select: { name: true } } },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      prisma.product.count({ where: { active: true } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);

  const pendingCount = statusGroups.find((g) => g.status === "PENDING_PAYMENT")?._count ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      <div>
        <PlainBackLink href="/" label="Inicio" />
        <div className="mt-3">
          <AdminPageHeader title="Dashboard" subtitle="Resumen del negocio, al día." />
        </div>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Ingresos totales" value={formatCents(totalAgg._sum.totalCents ?? 0)} accent="#0D3B36" />
        <StatCard label="Ingresos este mes" value={formatCents(monthAgg._sum.totalCents ?? 0)} accent="#0D3B36" />
        <StatCard label="Pedidos pagados" value={totalAgg._count} accent="#9CBA9D" />
        <StatCard label="Pendientes de pago" value={pendingCount} accent="#C9A15B" />
        <StatCard label="Productos activos" value={productCount} accent="#9CBA9D" />
        <StatCard label="Clientes" value={customerCount} accent="#9CBA9D" />
        <StatCard label="Pedidos este mes" value={monthAgg._count} accent="#0D3B36" />
        <StatCard label="Bajo inventario" value={lowStock.length} accent={lowStock.length > 0 ? "#dc2626" : "#9CBA9D"} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <AdminSectionTitle>Pedidos recientes</AdminSectionTitle>
          <Link href="/admin/pedidos" className="text-sm font-medium text-[#C9A15B] hover:underline">
            Ver todos →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">Todavía no hay pedidos.</p>
        ) : (
          <ul className="divide-y divide-[#9CBA9D]/30 rounded-xl border border-[#9CBA9D]/50 bg-white overflow-hidden shadow-sm">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-[#EEE7DF]/60 transition-colors"
                >
                  <span className="min-w-0">
                    <span className="font-medium text-[#0D3B36]">#{order.id.slice(-8).toUpperCase()}</span>{" "}
                    <span className="text-[#1A1A1A]/60">· {order.user.name ?? order.user.email}</span>
                  </span>
                  <span className="flex-none flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[#1A1A1A]/60">
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[order.status] ?? "bg-[#9CBA9D]"}`} />
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="font-semibold text-[#0D3B36]">{formatCents(order.totalCents)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lowStock.length > 0 && (
        <section className="space-y-3">
          <AdminSectionTitle>Bajo inventario</AdminSectionTitle>
          <ul className="divide-y divide-[#9CBA9D]/30 rounded-xl border border-[#9CBA9D]/50 bg-white overflow-hidden shadow-sm">
            {lowStock.map((variant) => (
              <li key={variant.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="text-[#1A1A1A]">
                  {variant.product.name} — {variant.name}
                </span>
                <span className={variant.stock === 0 ? "font-semibold text-red-600" : "font-semibold text-[#C9A15B]"}>
                  {variant.stock === 0 ? "Agotado" : `${variant.stock} disponibles`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <AdminSectionTitle>Accesos rápidos</AdminSectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Link href="/admin/productos" className={`${adminCardClass} !space-y-0 hover:border-[#C9A15B] transition-colors font-medium text-[#0D3B36]`}>
            Productos
          </Link>
          <Link href="/admin/pedidos" className={`${adminCardClass} !space-y-0 hover:border-[#C9A15B] transition-colors font-medium text-[#0D3B36]`}>
            Pedidos
          </Link>
          <Link href="/admin/contenido" className={`${adminCardClass} !space-y-0 hover:border-[#C9A15B] transition-colors font-medium text-[#0D3B36]`}>
            Contenido
          </Link>
          <Link href="/admin/multimedia" className={`${adminCardClass} !space-y-0 hover:border-[#C9A15B] transition-colors font-medium text-[#0D3B36]`}>
            Multimedia
          </Link>
          <Link href="/admin/ventas/nueva" className={`${adminCardClass} !space-y-0 hover:border-[#C9A15B] transition-colors font-medium text-[#0D3B36]`}>
            Registrar venta
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <AdminSectionTitle>Respaldo de datos</AdminSectionTitle>
        <a
          href="/api/admin/export"
          className={`${adminCardClass} !space-y-1 block hover:border-[#C9A15B] transition-colors`}
        >
          <p className="font-medium text-[#0D3B36]">Exportar todos los datos (JSON) ⬇</p>
          <p className="text-xs text-[#1A1A1A]/60">
            Productos, pedidos, clientes, contenido, puntos de venta y multimedia en un solo archivo.
          </p>
        </a>
      </section>
    </div>
  );
}
