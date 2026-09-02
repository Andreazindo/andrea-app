import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { PlainBackLink } from "@/components/BackLink";
import { approveCommunityPostAction, rejectCommunityPostAction, deleteCommunityCommentAction } from "./actions";
import { AdminPageHeader, AdminSectionTitle, AdminFlash, adminButtonPrimaryClass, adminDangerLinkClass } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Comunidad (Admin)" };

export default async function ComunidadAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ guardado?: string }>;
}) {
  await requireAdmin("/admin/comunidad");
  const { guardado } = await searchParams;

  const [pending, approved] = await Promise.all([
    prisma.communityPost.findMany({
      where: { approved: false },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.communityPost.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: { select: { name: true } },
        comments: { orderBy: { createdAt: "asc" }, include: { user: { select: { name: true } } } },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <div>
        <PlainBackLink href="/admin" label="Dashboard" />
        <div className="mt-3">
          <AdminPageHeader
            title="Comunidad"
            subtitle={`${pending.length} publicación${pending.length === 1 ? "" : "es"} pendiente${pending.length === 1 ? "" : "s"} de aprobar`}
          />
        </div>
      </div>

      <AdminFlash guardado={guardado} />

      <section className="space-y-3">
        <AdminSectionTitle>Pendientes</AdminSectionTitle>
        {pending.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">No hay publicaciones pendientes.</p>
        ) : (
          <ul className="space-y-2">
            {pending.map((post) => (
              <li key={post.id} className="rounded-md border border-[#9CBA9D]/50 bg-white px-4 py-3 space-y-1">
                <p className="text-xs text-[#1A1A1A]/60">{post.user.name}</p>
                <p className="text-sm text-[#1A1A1A]/80 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center gap-3 pt-2">
                  <form action={approveCommunityPostAction}>
                    <input type="hidden" name="postId" value={post.id} />
                    <button type="submit" className={`${adminButtonPrimaryClass} !px-3 !py-1.5 text-xs`}>
                      Aprobar
                    </button>
                  </form>
                  <form action={rejectCommunityPostAction}>
                    <input type="hidden" name="postId" value={post.id} />
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
        <AdminSectionTitle>Publicadas recientemente</AdminSectionTitle>
        {approved.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/50">Todavía no hay publicaciones aprobadas.</p>
        ) : (
          <ul className="space-y-2">
            {approved.map((post) => (
              <li key={post.id} className="rounded-md border border-[#9CBA9D]/50 bg-white px-4 py-3 space-y-2">
                <div>
                  <p className="text-xs text-[#1A1A1A]/60">{post.user.name}</p>
                  <p className="text-sm text-[#1A1A1A]/80 whitespace-pre-wrap">{post.content}</p>
                </div>

                {post.comments.length > 0 && (
                  <ul className="space-y-1.5 border-t border-[#9CBA9D]/40 pt-2">
                    {post.comments.map((comment) => (
                      <li key={comment.id} className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-[#1A1A1A]/70">
                          <span className="font-medium">{comment.user.name}:</span> {comment.content}
                        </span>
                        <form action={deleteCommunityCommentAction}>
                          <input type="hidden" name="commentId" value={comment.id} />
                          <button type="submit" className={`${adminDangerLinkClass} whitespace-nowrap`}>
                            Borrar
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}

                <form action={rejectCommunityPostAction} className="pt-1">
                  <input type="hidden" name="postId" value={post.id} />
                  <button type="submit" className={adminDangerLinkClass}>
                    Eliminar publicación
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
