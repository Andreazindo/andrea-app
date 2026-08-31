import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoVideoEmbed } from "@/components/zindo/MediaEmbed";

export const metadata: Metadata = { title: "Más Recursos" };

export default function MasRecursosPage() {
  return (
    <ZindoContentPage
      title="Más Recursos"
      subtitle="Contenido extra para tu bienestar."
      backHref="/libreria"
      backLabel="Librería Gratuita"
    >
      <ZindoVideoEmbed
        title="Afirmaciones Positivas ZINDO · &ldquo;Yo Soy&rdquo; · Crecimiento Personal y Bienestar"
        youtubeId="EhrC1Eghl_E"
      />
      <ZindoVideoEmbed title="Reel · Mente Maestra" driveId="10nueSwBzWB0A5REeTFjx_m7aFuoJhpAr" />
      <ZindoVideoEmbed title="Reel · Aprender a ganar aunque pierdas" driveId="1ywwTo20lznmjL-pCYOlu83BBpQt7PXJj" />
    </ZindoContentPage>
  );
}
