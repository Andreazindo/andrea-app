import Image from "next/image";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";

const PILLARS = [
  {
    href: "/evolucion-personal",
    name: "Evolución Personal",
    description: "Conoce tu mente. Transforma tu realidad.",
  },
  {
    href: "/tienda",
    name: "Tienda Wellness",
    description: "Elige lo que suma a tu bienestar.",
  },
  {
    href: "/libreria",
    name: "Librería Gratuita",
    description: "Cuestiona · Aprende · Expande.",
  },
  {
    href: "/contacto",
    name: "Contacto",
    description: "Correo, WhatsApp y redes sociales.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill priority className="object-cover" />
        <div className="relative z-10">
          <Image src="/zindo/logo.png" alt="Zindo" width={1080} height={1080} className="w-72 sm:w-96 mx-auto h-auto" priority />
          <p
            className="mt-6 text-sm sm:text-base tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.green }}
          >
            &ldquo;Tu mente crea tu realidad&rdquo;
          </p>
          <p
            className="mt-4 max-w-xl mx-auto text-sm sm:text-base"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
          >
            Un espacio de bienestar y de desarrollo personal hacia una forma consciente de vivir.
          </p>
          <a
            href="#explora"
            className="mt-6 inline-block rounded-md px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: zindoColors.green, fontFamily: "var(--font-zindo-body)" }}
          >
            Conocer más de ZINDO
          </a>
        </div>
      </section>

      <section id="explora" className="mx-auto max-w-5xl px-4 py-16">
        <h2
          className="text-xl sm:text-2xl uppercase tracking-[0.15em] mb-6 text-center"
          style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
        >
          Explora ZINDO
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PILLARS.map((pillar) => (
            <ZindoBrandCard key={pillar.href} href={pillar.href} name={pillar.name} description={pillar.description} />
          ))}
        </div>
      </section>
    </div>
  );
}
