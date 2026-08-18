import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ZindoLogo } from "@/components/zindo/ZindoLogo";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";

export default async function HomePage() {
  const brands = await prisma.brand.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill priority className="object-cover" />
        <div className="relative z-10">
          <ZindoLogo color={zindoColors.ink} className="w-72 sm:w-96 mx-auto" />
          <p
            className="mt-6 text-sm sm:text-base tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.green }}
          >
            &ldquo;Tu mente crea tu realidad&rdquo;
          </p>
          <p
            className="mt-4 max-w-xl mx-auto text-sm sm:text-base"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
          >
            Belleza, bienestar y acompañamiento. Un solo lugar para Davana, Zindo, ProsperMind y Steril Mil.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2
          className="text-xl sm:text-2xl uppercase tracking-[0.15em] mb-6 text-center"
          style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
        >
          Nuestras marcas
        </h2>
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
      </section>
    </div>
  );
}
