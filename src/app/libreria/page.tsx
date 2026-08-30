import Image from "next/image";
import type { Metadata } from "next";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Librería Gratuita" };

const RECURSOS = [
  { slug: "detox-emocional", name: "Detox Emocional", description: "Libera lo que ya no necesitas cargar." },
  {
    slug: "21-dias-de-gratitud",
    name: "21 Días de Gratitud",
    description: "Un reto diario para entrenar la mirada agradecida.",
  },
  { slug: "meditaciones", name: "Meditaciones", description: "Audios guiados para pausar y respirar." },
];

export default async function LibreriaPage() {
  const content = await getSiteContent(["libreria_tagline"] as const);

  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
        <div className="relative z-10">
          <h1
            className="text-2xl sm:text-3xl uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            Librería Gratuita
          </h1>
          <p
            className="mt-3 max-w-lg mx-auto text-sm sm:text-base"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
          >
            {content.libreria_tagline}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-6">
        <ZindoBackLink href="/" label="Inicio" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RECURSOS.map((recurso) => (
            <li key={recurso.slug}>
              <ZindoBrandCard
                href={`/libreria/${recurso.slug}`}
                name={recurso.name}
                description={recurso.description}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
