import Image from "next/image";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";

const RECURSOS = [
  { name: "Detox Emocional", description: "Libera lo que ya no necesitas cargar." },
  { name: "21 Días de Gratitud", description: "Un reto diario para entrenar la mirada agradecida." },
  { name: "Meditaciones", description: "Audios guiados para pausar y respirar." },
];

export default function LibreriaPage() {
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
            Recursos gratuitos para tu intención diaria.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RECURSOS.map((recurso) => (
            <li key={recurso.name}>
              <ZindoBrandCard name={recurso.name} description={recurso.description} comingSoon />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
