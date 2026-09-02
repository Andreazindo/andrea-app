import Link from "next/link";
import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { zindoColors } from "@/components/zindo/theme";
import { getContentBlocks } from "@/lib/content-blocks";
import { formatCents } from "@/lib/money";

export const metadata: Metadata = { title: "Cursos Online" };

export default async function CursosOnlinePage() {
  const cursos = await getContentBlocks("cursos_online");

  return (
    <ZindoContentPage
      title="Cursos Online"
      subtitle="Programas para tu desarrollo personal, a tu ritmo."
      backHref="/evolucion-personal"
      backLabel="Evolución Personal"
      wide
    >
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cursos.map((curso) => (
          <li key={curso.id}>
            <Link
              href={`/evolucion-personal/cursos/${curso.value}`}
              className="zindo-fade-in block h-full rounded-lg bg-white/70 border overflow-hidden transition-all duration-300 ease-out hover:border-[#C9A15B] hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderColor: zindoColors.sage }}
            >
              {curso.imageUrl && (
                <div className="relative w-full aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={curso.imageUrl} alt={curso.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-5">
                <h2
                  className="text-lg uppercase tracking-[0.1em]"
                  style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
                >
                  {curso.title}
                </h2>
                {curso.description && (
                  <p className="mt-2 text-sm line-clamp-2" style={{ color: zindoColors.ink, opacity: 0.75 }}>
                    {curso.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  {curso.priceCents != null && (
                    <span className="text-sm font-semibold" style={{ color: zindoColors.gold }}>
                      {formatCents(curso.priceCents)}
                    </span>
                  )}
                  <span className="text-sm font-medium" style={{ color: zindoColors.gold }}>
                    Ver más →
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </ZindoContentPage>
  );
}
