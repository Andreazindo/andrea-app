import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoVideoEmbed } from "@/components/zindo/MediaEmbed";

export const metadata: Metadata = { title: "Entrevistas" };

export default function EntrevistasPage() {
  return (
    <ZindoContentPage
      title="Entrevistas"
      subtitle="Conversaciones sobre bienestar y desarrollo personal con Andrea."
      backHref="/evolucion-personal"
      backLabel="Evolución Personal"
    >
      <ZindoVideoEmbed title="Rompe el ciclo del estrés · Entrevista ZINDO (Junio 2024)" youtubeId="vrwqoaoYK9M" />
      <ZindoVideoEmbed
        title="Cómo el mindfulness puede ayudarte a impulsar tu negocio · Entrevista ZINDO (Julio 2024)"
        youtubeId="EcF42DckzF8"
      />
      <ZindoVideoEmbed title="Del burnout al bienestar · Entrevista ZINDO (Julio 2024)" youtubeId="zWlRtFdybg4" />
    </ZindoContentPage>
  );
}
