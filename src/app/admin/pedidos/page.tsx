import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PlainBackLink } from "@/components/BackLink";
import { AdminPageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Pedidos (Admin)" };

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado",
  PROCESSING: "En preparación",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  PAID: "text-green-700 dark:text-green-400 bg-green-500/10",
  PROCESSING: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  SHIPPED: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  CANCELLED: "text-red-600 dark:text-red-400 bg-red-500/10",
  REFUNDED: "text-black/60 dark:text-white/60 bg-black/5 dark:bg-white/10",
};

const statusFilters = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "CANCELLED", "REFUNDED"] as const;
type StatusFilter = (typeof statusFilters)[number];

function isStatusFilter(value: string | undefined): value is StatusFilter {
  return (statusFilters as readonly string[]).includes(value ?? "");
}

export default async function PedidosAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin("/admin/pedidos");
  const { status } = await searchParams;
  const activeStatus = isStatusFilter(status) ? status : undefined;

  const orders = await prisma.order.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div>
        <PlainBackLink href="/" label="Inicio" />
        <div className="mt-3">
          <AdminPageHeader title="Pedidos" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin/pedidos"
          className={`rounded-full px-3 py-1 border transition-colors ${
            !status ? "bg-[#0D3B36] text-white border-[#0D3B36]" : "border-[#9CBA9D] text-[#0D3B36] hover:bg-[#EEE7DF]"
          }`}
        >
          Todos
        </Link>
        {statusFilters.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?status=${s}`}
            className={`rounded-full px-3 py-1 border transition-colors ${
              status === s ? "bg-[#0D3B36] text-white border-[#0D3B36]" : "border-[#9CBA9D] text-[#0D3B36] hover:bg-[#EEE7DF]"
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-[#1A1A1A]/60">No hay pedidos{status ? " con ese estatus" : ""} todavía.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const payment = order.payments[0];
            return (
              <Link
                key={order.id}
                href={`/admin/pedidos/${order.id}`}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-md border border-[#9CBA9D]/50 bg-white px-4 py-3 hover:border-[#C9A15B] transition-colors"
              >
                <span className="text-sm font-mono text-[#1A1A1A]/50 flex-none">
                  #{order.id.slice(-8).toUpperCase()}
                </span>
                <span className="text-sm flex-1">
                  <span className="font-medium text-[#1A1A1A]">{order.user.name}</span>
                  <span className="text-[#1A1A1A]/50"> · {order.user.email}</span>
                </span>
                <span className="text-xs text-[#1A1A1A]/50">
                  {payment ? payment.method.replace("_", " ") : "sin pago registrado"}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full flex-none ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <span className="text-sm font-semibold text-[#0D3B36] flex-none">{formatCents(order.totalCents)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
