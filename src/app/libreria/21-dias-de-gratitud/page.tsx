import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoLinkCard } from "@/components/zindo/MediaEmbed";

export const metadata: Metadata = { title: "21 Días de Gratitud" };

export default function VeintiunDiasGratitudPage() {
  return (
    <ZindoContentPage
      title="21 Días de Gratitud"
      subtitle="Un reto diario para entrenar la mirada agradecida."
      backHref="/libreria"
      backLabel="Librería Gratuita"
    >
      <ZindoLinkCard
        title="Frases del reto"
        description="Una frase por día para acompañar tus 21 días de gratitud."
        href="https://drive.google.com/drive/folders/1-qxUGEH74WFaMr5i3caF1DHw9At1WI8v"
      />
    </ZindoContentPage>
  );
}
