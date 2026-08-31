import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoContentBlock } from "@/components/zindo/MediaEmbed";
import { getContentBlocks } from "@/lib/content-blocks";

export const metadata: Metadata = { title: "21 Días de Gratitud" };

export default async function VeintiunDiasGratitudPage() {
  const blocks = await getContentBlocks("libreria_21dias");

  return (
    <ZindoContentPage
      title="21 Días de Gratitud"
      subtitle="Un reto diario para entrenar la mirada agradecida."
      backHref="/libreria"
      backLabel="Librería Gratuita"
    >
      {blocks.map((block) => (
        <ZindoContentBlock key={block.id} block={block} />
      ))}
    </ZindoContentPage>
  );
}
