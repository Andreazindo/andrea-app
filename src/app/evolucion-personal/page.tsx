import Image from "next/image";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";

const CURSOS = [
  "Redefiniendo el éxito",
  "Cambio Consciente",
  "Vida en Calma",
  "Mente Maestra",
  "Observa, crea",
];

export default function EvolucionPersonalPage() {
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
            Herramientas y acompañamiento para una forma consciente de vivir.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 space-y-14">
        <section>
          <h2
            className="text-xl sm:text-2xl uppercase tracking-[0.15em] mb-6"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            Cursos Online
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CURSOS.map((curso) => (
              <li key={curso}>
                <ZindoBrandCard name={curso} comingSoon />
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
              <ZindoBrandCard name="Journal 365" description="Tu diario de bienestar, día a día." comingSoon />
            </li>
            <li>
              <ZindoBrandCard name="Webinars" description="Sesiones en vivo con Andrea." comingSoon />
            </li>
            <li>
              <ZindoBrandCard name="Testimonios" description="Historias reales de transformación." comingSoon />
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
