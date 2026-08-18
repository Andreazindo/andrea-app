import { prisma } from "@/lib/prisma";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";

export default async function TiendaPage() {
  const brands = await prisma.brand.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1
        className="text-2xl uppercase tracking-[0.15em] mb-6"
        style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
      >
        Tienda
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {brands.map((brand) => (
          <ZindoBrandCard
            key={brand.id}
            href={`/tienda/${brand.slug}`}
            name={brand.name}
            description={brand.description}
          />
        ))}
      </div>
    </div>
  );
}
