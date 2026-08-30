import { notFound } from "next/navigation";
import { ZindoPlaceholderPage } from "@/components/zindo/PlaceholderSection";

const RECURSOS: Record<string, string> = {
  "detox-emocional": "Detox Emocional",
  "21-dias-de-gratitud": "21 Días de Gratitud",
  meditaciones: "Meditaciones",
};

export default async function LibreriaRecursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nombre = RECURSOS[slug];
  if (!nombre) notFound();

  return <ZindoPlaceholderPage title={nombre} backHref="/libreria" backLabel="Librería Gratuita" />;
}
