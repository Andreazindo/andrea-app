import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TiendaPage() {
  const brands = await prisma.brand.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Tienda</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {brands.map((brand) => (
          <li key={brand.id}>
            <Link
              href={`/tienda/${brand.slug}`}
              className="block rounded-lg border border-black/10 dark:border-white/15 p-6 hover:border-black/30 dark:hover:border-white/40 transition-colors"
            >
              <h2 className="text-lg font-semibold">{brand.name}</h2>
              {brand.description && (
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                  {brand.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
