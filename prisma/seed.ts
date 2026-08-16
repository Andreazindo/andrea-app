import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, BrandCode, ProductType } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function upsertBrand(code: BrandCode, name: string, slug: string, description: string) {
  return prisma.brand.upsert({
    where: { code },
    update: { name, slug, description },
    create: { code, name, slug, description },
  });
}

async function upsertCategory(brandId: string, name: string, slug: string) {
  return prisma.category.upsert({
    where: { brandId_slug: { brandId, slug } },
    update: { name },
    create: { brandId, name, slug },
  });
}

async function upsertProduct(params: {
  brandId: string;
  categoryId?: string;
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  imageUrl?: string;
  isExternal?: boolean;
  externalUrl?: string | null;
}) {
  const { brandId, slug, ...rest } = params;
  return prisma.product.upsert({
    where: { brandId_slug: { brandId, slug } },
    update: { ...rest },
    create: { brandId, slug, ...rest },
  });
}

async function upsertVariant(params: {
  productId: string;
  sku: string;
  name: string;
  priceCents: number;
  trackInventory?: boolean;
  stock?: number;
}) {
  const { sku, ...rest } = params;
  return prisma.productVariant.upsert({
    where: { sku },
    update: { ...rest },
    create: { sku, ...rest },
  });
}

async function setKitComponents(kitVariantId: string, components: { componentVariantId: string; quantity: number }[]) {
  await prisma.kitComponent.deleteMany({ where: { kitVariantId } });
  for (const c of components) {
    await prisma.kitComponent.create({
      data: { kitVariantId, componentVariantId: c.componentVariantId, quantity: c.quantity },
    });
  }
}

