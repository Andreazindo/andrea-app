import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PlainBackLink } from "@/components/BackLink";
import { updateCustomerAction, resetCustomerPasswordAction } from "./actions";
import { getAppUrl } from "@/lib/app-url";
import { whatsappTempPasswordLink } from "@/lib/order-messages";
import {
  AdminPageHeader,
  AdminSectionTitle,
  AdminFlash,
  adminCardClass as sectionClass,
  adminInputClass as inputClass,
  adminLabelClass as labelClass,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
} from "@/components/admin/ui";

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado",
  PROCESSING: "En preparación",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const ERROR_MESSAGES: Record<string, string> = {
  "datos-invalidos": "Completa nombre y correo.",
  "correo-en-uso": "Ese correo ya está en uso por otra cuenta.",
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const customer = await prisma.user.findUnique({ where: { id }, select: { name: true } });
  return { title: customer ? `${customer.name} (Admin)` : "Cliente (Admin)" };
}

export default async function ClienteAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; guardado?: string; creado?: string; tempPassword?: string }>;
}) {
  await requireAdmin("/admin/clientes");
  const { id } = await params;
  const { error, guardado, creado, tempPassword } = await searchParams;

  const customer = await prisma.user.findFirst({
    where: { id, role: "CUSTOMER" },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, totalCents: true, createdAt: true },
      },
    },
  });
  if (!customer) notFound();

  const appUrl = tempPassword ? await getAppUrl() : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <div>
        <PlainBackLink href="/admin/clientes" label="Clientes" />
        <div className="mt-3">
          <AdminPageHeader title={customer.name} subtitle={`Cliente desde ${new Date(customer.createdAt).toLocaleDateString("es-MX")}`} />
        </div>
      </div>

      {creado && (
        <p className="rounded-md bg-[#0D3B36]/10 text-[#0D3B36] text-sm px-3 py-2 font-medium">
          Cliente creado. Ya puedes registrarle una venta manual desde &ldquo;Registrar venta&rdquo;.
        </p>
      )}
      <AdminFlash guardado={guardado} error={error} errorMessages={ERROR_MESSAGES} />

      {tempPassword && appUrl && (
        <div className="rounded-md bg-[#C9A15B]/10 border border-[#C9A15B]/40 text-sm px-3 py-3 space-y-2">
          <p className="text-[#0D3B36]">
            Contraseña temporal generada: <span className="font-mono font-semibold">{tempPassword}</span>
            <br />
            Cópiala ahora — no se volverá a mostrar. Compártela con el cliente por un medio seguro.
          </p>
          {customer.phone && (
            <a
              href={whatsappTempPasswordLink({
                phone: customer.phone,
                name: customer.name,
                email: customer.email,
                tempPassword,
                loginUrl: `${appUrl}/login`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-[#25D366] text-white px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              Enviar por WhatsApp
            </a>
          )}
        </div>
      )}

      <section className={sectionClass}>
        <AdminSectionTitle>Datos del cliente</AdminSectionTitle>
        <form action={updateCustomerAction} className="space-y-3">
          <input type="hidden" name="customerId" value={customer.id} />
          <div>
            <label className={labelClass} htmlFor="name">
              Nombre
            </label>
            <input id="name" name="name" defaultValue={customer.name} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">
              Correo
            </label>
            <input id="email" name="email" type="email" defaultValue={customer.email} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">
              Teléfono
            </label>
            <input id="phone" name="phone" defaultValue={customer.phone ?? ""} className={inputClass} />
          </div>
          <button type="submit" className={adminButtonPrimaryClass}>
            Guardar cambios
          </button>
        </form>
        <form action={resetCustomerPasswordAction}>
          <input type="hidden" name="customerId" value={customer.id} />
          <button type="submit" className={adminButtonSecondaryClass}>
            Restablecer contraseña
          </button>
        </form>
      </section>

      <section className={sectionClass}>
        <AdminSectionTitle>Pedidos ({customer.orders.length})</AdminSectionTitle>
        {customer.orders.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">Este cliente todavía no tiene pedidos.</p>
        ) : (
          <ul className="divide-y divide-[#9CBA9D]/30 -mx-5 -mb-4">
            {customer.orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-[#EEE7DF]/60 transition-colors"
                >
                  <span className="font-mono text-[#1A1A1A]/60">#{order.id.slice(-8).toUpperCase()}</span>
                  <span className="text-[#1A1A1A]/60">{STATUS_LABELS[order.status] ?? order.status}</span>
                  <span className="text-[#1A1A1A]/50">{new Date(order.createdAt).toLocaleDateString("es-MX")}</span>
                  <span className="font-semibold text-[#0D3B36]">{formatCents(order.totalCents)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
