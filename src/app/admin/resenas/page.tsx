import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { PlainBackLink } from "@/components/BackLink";
import { approveReviewAction, rejectReviewAction } from "./actions";
import {
  AdminPageHeader,
  AdminSectionTitle,
  AdminFlash,
  adminButtonPrimaryClass,
  adminDangerLinkClass,
} from "@/components/admin/ui";

export const metadata: Metadata = { title: "Reseñas (Admin)" };

export default async function ResenasAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ guardado?: string }>;
}) {
  await requireAdmin("/admin/resenas");
  const { guardado } = await searchParams;

  const [pending, approved] = await Promise.all([
    prisma.review.findMany({
      where: { approved: false },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } }, product: { select: { name: true } } },
    }),
    prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } }, product: { select: { name: true } } },
      take: 20,
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <div>
        <PlainBackLink href="/admin" label="Dashboard" />
        <div className="mt-3">
          <AdminPageHeader title="Reseñas" subtitle={`${pending.length} pendiente${pending.length === 1 ? "" : "s"} de aprobar`} />
        </div>
      </div>

      <AdminFlash guardado={guardado} />

      <section className="space-y-3">
        <AdminSectionTitle>Pendientes</AdminSectionTitle>
        {pending.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">No hay reseñas pendientes.</p>
        ) : (
          <ul className="space-y-2">
            {pending.map((review) => (
              <li key={review.id} className="rounded-md border border-[#9CBA9D]/50 bg-white px-4 py-3 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#0D3B36]">{review.product.name}</span>
                  <span className="text-[#C9A15B]">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                </div>
                <p className="text-xs text-[#1A1A1A]/60">{review.user.name}</p>
                {review.comment && <p className="text-sm text-[#1A1A1A]/80">{review.comment}</p>}
                <div className="flex items-center gap-3 pt-2">
                  <form action={approveReviewAction}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <button type="submit" className={`${adminButtonPrimaryClass} !px-3 !py-1.5 text-xs`}>
                      Aprobar
                    </button>
                  </form>
                  <form action={rejectReviewAction}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <button type="submit" className={adminDangerLinkClass}>
                      Rechazar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <AdminSectionTitle>Aprobadas recientemente</AdminSectionTitle>
        {approved.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">Todavía no hay reseñas aprobadas.</p>
        ) : (
          <ul className="space-y-2">
            {approved.map((review) => (
              <li key={review.id} className="rounded-md border border-[#9CBA9D]/50 bg-white px-4 py-3 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#0D3B36]">{review.product.name}</span>
                  <span className="text-[#C9A15B]">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                </div>
                <p className="text-xs text-[#1A1A1A]/60">{review.user.name}</p>
                {review.comment && <p className="text-sm text-[#1A1A1A]/80">{review.comment}</p>}
                <form action={rejectReviewAction} className="pt-2">
                  <input type="hidden" name="reviewId" value={review.id} />
                  <button type="submit" className={adminDangerLinkClass}>
                    Eliminar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
