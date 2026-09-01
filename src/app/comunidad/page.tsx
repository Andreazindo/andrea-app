import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { WhatsappIcon } from "@/components/zindo/ContactIcons";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Comunidad" };

const CONTENT_KEYS = ["comunidad_tagline", "comunidad_whatsapp_link"] as const;

export default async function ComunidadPage() {
  const content = await getSiteContent(CONTENT_KEYS);

  return (
    <ZindoContentPage
      title="Comunidad"
      subtitle={
        content.comunidad_tagline ||
        "Un espacio para compartir tu proceso, resolver dudas y acompañarnos en el camino hacia una vida más consciente."
      }
      backHref="/"
      backLabel="Inicio"
    >
      <div className="max-w-sm mx-auto">
        <ZindoBrandCard
          name="Grupo de WhatsApp"
          description={
            content.comunidad_whatsapp_link
              ? "Únete para platicar con otras personas de la comunidad ZINDO, compartir tus avances y resolver dudas."
              : "Muy pronto abrimos nuestro grupo de WhatsApp para la comunidad ZINDO."
          }
          href={content.comunidad_whatsapp_link || undefined}
          comingSoon={!content.comunidad_whatsapp_link}
          icon={<WhatsappIcon />}
          ctaLabel="Unirme →"
        />
      </div>
    </ZindoContentPage>
  );
}
