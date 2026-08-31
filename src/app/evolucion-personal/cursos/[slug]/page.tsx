import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ZindoPlaceholderPage } from "@/components/zindo/PlaceholderSection";
import { prisma } from "@/lib/prisma";

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

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const curso = await getCurso(slug);
  if (!curso) notFound();

  return <ZindoPlaceholderPage title={curso.title} backHref="/evolucion-personal/cursos" backLabel="Cursos Online" />;
}
