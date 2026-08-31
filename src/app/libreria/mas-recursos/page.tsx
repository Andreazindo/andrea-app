import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoContentBlock } from "@/components/zindo/MediaEmbed";
import { getContentBlocks } from "@/lib/content-blocks";

export const metadata: Metadata = { title: "Más Recursos" };

export default async function MasRecursosPage() {
  const blocks = await getContentBlocks("libreria_mas_recursos");

  return (
    <ZindoContentPage
      title="Más Recursos"
      subtitle="Contenido extra para tu bienestar."
      backHref="/libreria"
      backLabel="Librería Gratuita"
    >
      {blocks.map((block) => (
        <ZindoContentBlock key={block.id} block={block} />
      ))}
    </ZindoContentPage>
  );
}
