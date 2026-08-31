import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoContentBlock } from "@/components/zindo/MediaEmbed";
import { getContentBlocks } from "@/lib/content-blocks";

export const metadata: Metadata = { title: "Entrevistas" };

export default async function EntrevistasPage() {
  const blocks = await getContentBlocks("entrevistas");

  return (
    <ZindoContentPage
      title="Entrevistas"
      subtitle="Conversaciones sobre bienestar y desarrollo personal con Andrea."
      backHref="/evolucion-personal"
      backLabel="Evolución Personal"
    >
      {blocks.map((block) => (
        <ZindoContentBlock key={block.id} block={block} />
      ))}
    </ZindoContentPage>
  );
}
