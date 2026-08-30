import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ZindoPlaceholderPage } from "@/components/zindo/PlaceholderSection";

const CURSOS: Record<string, string> = {
  "redefiniendo-el-exito": "Redefiniendo el éxito",
  "cambio-consciente": "Cambio Consciente",
  "vida-en-calma": "Vida en Calma",
  "mente-maestra": "Mente Maestra",
  "observa-crea": "Observa, crea",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: CURSOS[slug] };
}

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nombre = CURSOS[slug];
  if (!nombre) notFound();

  return <ZindoPlaceholderPage title={nombre} backHref="/evolucion-personal" backLabel="Evolución Personal" />;
}