async function main() {
  // ---------- Davana ----------
  const davana = await upsertBrand(
    BrandCode.DAVANA,
    "Davana",
    "davana",
    "Belleza y bienestar: rutinas faciales, limpieza y perfumes."
  );

  // Categoría Yoga Face
  const yogaFace = await upsertCategory(davana.id, "Yoga Face", "yoga-face");

  const guashaElectrico = await upsertProduct({
    brandId: davana.id,
    categoryId: yogaFace.id,
    name: "Guasha Eléctrica",
    slug: "guasha-electrica",
    description: "Dispositivo de guasha eléctrica para rutinas de yoga facial.",
    type: ProductType.SIMPLE,
  });
  const guashaElectricoV = await upsertVariant({
    productId: guashaElectrico.id,
    sku: "DAV-YF-GUASHA-ELEC",
    name: "Guasha Eléctrica",
    priceCents: 89900,
    stock: 25,
  });

  const guashaCuarzo = await upsertProduct({
    brandId: davana.id,
    categoryId: yogaFace.id,
    name: "Guasha de Cuarzo Rosa",
    slug: "guasha-cuarzo-rosa",
    description: "Piedra de guasha de cuarzo rosa para rutinas de yoga facial.",
    type: ProductType.SIMPLE,
  });
  const guashaCuarzoV = await upsertVariant({
    productId: guashaCuarzo.id,
    sku: "DAV-YF-GUASHA-CUARZO",
    name: "Guasha de Cuarzo Rosa",
    priceCents: 34900,
    stock: 40,
  });

  const serumReafirmante = await upsertProduct({
    brandId: davana.id,
    categoryId: yogaFace.id,
    name: "Sérum Reafirmante",
    slug: "serum-reafirmante",
    description: "Sérum facial reafirmante para complementar las rutinas de Yoga Face.",
    type: ProductType.SIMPLE,
  });
  const serumReafirmanteV = await upsertVariant({
    productId: serumReafirmante.id,
    sku: "DAV-YF-SERUM",
    name: "Sérum Reafirmante 30ml",
    priceCents: 45900,
    stock: 60,
  });

  const kitGuashaElectrica = await upsertProduct({
    brandId: davana.id,
    categoryId: yogaFace.id,
    name: "Kit Yoga Face · Guasha Eléctrica",
    slug: "kit-yoga-face-guasha-electrica",
    description: "Incluye Guasha Eléctrica + Sérum Reafirmante. Acceso a videos de rutinas específicas de este kit.",
    type: ProductType.KIT,
  });
  const kitGuashaElectricaV = await upsertVariant({
    productId: kitGuashaElectrica.id,
    sku: "DAV-YF-KIT-ELEC",
    name: "Kit Guasha Eléctrica",
    priceCents: 119900,
    trackInventory: false,
    stock: 0,
  });
  await setKitComponents(kitGuashaElectricaV.id, [
    { componentVariantId: guashaElectricoV.id, quantity: 1 },
    { componentVariantId: serumReafirmanteV.id, quantity: 1 },
  ]);

  const kitGuashaCuarzo = await upsertProduct({
    brandId: davana.id,
    categoryId: yogaFace.id,
    name: "Kit Yoga Face · Guasha de Cuarzo Rosa",
    slug: "kit-yoga-face-guasha-cuarzo-rosa",
    description: "Incluye Guasha de Cuarzo Rosa + Sérum Reafirmante. Acceso a videos de rutinas específicas de este kit.",
    type: ProductType.KIT,
  });
  const kitGuashaCuarzoV = await upsertVariant({
    productId: kitGuashaCuarzo.id,
    sku: "DAV-YF-KIT-CUARZO",
    name: "Kit Guasha de Cuarzo Rosa",
    priceCents: 69900,
    trackInventory: false,
    stock: 0,
  });
  await setKitComponents(kitGuashaCuarzoV.id, [
    { componentVariantId: guashaCuarzoV.id, quantity: 1 },
    { componentVariantId: serumReafirmanteV.id, quantity: 1 },
  ]);

  const kitCompleto = await upsertProduct({
    brandId: davana.id,
    categoryId: yogaFace.id,
    name: "Kit Yoga Face · Completo",
    slug: "kit-yoga-face-completo",
    description: "Incluye Guasha Eléctrica, Guasha de Cuarzo Rosa y Sérum Reafirmante. Acceso a todas las rutinas.",
    type: ProductType.KIT,
  });
  const kitCompletoV = await upsertVariant({
    productId: kitCompleto.id,
    sku: "DAV-YF-KIT-COMPLETO",
    name: "Kit Completo",
    priceCents: 169900,
    trackInventory: false,
    stock: 0,
  });
  await setKitComponents(kitCompletoV.id, [
    { componentVariantId: guashaElectricoV.id, quantity: 1 },
    { componentVariantId: guashaCuarzoV.id, quantity: 1 },
    { componentVariantId: serumReafirmanteV.id, quantity: 1 },
  ]);

  // Categoría Limpieza
  const limpieza = await upsertCategory(davana.id, "Limpieza", "limpieza");

  const espumaLimpiadora = await upsertProduct({
    brandId: davana.id,
    categoryId: limpieza.id,
    name: "Espuma Limpiadora",
    slug: "espuma-limpiadora",
    description: "Espuma limpiadora facial suave para uso diario.",
    type: ProductType.SIMPLE,
  });
  const espumaLimpiadoraV = await upsertVariant({
    productId: espumaLimpiadora.id,
    sku: "DAV-LIMP-ESPUMA",
    name: "Espuma Limpiadora 150ml",
    priceCents: 29900,
    stock: 50,
  });

  const tonicoFacial = await upsertProduct({
    brandId: davana.id,
    categoryId: limpieza.id,
    name: "Tónico Facial",
    slug: "tonico-facial",
    description: "Tónico facial equilibrante post-limpieza.",
    type: ProductType.SIMPLE,
  });
  const tonicoFacialV = await upsertVariant({
    productId: tonicoFacial.id,
    sku: "DAV-LIMP-TONICO",
    name: "Tónico Facial 150ml",
    priceCents: 27900,
    stock: 50,
  });

  const exfoliante = await upsertProduct({
    brandId: davana.id,
    categoryId: limpieza.id,
    name: "Exfoliante Facial",
    slug: "exfoliante-facial",
    description: "Exfoliante suave de uso semanal.",
    type: ProductType.SIMPLE,
  });
  const exfolianteV = await upsertVariant({
    productId: exfoliante.id,
    sku: "DAV-LIMP-EXFOL",
    name: "Exfoliante Facial 100ml",
    priceCents: 32900,
    stock: 50,
  });

  const kitLimpieza = await upsertProduct({
    brandId: davana.id,
    categoryId: limpieza.id,
    name: "Kit Limpieza Facial Completo",
    slug: "kit-limpieza-facial-completo",
    description: "Incluye Espuma Limpiadora, Tónico Facial y Exfoliante.",
    type: ProductType.KIT,
  });
  const kitLimpiezaV = await upsertVariant({
    productId: kitLimpieza.id,
    sku: "DAV-LIMP-KIT",
    name: "Kit Limpieza Completo",
    priceCents: 79900,
    trackInventory: false,
    stock: 0,
  });
  await setKitComponents(kitLimpiezaV.id, [
    { componentVariantId: espumaLimpiadoraV.id, quantity: 1 },
    { componentVariantId: tonicoFacialV.id, quantity: 1 },
    { componentVariantId: exfolianteV.id, quantity: 1 },
  ]);

  // Categoría Perfumes
  const perfumes = await upsertCategory(davana.id, "Perfumes", "perfumes");

  const perfumeDefs = [
    { name: "Perfume Flor de Loto", slug: "perfume-flor-de-loto", sku: "DAV-PERF-LOTO" },
    { name: "Perfume Ámbar", slug: "perfume-ambar", sku: "DAV-PERF-AMBAR" },
    { name: "Perfume Cítrico", slug: "perfume-citrico", sku: "DAV-PERF-CITRICO" },
    { name: "Perfume Vainilla", slug: "perfume-vainilla", sku: "DAV-PERF-VAINILLA" },
  ];
  const perfumeVariants = [];
  for (const p of perfumeDefs) {
    const product = await upsertProduct({
      brandId: davana.id,
      categoryId: perfumes.id,
      name: p.name,
      slug: p.slug,
      description: `${p.name}, 50ml.`,
      type: ProductType.SIMPLE,
    });
    const variant = await upsertVariant({
      productId: product.id,
      sku: p.sku,
      name: `${p.name} 50ml`,
      priceCents: 39900,
      stock: 30,
    });
    perfumeVariants.push(variant);
  }

  const kitPerfumes = await upsertProduct({
    brandId: davana.id,
    categoryId: perfumes.id,
    name: "Kit Colección de Perfumes",
    slug: "kit-coleccion-perfumes",
    description: "Los 4 perfumes Davana en un solo kit.",
    type: ProductType.KIT,
  });
  const kitPerfumesV = await upsertVariant({
    productId: kitPerfumes.id,
    sku: "DAV-PERF-KIT",
    name: "Kit Colección Completa",
    priceCents: 129900,
    trackInventory: false,
    stock: 0,
  });
  await setKitComponents(
    kitPerfumesV.id,
    perfumeVariants.map((v) => ({ componentVariantId: v.id, quantity: 1 }))
  );

  // ---------- Zindo ----------
  const zindo = await upsertBrand(
    BrandCode.ZINDO,
    "Zindo",
    "zindo",
    "Mentoría y acompañamiento personal en video, con material descargable."
  );
  const zindoCategoria = await upsertCategory(zindo.id, "Programa", "programa");
  const programaZindo = await upsertProduct({
    brandId: zindo.id,
    categoryId: zindoCategoria.id,
    name: "Programa de Acompañamiento Zindo",
    slug: "programa-acompanamiento",
    description:
      "5 módulos en video + PDFs descargables. El acceso al contenido se habilita automáticamente al confirmarse el pago.",
    type: ProductType.SIMPLE,
  });
  await upsertVariant({
    productId: programaZindo.id,
    sku: "ZIN-PROGRAMA-5MOD",
    name: "Programa completo (5 módulos)",
    priceCents: 299900,
    trackInventory: false,
    stock: 0,
  });

  // ---------- ProsperMind ----------
  const prospermind = await upsertBrand(
    BrandCode.PROSPERMIND,
    "ProsperMind",
    "prospermind",
    "Suplementos de reventa: Tirosina y complementos."
  );
  const suplementos = await upsertCategory(prospermind.id, "Suplementos", "suplementos");

  const tirosina = await upsertProduct({
    brandId: prospermind.id,
    categoryId: suplementos.id,
    name: "Tirosina",
    slug: "tirosina",
    description: "Suplemento de L-Tirosina, 60 cápsulas.",
    type: ProductType.SIMPLE,
  });
  const tirosinaV = await upsertVariant({
    productId: tirosina.id,
    sku: "PM-TIROSINA-60",
    name: "Tirosina 60 cápsulas",
    priceCents: 38900,
    stock: 35,
  });

  const complejoB = await upsertProduct({
    brandId: prospermind.id,
    categoryId: suplementos.id,
    name: "Complejo B",
    slug: "complejo-b",
    description: "Suplemento de Complejo B, 60 cápsulas.",
    type: ProductType.SIMPLE,
  });
  const complejoBV = await upsertVariant({
    productId: complejoB.id,
    sku: "PM-COMPLEJOB-60",
    name: "Complejo B 60 cápsulas",
    priceCents: 29900,
    stock: 35,
  });

  const kitEnergia = await upsertProduct({
    brandId: prospermind.id,
    categoryId: suplementos.id,
    name: "Kit ProsperMind Energía",
    slug: "kit-prospermind-energia",
    description: "Incluye Tirosina + Complejo B.",
    type: ProductType.KIT,
  });
  const kitEnergiaV = await upsertVariant({
    productId: kitEnergia.id,
    sku: "PM-KIT-ENERGIA",
    name: "Kit Energía",
    priceCents: 59900,
    trackInventory: false,
    stock: 0,
  });
  await setKitComponents(kitEnergiaV.id, [
    { componentVariantId: tirosinaV.id, quantity: 1 },
    { componentVariantId: complejoBV.id, quantity: 1 },
  ]);

  // ---------- Steril Mil ----------
  const sterilMil = await upsertBrand(
    BrandCode.STERIL_MIL,
    "Steril Mil",
    "steril-mil",
    "Catálogo disponible hoy en Mercado Libre."
  );
  const sterilCategoria = await upsertCategory(sterilMil.id, "Catálogo Mercado Libre", "catalogo-ml");
  const sterilProducto = await upsertProduct({
    brandId: sterilMil.id,
    categoryId: sterilCategoria.id,
    name: "Producto Steril Mil (ejemplo)",
    slug: "producto-steril-mil-ejemplo",
    description:
      "Producto de ejemplo. Steril Mil se vende hoy en Mercado Libre: el botón de compra redirige ahí. Pendiente que Andrea proporcione el catálogo real y los enlaces de cada publicación.",
    type: ProductType.SIMPLE,
    isExternal: true,
    externalUrl: null,
  });
  await upsertVariant({
    productId: sterilProducto.id,
    sku: "STM-EJEMPLO-1",
    name: "Presentación única",
    priceCents: 0,
    trackInventory: false,
    stock: 0,
  });

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
