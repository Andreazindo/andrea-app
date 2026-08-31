import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoContentBlock } from "@/components/zindo/MediaEmbed";
import { getContentBlocks } from "@/lib/content-blocks";

export const metadata: Metadata = { title: "Meditaciones" };

export default async function MeditacionesPage() {
  const blocks = await getContentBlocks("libreria_meditaciones");

  return (
    <ZindoContentPage
      title="Meditaciones"
      subtitle="Audios guiados para pausar y respirar."
      backHref="/libreria"
      backLabel="Librería Gratuita"
    >
      {blocks.map((block) => (
        <ZindoContentBlock key={block.id} block={block} />
      ))}
    </ZindoContentPage>
  );
}
