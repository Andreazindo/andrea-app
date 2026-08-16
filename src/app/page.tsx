import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const brands = await prisma.brand.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Belleza, bienestar y acompañamiento
        </h1>
        <p className="mt-3 text-black/60 dark:text-white/60 max-w-2xl mx-auto">
          Cuatro marcas, un solo lugar. Conoce Davana, Zindo, ProsperMind y Steril Mil.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/tienda/${brand.slug}`}
            className="rounded-lg border border-black/10 dark:border-white/15 p-6 hover:border-black/30 dark:hover:border-white/40 transition-colors"
          >
            <h2 className="text-xl font-semibold">{brand.name}</h2>
            {brand.description && (
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">
                {brand.description}
              </p>
            )}
            <span className="mt-4 inline-block text-sm font-medium">
              Ver catálogo →
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
