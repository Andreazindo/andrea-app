import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoContentBlock } from "@/components/zindo/MediaEmbed";
import { getContentBlocks } from "@/lib/content-blocks";
import { zindoColors } from "@/components/zindo/theme";

export const metadata: Metadata = { title: "Testimonios" };

export default async function TestimoniosPage() {
  const blocks = await getContentBlocks("testimonios");

  return (
    <ZindoContentPage
      title="Testimonios"
      subtitle="Historias reales de transformación."
      backHref="/evolucion-personal"
      backLabel="Evolución Personal"
    >
      {blocks.map((block) => (
        <ZindoContentBlock key={block.id} block={block} />
      ))}
      <p className="text-sm" style={{ color: zindoColors.ink, opacity: 0.6 }}>
        Muy pronto se suman más testimonios — ya están en edición.
      </p>
    </ZindoContentPage>
  );
}
