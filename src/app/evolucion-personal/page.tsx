import Image from "next/image";
import type { Metadata } from "next";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { ZindoSectionHeading } from "@/components/zindo/SectionHeading";
import { ZindoMarbleFade } from "@/components/zindo/MarbleFade";
import { zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Evolución Personal" };

const ANDREA_BIO = [
  "Andrea Domínguez es Licenciada en Comunicación Social por la UAM Xochimilco y durante más de una década desarrolló su carrera en el mundo de la publicidad. Después de casi 40 años viviendo sin saber realmente quién era, sin un camino propio y muchas veces desde la supervivencia y las expectativas de los demás, decidió transformar profundamente la manera en la que quería vivir y contribuir al mundo.",
  "Su propia experiencia la llevó a dedicar su vida al desarrollo personal y a la creación de herramientas que ayuden a las personas a conocerse, cuestionar las historias que las han definido y, sobre todo, recordar que su realidad no tiene por qué estar determinada por su pasado ni por las circunstancias externas.",
  "Cuenta con un Diplomado en Aplicación Psicoterapéutica del Mindfulness y diversas certificaciones relacionadas con el desarrollo psicosocial y el acompañamiento pedagógico. A lo largo de los años ha estudiado e integrado diferentes filosofías y herramientas de desarrollo personal, construyendo una mirada propia, práctica y profundamente humana.",
  "Es creadora de ZINDO, una metodología de desarrollo personal basada en la responsabilidad consciente, el poder de la mente y la capacidad creadora de cada persona. Su propósito es acompañar a quienes están listas para dejar de identificarse con lo que ocurre afuera y comenzar a vivir desde su propio poder interior.",
  "Hoy, su trabajo integra acompañamientos y proyectos de bienestar que parten de una misma filosofía: el autocuidado como una forma consciente de relacionarnos con nuestro cuerpo, nuestra mente y nuestro corazón.",
  "Andrea no busca decirle a nadie quién debe ser. Busca crear espacios y compartir herramientas para que cada persona pueda descubrirlo por sí misma.",
  "Después de todo lo que ha vivido y aprendido, hoy sabe que está aquí para ser y compartir.",
];

export default async function EvolucionPersonalPage() {
  const content = await getSiteContent(["evolucion_tagline"] as const);

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
              <div className="bg-white p-3 shadow-md" style={{ border: `1px solid ${zindoColors.gold}` }}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src="/zindo/andrea.jpg" alt="Andrea Domínguez, creadora de ZINDO" fill className="object-cover" />
                </div>
              </div>
            </div>
            <div className="space-y-4" style={{ fontFamily: "var(--font-zindo-body)" }}>
              {ANDREA_BIO.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-justify" style={{ color: zindoColors.ink, opacity: 0.85 }}>
                  {paragraph}
                </p>
              ))}
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
