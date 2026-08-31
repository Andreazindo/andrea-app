import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoVideoEmbed } from "@/components/zindo/MediaEmbed";
import { zindoColors } from "@/components/zindo/theme";

export const metadata: Metadata = { title: "Testimonios" };

export default function TestimoniosPage() {
  return (
    <ZindoContentPage
      title="Testimonios"
      subtitle="Historias reales de transformación."
      backHref="/evolucion-personal"
      backLabel="Evolución Personal"
    >
      <ZindoVideoEmbed title="Testimonio ZINDO" driveId="1C39pEd14BobAk0aO2CqTDeCNKxy917oJ" />
      <p className="text-sm" style={{ color: zindoColors.ink, opacity: 0.6 }}>
        Muy pronto se suman más testimonios — ya están en edición.
      </p>
    </ZindoContentPage>
  );
}
