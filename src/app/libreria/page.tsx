import Image from "next/image";
import Link from "next/link";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";

const RECURSOS = [
  { slug: "detox-emocional", name: "Detox Emocional", description: "Libera lo que ya no necesitas cargar." },
  {
    slug: "21-dias-de-gratitud",
    name: "21 Días de Gratitud",
    description: "Un reto diario para entrenar la mirada agradecida.",
  },
  { slug: "meditaciones", name: "Meditaciones", description: "Audios guiados para pausar y respirar." },
];

export default function LibreriaPage() {
  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
        <div className="relative z-10">
          <Link
            href="/"
            className="text-sm hover:underline"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.gold }}
          >
            ‹ Inicio
          </Link>
          <h1
            className="mt-3 text-2xl sm:text-3xl uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            Librería Gratuita
          </h1>
          <p
            className="mt-3 max-w-lg mx-auto text-sm sm:text-base"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
          >
            Cuestiona · Aprende · Expande.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14">
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
