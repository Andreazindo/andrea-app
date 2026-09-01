import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoContentBlock } from "@/components/zindo/MediaEmbed";
import { GratitudeGallery } from "@/components/zindo/GratitudeGallery";
import { getContentBlocks } from "@/lib/content-blocks";

export const metadata: Metadata = { title: "21 Días de Gratitud" };

export default async function VeintiunDiasGratitudPage() {
  const blocks = await getContentBlocks("libreria_21dias");
  const imageBlocks = blocks.filter((b) => b.kind === "IMAGE");
  const otherBlocks = blocks.filter((b) => b.kind !== "IMAGE");

  const gratitudeImages = imageBlocks.map((b) => ({
    url: b.value,
    alt: `${b.title} — 21 Días de Gratitud`,
    label: b.title,
    filename: `zindo-gratitud-${b.title.toLowerCase().replace(/\s+/g, "-")}.webp`,
  }));

  return (
    <ZindoContentPage
      title="21 Días de Gratitud"
      subtitle="Un reto diario para entrenar la mirada agradecida."
      backHref="/libreria"
      backLabel="Librería Gratuita"
      wide
    >
      {gratitudeImages.length > 0 && <GratitudeGallery images={gratitudeImages} />}
      {otherBlocks.map((block) => (
        <ZindoContentBlock key={block.id} block={block} />
      ))}
    </ZindoContentPage>
  );
}
