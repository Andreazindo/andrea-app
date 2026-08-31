import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoVideoEmbed } from "@/components/zindo/MediaEmbed";

export const metadata: Metadata = { title: "Webinars" };

export default function WebinarsPage() {
  return (
    <ZindoContentPage
      title="Webinars"
      subtitle="Sesiones en vivo con Andrea."
      backHref="/evolucion-personal"
      backLabel="Evolución Personal"
    >
      <ZindoVideoEmbed title="¿Cómo ganarle la batalla al estrés y a la ansiedad?" driveId="1cN_cP38e6JJHb-fIio0A5hbGIWT0sJtC" />
    </ZindoContentPage>
  );
}
