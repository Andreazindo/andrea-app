import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { PlainBackLink } from "@/components/BackLink";
import { createCustomerAction } from "./actions";
import {
  AdminPageHeader,
  AdminFlash,
  adminCardClass as sectionClass,
  adminInputClass,
  adminInputClass as inputClass,
  adminLabelClass as labelClass,
  adminButtonSecondaryClass,
  adminButtonPrimaryClass,
} from "@/components/admin/ui";

export const metadata: Metadata = { title: "Clientes (Admin)" };

const ERROR_MESSAGES: Record<string, string> = {
  "datos-invalidos": "Completa nombre y correo.",
  "correo-en-uso": "Ese correo ya está en uso por otra cuenta.",
};

export default async function ClientesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; error?: string }>;
}) {
  await requireAdmin("/admin/clientes");
  const { q, error } = await searchParams;
  const query = (q ?? "").trim();

  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { phone: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div>
        <PlainBackLink href="/admin" label="Dashboard" />
        <div className="mt-3">
          <AdminPageHeader title="Clientes" subtitle={`${customers.length} cliente${customers.length === 1 ? "" : "s"}`} />
        </div>
      </div>

      <AdminFlash error={error} errorMessages={ERROR_MESSAGES} />

      <div className="flex flex-col sm:flex-row gap-2 sm:items-start sm:justify-between">
        <form className="flex gap-2 flex-1">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nombre, correo o teléfono…"
            className={adminInputClass}
          />
          <button type="submit" className={adminButtonSecondaryClass}>
            Buscar
          </button>
        </form>
      </div>

      <details className={sectionClass}>
        <summary className="text-sm font-semibold cursor-pointer text-[#0D3B36]">+ Nuevo cliente</summary>
        <form action={createCustomerAction} className="space-y-3 mt-4">
          <div>
            <label className={labelClass} htmlFor="new-name">
              Nombre
            </label>
            <input id="new-name" name="name" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-email">
              Correo
            </label>
            <input id="new-email" name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-phone">
              Teléfono
            </label>
            <input id="new-phone" name="phone" className={inputClass} />
          </div>
          <button type="submit" className={adminButtonPrimaryClass}>
            Crear cliente
          </button>
        </form>
      </details>

      {customers.length === 0 ? (
        <p className="text-sm text-[#1A1A1A]/60">No hay clientes{query ? " que coincidan con la búsqueda" : ""} todavía.</p>
      ) : (
        <div className="space-y-2">
          {customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/admin/clientes/${customer.id}`}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 rounded-md border border-[#9CBA9D]/50 bg-white px-4 py-3 hover:border-[#C9A15B] transition-colors"
            >
              <span className="text-sm flex-1">
                <span className="font-medium text-[#1A1A1A]">{customer.name}</span>
                <span className="text-[#1A1A1A]/50"> · {customer.email}</span>
                {customer.phone && <span className="text-[#1A1A1A]/50"> · {customer.phone}</span>}
              </span>
              <span className="text-xs text-[#1A1A1A]/50 flex-none">
                {customer._count.orders} pedido{customer._count.orders === 1 ? "" : "s"}
              </span>
              <span className="text-xs text-[#1A1A1A]/50 flex-none">
                Desde {new Date(customer.createdAt).toLocaleDateString("es-MX")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
