import Image from "next/image";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";
import { getSiteContent } from "@/lib/site-content";
import { prisma } from "@/lib/prisma";

const CONTENT_KEYS = ["contacto_tagline", "contacto_mail", "contacto_whatsapp", "contacto_redes"] as const;

export default async function ContactoPage() {
  const [content, puntosDeVenta] = await Promise.all([
    getSiteContent(CONTENT_KEYS),
    prisma.salesPoint.findMany({ where: { active: true }, orderBy: { position: "asc" } }),
  ]);

  const canales = [
    content.contacto_mail
      ? { name: "Mail", description: content.contacto_mail, href: `mailto:${content.contacto_mail}` }
      : { name: "Mail", description: "Muy pronto encontrarás aquí nuestro correo de contacto." },
    content.contacto_whatsapp
      ? {
          name: "WhatsApp",
          description: content.contacto_whatsapp,
          href: content.contacto_whatsapp.startsWith("http")
            ? content.contacto_whatsapp
            : `https://wa.me/${content.contacto_whatsapp.replace(/\D/g, "")}`,
        }
      : { name: "WhatsApp", description: "Muy pronto encontrarás aquí nuestro número de WhatsApp." },
    content.contacto_redes
      ? { name: "Redes Sociales", description: content.contacto_redes }
      : { name: "Redes Sociales", description: "Muy pronto encontrarás aquí nuestras redes sociales." },
  ];

  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
        <div className="relative z-10">
          <h1
            className="text-2xl sm:text-3xl uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            Contacto
          </h1>
          <p
            className="mt-3 max-w-lg mx-auto text-sm sm:text-base"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
          >
            {content.contacto_tagline}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-6">
        <ZindoBackLink href="/" label="Inicio" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 space-y-14">
        <section>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {canales.map((canal) => (
              <li key={canal.name}>
                <ZindoBrandCard
                  name={canal.name}
                  description={canal.description}
                  href={canal.href}
                  comingSoon={!canal.href}
                />
              </li>
            ))}
          </ul>
        </section>

        {puntosDeVenta.length > 0 && (
          <section>
            <h2
              className="text-xl sm:text-2xl uppercase tracking-[0.15em] mb-6"
              style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
            >
              Puntos de Venta
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {puntosDeVenta.map((punto) => (
                <li key={punto.id}>
                  <ZindoBrandCard name={punto.name} description={punto.description} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
