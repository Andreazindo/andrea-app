import Image from "next/image";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { ZindoSectionHeading } from "@/components/zindo/SectionHeading";
import { ZindoMarbleFade } from "@/components/zindo/MarbleFade";
import { zindoColors } from "@/components/zindo/theme";
import { getSiteContent } from "@/lib/site-content";

const CONTENT_KEYS = [
  "home_tagline",
  "home_description",
  "home_cta_label",
  "evolucion_tagline",
  "tienda_tagline",
  "libreria_tagline",
  "contacto_tagline",
] as const;

export default async function HomePage() {
  const content = await getSiteContent(CONTENT_KEYS);

  const pillars = [
    { href: "/evolucion-personal", name: "Evolución Personal", description: content.evolucion_tagline },
    { href: "/tienda", name: "Tienda Wellness", description: content.tienda_tagline },
    { href: "/libreria", name: "Librería Gratuita", description: content.libreria_tagline },
    { href: "/contacto", name: "Contacto", description: content.contacto_tagline },
  ];

  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill priority className="object-cover" />
        <ZindoMarbleFade />
        <div className="relative z-10">
          <Image src="/zindo/logo.png" alt="Zindo" width={1080} height={1080} className="w-72 sm:w-96 mx-auto h-auto" priority />
          <p
            className="mt-6 text-sm sm:text-base tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.green }}
          >
            &ldquo;{content.home_tagline}&rdquo;
          </p>
          <p
            className="mt-4 max-w-xl mx-auto text-sm sm:text-base"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
          >
            {content.home_description}
          </p>
          <a
            href="#explora"
            className="mt-6 inline-block rounded-md px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: zindoColors.green, fontFamily: "var(--font-zindo-body)" }}
          >
            {content.home_cta_label}
          </a>
        </div>
      </section>

      <section id="explora" className="mx-auto max-w-5xl px-4 py-16">
        <ZindoSectionHeading>Explora ZINDO</ZindoSectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {pillars.map((pillar) => (
            <ZindoBrandCard key={pillar.href} href={pillar.href} name={pillar.name} description={pillar.description} />
          ))}
        </div>
      </section>
    </div>
  );
}
