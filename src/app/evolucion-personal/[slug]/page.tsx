import { notFound } from "next/navigation";
import { ZindoPlaceholderPage } from "@/components/zindo/PlaceholderSection";

const SECCIONES: Record<string, string> = {
  "journal-365": "Journal 365",
  webinars: "Webinars",
  testimonios: "Testimonios",
};

export default async function EvolucionSeccionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nombre = SECCIONES[slug];
  if (!nombre) notFound();

  return <ZindoPlaceholderPage title={nombre} backHref="/evolucion-personal" backLabel="Evolución Personal" />;
}
