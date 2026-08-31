import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { createProductAction } from "./actions";
import { PlainBackLink } from "@/components/BackLink";
import {
  AdminPageHeader,
  AdminFlash,
  adminInputClass as inputClass,
  adminLabelClass as labelClass,
  adminButtonPrimaryClass,
} from "@/components/admin/ui";

export const metadata: Metadata = { title: "Nuevo producto (Admin)" };

const ERROR_MESSAGES: Record<string, string> = {
  "falta-nombre": "El nombre es obligatorio.",
  "falta-categoria": "Elige una categoría.",
  "categoria-invalida": "La categoría elegida no es válida.",
  "precio-invalido": "El precio debe ser un número mayor a 0.",
};

export default async function NuevoProductoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin("/admin/productos/nuevo");
  const { error } = await searchParams;

  const categories = await prisma.category.findMany({
    include: { brand: true },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <PlainBackLink href="/admin/productos" label="Productos" />
        <div className="mt-3">
          <AdminPageHeader title="Nuevo producto" />
        </div>
      </div>

      <AdminFlash error={error} errorMessages={ERROR_MESSAGES} />

      <form action={createProductAction} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="name">
            Nombre
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="categoryId">
            Categoría
          </label>
          <select id="categoryId" name="categoryId" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Elige una categoría
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand.name} — {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="description">
            Descripción
          </label>
          <textarea id="description" name="description" rows={4} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="price">
              Precio (MXN)
            </label>
            <input id="price" name="price" type="number" step="0.01" min="0" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="stock">
              Stock inicial
            </label>
            <input id="stock" name="stock" type="number" min="0" defaultValue={0} className={inputClass} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="trackInventory" defaultChecked />
          Controlar inventario
        </label>
        <p className="text-xs text-[#1A1A1A]/50">
          Las fotos se agregan después: mándamelas por chat y yo las subo por ahora.
        </p>
        <button type="submit" className={`w-full ${adminButtonPrimaryClass}`}>
          Crear producto
        </button>
      </form>
    </div>
  );
}
