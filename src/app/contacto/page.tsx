import Image from "next/image";
import Link from "next/link";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";

const CANALES = [
  { name: "Mail", description: "Muy pronto encontrarás aquí nuestro correo de contacto." },
  { name: "WhatsApp", description: "Muy pronto encontrarás aquí nuestro número de WhatsApp." },
  { name: "Redes Sociales", description: "Muy pronto encontrarás aquí nuestras redes sociales." },
];

const PUNTOS_DE_VENTA = [
  { name: "Body & Face Spa", description: "Cancún · Plaza Aria, Huayacán" },
  { name: "Diana Leal", description: "Playa del Carmen" },
];

export default function ContactoPage() {
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
            Contacto
          </h1>
          <p
            className="mt-3 max-w-lg mx-auto text-sm sm:text-base"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
          >
            Estamos para acompañarte. Escríbenos.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 space-y-14">
        <section>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CANALES.map((canal) => (
              <li key={canal.name}>
                <ZindoBrandCard name={canal.name} description={canal.description} comingSoon />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2
            className="text-xl sm:text-2xl uppercase tracking-[0.15em] mb-6"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            Puntos de Venta
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PUNTOS_DE_VENTA.map((punto) => (
              <li key={punto.name}>
                <ZindoBrandCard name={punto.name} description={punto.description} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
