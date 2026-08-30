import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ZindoBrandCard } from "@/components/zindo/BrandCard";
import { zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";

const CATEGORY_ORDER = ["yoga-face", "limpieza", "suplementos", "esencias", "catalogo-ml"];

async function getWellnessCategories() {
  const categories = await prisma.category.findMany({
    where: { slug: { in: CATEGORY_ORDER } },
    select: {
      id: true,
      slug: true,
      name: true,
      _count: { select: { products: { where: { active: true } } } },
    },
  });

  return CATEGORY_ORDER.map((slug) => categories.find((c) => c.slug === slug)).filter(
    (c): c is (typeof categories)[number] => Boolean(c) && c!._count.products > 0
  );
}

export default async function TiendaPage() {
  const categories = await getWellnessCategories();

  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
        <div className="relative z-10">
          <h1
            className="text-2xl sm:text-3xl uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            Tienda Wellness
          </h1>
          <p
            className="mt-3 max-w-lg mx-auto text-sm sm:text-base"
            style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
          >
            Elige lo que suma a tu bienestar.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-6">
        <ZindoBackLink href="/" label="Inicio" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <li key={category.id}>
              <ZindoBrandCard
                href={`/tienda/categoria/${category.slug}`}
                name={category.name}
                description={`${category._count.products} producto${category._count.products === 1 ? "" : "s"}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
