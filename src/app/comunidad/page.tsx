import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { WhatsappIcon } from "@/components/zindo/ContactIcons";
import { zindoColors } from "@/components/zindo/theme";
import { getSiteContent } from "@/lib/site-content";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submitCommunityPostAction, submitCommunityCommentAction } from "./actions";

export const metadata: Metadata = { title: "Comunidad" };

const CONTENT_KEYS = ["comunidad_tagline", "comunidad_whatsapp_link"] as const;

export default async function ComunidadPage({
  searchParams,
}: {
  searchParams: Promise<{ publicacionEnviada?: string; comentarioEnviado?: string; comunidadError?: string }>;
}) {
  const { publicacionEnviada, comentarioEnviado, comunidadError } = await searchParams;
  const [content, session] = await Promise.all([getSiteContent(CONTENT_KEYS), auth()]);

  const posts = await prisma.communityPost.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: { select: { name: true } },
      comments: { orderBy: { createdAt: "asc" }, include: { user: { select: { name: true } } } },
    },
  });

  return (
    <ZindoContentPage
      title="Comunidad"
      subtitle={
        content.comunidad_tagline ||
        "Un espacio para compartir tu proceso, resolver dudas y acompañarnos en el camino hacia una vida más consciente."
      }
      backHref="/"
      backLabel="Inicio"
    >
      <div className="max-w-sm mx-auto">
        <ZindoBrandCard
          name="Grupo de WhatsApp"
          description={
            content.comunidad_whatsapp_link
              ? "Únete para platicar con otras personas de la comunidad ZINDO, compartir tus avances y resolver dudas."
              : "Muy pronto abrimos nuestro grupo de WhatsApp para la comunidad ZINDO."
          }
          href={content.comunidad_whatsapp_link || undefined}
          comingSoon={!content.comunidad_whatsapp_link}
          icon={<WhatsappIcon />}
          ctaLabel="Unirme →"
        />
      </div>

      <div className="max-w-xl mx-auto w-full space-y-6">
        <div className="text-center">
          <h2
            className="text-lg uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            Publicaciones
          </h2>
          <p className="mt-2 text-sm max-w-md mx-auto" style={{ color: zindoColors.ink, opacity: 0.65 }}>
            Comparte tu proceso, una pregunta o lo que quieras platicar con la comunidad. Le damos un vistazo rápido
            a cada publicación antes de que aparezca — un poco de paciencia 💛 — y los comentarios se ven al instante.
          </p>
        </div>

        {publicacionEnviada && (
          <p className="text-sm rounded-md px-3 py-2" style={{ backgroundColor: "#0D3B3620", color: zindoColors.green }}>
            Gracias, tu publicación se envió y quedará visible en cuanto la aprobemos.
          </p>
        )}
        {comentarioEnviado && (
          <p className="text-sm rounded-md px-3 py-2" style={{ backgroundColor: "#0D3B3620", color: zindoColors.green }}>
            Tu comentario se publicó.
          </p>
        )}
        {comunidadError && (
          <p className="text-sm rounded-md px-3 py-2 bg-red-500/10 text-red-600">Escribe algo antes de enviar.</p>
        )}

        {session?.user?.id ? (
          <div className="rounded-lg bg-white/70 border p-4" style={{ borderColor: zindoColors.sage }}>
            <p className="text-sm font-semibold mb-3" style={{ color: zindoColors.ink }}>
              Comparte algo con la comunidad
            </p>
            <form action={submitCommunityPostAction} className="space-y-3">
              <textarea
                name="content"
                rows={3}
                placeholder="Cuéntanos tu avance, una pregunta, lo que quieras compartir..."
                className="w-full rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: zindoColors.sage }}
                required
              />
              <button
                type="submit"
                className="rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                style={{ backgroundColor: zindoColors.green }}
              >
                Publicar
              </button>
            </form>
          </div>
        ) : (
          <p className="text-sm text-center" style={{ color: zindoColors.ink, opacity: 0.6 }}>
            <a href="/login?callbackUrl=%2Fcomunidad" className="underline">
              Inicia sesión
            </a>{" "}
            para publicar o comentar.
          </p>
        )}

        {posts.length === 0 ? (
          <p className="text-sm text-center" style={{ color: zindoColors.ink, opacity: 0.6 }}>
            Todavía no hay publicaciones. ¡Sé la primera persona en compartir algo!
          </p>
        ) : (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li
                key={post.id}
                id={`post-${post.id}`}
                className="rounded-lg bg-white/70 border p-4 space-y-3"
                style={{ borderColor: zindoColors.sage }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: zindoColors.green }}>
                    {post.user.name}
                  </p>
                  <p className="mt-1 text-sm whitespace-pre-wrap" style={{ color: zindoColors.ink, opacity: 0.85 }}>
                    {post.content}
                  </p>
                </div>

                {post.comments.length > 0 && (
                  <ul className="space-y-2 border-t pt-3" style={{ borderColor: zindoColors.sage }}>
                    {post.comments.map((comment) => (
                      <li key={comment.id} className="text-sm">
                        <span className="font-medium" style={{ color: zindoColors.green }}>
                          {comment.user.name}:
                        </span>{" "}
                        <span style={{ color: zindoColors.ink, opacity: 0.85 }}>{comment.content}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {session?.user?.id && (
                  <form action={submitCommunityCommentAction} className="flex gap-2 pt-1">
                    <input type="hidden" name="postId" value={post.id} />
                    <input
                      type="text"
                      name="content"
                      placeholder="Escribe un comentario..."
                      className="flex-1 rounded-md border px-3 py-1.5 text-sm"
                      style={{ borderColor: zindoColors.sage }}
                      required
                    />
                    <button
                      type="submit"
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
                      style={{ backgroundColor: zindoColors.gold }}
                    >
                      Comentar
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </ZindoContentPage>
  );
}
