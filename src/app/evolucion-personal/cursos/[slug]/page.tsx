import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { zindoColors } from "@/components/zindo/theme";
import { prisma } from "@/lib/prisma";
import { getSiteContent } from "@/lib/site-content";
import { formatCents } from "@/lib/money";

const getCurso = cache(async (slug: string) => {
  return prisma.contentBlock.findFirst({
    where: { section: "cursos_online", kind: "COURSE", value: slug, active: true },
  });
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const curso = await getCurso(slug);
  return { title: curso?.title };
}

function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("52") ? digits : `52${digits}`;
}

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [curso, content] = await Promise.all([getCurso(slug), getSiteContent(["contacto_whatsapp"] as const)]);
  if (!curso) notFound();

  const whatsappMessage = `¡Hola! Me interesa el curso "${curso.title}"${
    curso.priceCents != null ? ` (${formatCents(curso.priceCents)})` : ""
  }. ¿Me pueden dar más información para inscribirme?`;
  const whatsappHref = content.contacto_whatsapp
    ? `https://wa.me/${whatsappNumber(content.contacto_whatsapp)}?text=${encodeURIComponent(whatsappMessage)}`
    : undefined;

  return (
    <ZindoContentPage
      title={curso.title}
      subtitle={curso.priceCents != null ? formatCents(curso.priceCents) : undefined}
      backHref="/evolucion-personal/cursos"
      backLabel="Cursos Online"
    >
      <div className="max-w-xl mx-auto w-full space-y-6">
        {curso.imageUrl && (
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: zindoColors.sage }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={curso.imageUrl} alt={curso.title} className="w-full object-cover" />
          </div>
        )}

        {curso.description && (
          <p className="text-sm whitespace-pre-wrap" style={{ color: zindoColors.ink, opacity: 0.85 }}>
            {curso.description}
          </p>
        )}

        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center rounded-md px-4 py-3 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: zindoColors.green }}
          >
            Inscribirme por WhatsApp
          </a>
        ) : (
          <p className="text-sm text-center" style={{ color: zindoColors.ink, opacity: 0.6 }}>
            Escríbenos para inscribirte.
          </p>
        )}
      </div>
    </ZindoContentPage>
  );
}
