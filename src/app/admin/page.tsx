import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PlainBackLink } from "@/components/BackLink";

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

const cardClass = "rounded-lg border border-black/10 dark:border-white/15 p-4";
const statValueClass = "text-2xl font-bold tracking-tight mt-1";
const statLabelClass = "text-xs text-black/60 dark:text-white/60";

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
        <h1 className="text-2xl font-bold tracking-tight mt-3 mb-1">Dashboard</h1>
        <p className="text-sm text-black/60 dark:text-white/60">Resumen del negocio, al día.</p>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={cardClass}>
          <p className={statLabelClass}>Ingresos totales</p>
          <p className={statValueClass}>{formatCents(totalAgg._sum.totalCents ?? 0)}</p>
        </div>
        <div className={cardClass}>
          <p className={statLabelClass}>Ingresos este mes</p>
          <p className={statValueClass}>{formatCents(monthAgg._sum.totalCents ?? 0)}</p>
        </div>
        <div className={cardClass}>
          <p className={statLabelClass}>Pedidos pagados</p>
          <p className={statValueClass}>{totalAgg._count}</p>
        </div>
        <div className={cardClass}>
          <p className={statLabelClass}>Pendientes de pago</p>
          <p className={statValueClass}>{pendingCount}</p>
        </div>
        <div className={cardClass}>
          <p className={statLabelClass}>Productos activos</p>
          <p className={statValueClass}>{productCount}</p>
        </div>
        <div className={cardClass}>
          <p className={statLabelClass}>Clientes</p>
          <p className={statValueClass}>{customerCount}</p>
        </div>
        <div className={cardClass}>
          <p className={statLabelClass}>Pedidos este mes</p>
          <p className={statValueClass}>{monthAgg._count}</p>
        </div>
        <div className={cardClass}>
          <p className={statLabelClass}>Bajo inventario</p>
          <p className={statValueClass}>{lowStock.length}</p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Pedidos recientes</h2>
          <Link href="/admin/pedidos" className="text-sm hover:underline">
            Ver todos →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50">Todavía no hay pedidos.</p>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/15 rounded-lg border border-black/10 dark:border-white/15">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <span className="min-w-0">
                    <span className="font-medium">#{order.id.slice(-8).toUpperCase()}</span>{" "}
                    <span className="text-black/60 dark:text-white/60">
                      · {order.user.name ?? order.user.email}
                    </span>
                  </span>
                  <span className="flex-none flex items-center gap-3">
                    <span className="text-black/60 dark:text-white/60">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="font-medium">{formatCents(order.totalCents)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lowStock.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Bajo inventario</h2>
          <ul className="divide-y divide-black/10 dark:divide-white/15 rounded-lg border border-black/10 dark:border-white/15">
            {lowStock.map((variant) => (
              <li key={variant.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span>
                  {variant.product.name} — {variant.name}
                </span>
                <span className={variant.stock === 0 ? "font-semibold text-red-600 dark:text-red-400" : "font-semibold"}>
                  {variant.stock === 0 ? "Agotado" : `${variant.stock} disponibles`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Accesos rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Link href="/admin/productos" className={`${cardClass} hover:bg-black/5 dark:hover:bg-white/10`}>
            Productos
          </Link>
          <Link href="/admin/pedidos" className={`${cardClass} hover:bg-black/5 dark:hover:bg-white/10`}>
            Pedidos
          </Link>
          <Link href="/admin/contenido" className={`${cardClass} hover:bg-black/5 dark:hover:bg-white/10`}>
            Contenido
          </Link>
          <Link href="/admin/multimedia" className={`${cardClass} hover:bg-black/5 dark:hover:bg-white/10`}>
            Multimedia
          </Link>
          <Link href="/admin/ventas/nueva" className={`${cardClass} hover:bg-black/5 dark:hover:bg-white/10`}>
            Registrar venta
          </Link>
        </div>
      </section>
    </div>
  );
}
