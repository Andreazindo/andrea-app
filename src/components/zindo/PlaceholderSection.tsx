import Image from "next/image";
import Link from "next/link";
import { zindoColors } from "@/components/zindo/theme";

export function ZindoPlaceholderPage({
  title,
  backHref,
  backLabel,
}: {
  title: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
        <div className="relative z-10">
          <Link
            href={backHref}
            className="text-sm hover:underline"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.gold }}
          >
            ‹ {backLabel}
          </Link>
          <h1
            className="mt-3 text-2xl sm:text-3xl uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            {title}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span
          className="inline-block text-[10px] uppercase tracking-[0.1em] font-semibold px-3 py-1 rounded-full mb-4"
          style={{ backgroundColor: zindoColors.sage, color: "#ffffff" }}
        >
          Próximamente
        </span>
        <p
          className="text-sm sm:text-base"
          style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink, opacity: 0.75 }}
        >
          Estamos preparando este contenido. Vuelve pronto.
        </p>
      </div>
    </div>
  );
}
