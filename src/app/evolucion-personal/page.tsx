import Image from "next/image";
import type { Metadata } from "next";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Evolución Personal" };

const CURSOS = [
  { slug: "redefiniendo-el-exito", name: "Redefiniendo el éxito" },
  { slug: "cambio-consciente", name: "Cambio Consciente" },
  { slug: "vida-en-calma", name: "Vida en Calma" },
  { slug: "mente-maestra", name: "Mente Maestra" },
  { slug: "observa-crea", name: "Observa, crea" },
];

export default async function EvolucionPersonalPage() {
  const content = await getSiteContent(["evolucion_tagline"] as const);

  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
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
          <h2
            className="text-xl sm:text-2xl uppercase tracking-[0.15em] mb-6"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            Cursos Online
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CURSOS.map((curso) => (
              <li key={curso.slug}>
                <ZindoBrandCard href={`/evolucion-personal/cursos/${curso.slug}`} name={curso.name} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          </ul>
        </section>
      </div>
    </div>
  );
}
