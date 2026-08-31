import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoVideoEmbed } from "@/components/zindo/MediaEmbed";

export const metadata: Metadata = { title: "Meditaciones" };

export default function MeditacionesPage() {
  return (
    <ZindoContentPage
      title="Meditaciones"
      subtitle="Audios guiados para pausar y respirar."
      backHref="/libreria"
      backLabel="Librería Gratuita"
    >
      <ZindoVideoEmbed title="Meditación ZINDO · Recupera tu salud física" youtubeId="iIVfuCYDPg4" />
      <ZindoVideoEmbed
        title="Reto 10 Días de Gratitud · Meditación Día 1 · Agradecimiento a mi cuerpo (5 min)"
        youtubeId="6pVtv-qbsfI"
      />
    </ZindoContentPage>
  );
}
