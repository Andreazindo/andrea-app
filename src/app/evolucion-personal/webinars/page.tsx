import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoContentBlock } from "@/components/zindo/MediaEmbed";
import { getContentBlocks } from "@/lib/content-blocks";

export const metadata: Metadata = { title: "Webinars" };

export default async function WebinarsPage() {
  const blocks = await getContentBlocks("webinars");

  return (
    <ZindoContentPage
      title="Webinars"
      subtitle="Sesiones en vivo con Andrea."
      backHref="/evolucion-personal"
      backLabel="Evolución Personal"
    >
      {blocks.map((block) => (
        <ZindoContentBlock key={block.id} block={block} />
      ))}
    </ZindoContentPage>
  );
}
