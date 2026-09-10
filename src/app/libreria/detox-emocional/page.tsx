import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoContentBlock } from "@/components/zindo/MediaEmbed";
import { getContentBlocks } from "@/lib/content-blocks";

export const metadata: Metadata = { title: "Detox Emocional" };

export default async function DetoxEmocionalPage() {
  const blocks = await getContentBlocks("libreria_detox");

  return (
    <ZindoContentPage
      title="Detox Emocional"
      subtitle="Libera lo que ya no necesitas cargar."
      backHref="/libreria"
      backLabel="Librería Gratuita"
    >
      {blocks.map((block) => (
        <ZindoContentBlock key={block.id} block={block} />
      ))}
    </ZindoContentPage>
  );
}
