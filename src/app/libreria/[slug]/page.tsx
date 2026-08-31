import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ZindoPlaceholderPage } from "@/components/zindo/PlaceholderSection";

const RECURSOS: Record<string, string> = {
  "detox-emocional": "Detox Emocional",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: RECURSOS[slug] };
}

export default async function LibreriaRecursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nombre = RECURSOS[slug];
  if (!nombre) notFound();

  return <ZindoPlaceholderPage title={nombre} backHref="/libreria" backLabel="Librería Gratuita" />;
}
