import Image from "next/image";
import type { Metadata } from "next";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { ZindoSectionHeading } from "@/components/zindo/SectionHeading";
import { ZindoMarbleFade } from "@/components/zindo/MarbleFade";
import { ZindoMarkdownLite } from "@/components/zindo/MarkdownLite";
import { zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Evolución Personal" };

export default async function EvolucionPersonalPage() {
  const content = await getSiteContent(["evolucion_tagline", "andrea_bio_photo", "andrea_bio"] as const);
  const andreaPhoto = content.andrea_bio_photo || "/zindo/andrea.jpg";

  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
        <ZindoMarbleFade />
        <div className="relative z-10">
          <h1
            className="text-2xl sm:text-3xl uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            Evolución Personal
          </h1>
          <p
            className="mt-3 max-w-lg mx-auto text-sm sm:text-base"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
          >
            {content.evolucion_tagline}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-6">
        <ZindoBackLink href="/" label="Inicio" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 space-y-14">
        <section>
          <ZindoSectionHeading>Sobre Andrea</ZindoSectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-10 items-start">
            <div className="mx-auto sm:mx-0 w-48 sm:w-full max-w-[240px]">
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-md shadow-md"
                style={{ border: `1px solid ${zindoColors.gold}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={andreaPhoto}
                  alt="Andrea Domínguez, creadora de ZINDO"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <ZindoMarkdownLite content={content.andrea_bio} />
            </div>
          </div>
        </section>

        <section>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <li>
              <ZindoBrandCard
                href="/evolucion-personal/cursos"
                name="Cursos Online"
                description="Programas para tu desarrollo personal, a tu ritmo."
              />
            </li>
            <li>
              <ZindoBrandCard
                href="/tienda/zindo/programa-acompanamiento"
                name="Acompañamiento Personalizado"
                description="El Programa de Acompañamiento Zindo: mentoría en video, a tu ritmo."
              />
            </li>
            <li>
              <ZindoBrandCard
                href="/evolucion-personal/journal-365"
                name="Journal 365"
                description="Tu diario de bienestar, día a día."
              />
            </li>
            <li>
              <ZindoBrandCard
                href="/evolucion-personal/webinars"
                name="Webinars"
                description="Sesiones en vivo con Andrea."
              />
            </li>
            <li>
              <ZindoBrandCard
                href="/evolucion-personal/testimonios"
                name="Testimonios"
                description="Historias reales de transformación."
              />
            </li>
            <li>
              <ZindoBrandCard
                href="/evolucion-personal/entrevistas"
                name="Entrevistas"
                description="Conversaciones sobre bienestar y desarrollo personal."
              />
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
