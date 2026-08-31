import type { Metadata } from "next";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { ZindoContentPage } from "@/components/zindo/ContentPage";

export const metadata: Metadata = { title: "Cursos Online" };

const CURSOS = [
  { slug: "redefiniendo-el-exito", name: "Redefiniendo el éxito" },
  { slug: "cambio-consciente", name: "Cambio Consciente" },
  { slug: "vida-en-calma", name: "Vida en Calma" },
  { slug: "mente-maestra", name: "Mente Maestra" },
  { slug: "observa-crea", name: "Observa, crea" },
];

export default function CursosOnlinePage() {
  return (
    <ZindoContentPage
      title="Cursos Online"
      subtitle="Programas para tu desarrollo personal, a tu ritmo."
      backHref="/evolucion-personal"
      backLabel="Evolución Personal"
      wide
    >
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {CURSOS.map((curso) => (
          <li key={curso.slug}>
            <ZindoBrandCard href={`/evolucion-personal/cursos/${curso.slug}`} name={curso.name} />
          </li>
        ))}
      </ul>
    </ZindoContentPage>
  );
}
