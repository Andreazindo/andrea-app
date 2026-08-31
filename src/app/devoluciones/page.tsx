import Image from "next/image";
import type { Metadata } from "next";
import { ZindoMarbleFade } from "@/components/zindo/MarbleFade";
import { ZindoMarkdownLite } from "@/components/zindo/MarkdownLite";
import { zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Política de Devoluciones" };

export default async function DevolucionesPage() {
  const { legal_devoluciones } = await getSiteContent(["legal_devoluciones"] as const);

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
            Política de Devoluciones
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pt-6">
        <ZindoBackLink href="/" label="Inicio" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10">
        {legal_devoluciones ? (
          <ZindoMarkdownLite content={legal_devoluciones} />
        ) : (
          <p className="text-sm" style={{ color: zindoColors.ink, opacity: 0.6 }}>
            Muy pronto encontrarás aquí nuestra Política de Devoluciones.
          </p>
        )}
      </div>
    </div>
  );
}
