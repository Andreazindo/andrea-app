import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoContentBlock } from "@/components/zindo/MediaEmbed";
import { GratitudeGallery } from "@/components/zindo/GratitudeGallery";
import { getContentBlocks } from "@/lib/content-blocks";

export const metadata: Metadata = { title: "21 Días de Gratitud" };

const gratitudeImages = Array.from({ length: 21 }, (_, i) => {
  const day = String(i + 1).padStart(2, "0");
  return { url: `/zindo/21-dias-gratitud/${day}.webp`, alt: `Tarjeta ${i + 1} — 21 Días de Gratitud` };
});

export default async function VeintiunDiasGratitudPage() {
  const blocks = await getContentBlocks("libreria_21dias");

  return (
    <ZindoContentPage
      title="21 Días de Gratitud"
      subtitle="Un reto diario para entrenar la mirada agradecida."
      backHref="/libreria"
      backLabel="Librería Gratuita"
      wide
    >
      <GratitudeGallery images={gratitudeImages} />
      {blocks.map((block) => (
        <ZindoContentBlock key={block.id} block={block} />
      ))}
    </ZindoContentPage>
  );
}
