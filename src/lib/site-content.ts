import { prisma } from "@/lib/prisma";

export const EDITABLE_CONTENT_KEYS = [
  "home_tagline",
  "home_description",
  "home_cta_label",
  "tienda_tagline",
  "evolucion_tagline",
  "libreria_tagline",
  "contacto_tagline",
  "contacto_mail",
  "contacto_whatsapp",
  "contacto_redes",
  "legal_terminos",
  "legal_privacidad",
  "legal_devoluciones",
] as const;

export async function getSiteContent<K extends string>(keys: readonly K[]): Promise<Record<K, string>> {
  const rows = await prisma.siteContent.findMany({ where: { key: { in: [...keys] } } });
  const map = Object.fromEntries(keys.map((k) => [k, ""])) as Record<K, string>;
  for (const row of rows) {
    if ((keys as readonly string[]).includes(row.key)) map[row.key as K] = row.value;
  }
  return map;
}
