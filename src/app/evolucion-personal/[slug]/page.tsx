import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ZindoPlaceholderPage } from "@/components/zindo/PlaceholderSection";

const SECCIONES: Record<string, string> = {
  "journal-365": "Journal 365",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: SECCIONES[slug] };
}

export default async function EvolucionSeccionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nombre = SECCIONES[slug];
  if (!nombre) notFound();

  return <ZindoPlaceholderPage title={nombre} backHref="/evolucion-personal" backLabel="Evolución Personal" />;
}
