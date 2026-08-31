import type { Metadata } from "next";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { getContentBlocks } from "@/lib/content-blocks";

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
            <ZindoBrandCard href={`/evolucion-personal/cursos/${curso.value}`} name={curso.title} />
          </li>
        ))}
      </ul>
    </ZindoContentPage>
  );
}
