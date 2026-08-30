import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { createProductAction } from "./actions";
import { PlainBackLink } from "@/components/BackLink";

const ERROR_MESSAGES: Record<string, string> = {
  "falta-nombre": "El nombre es obligatorio.",
  "falta-categoria": "Elige una categoría.",
  "categoria-invalida": "La categoría elegida no es válida.",
  "precio-invalido": "El precio debe ser un número mayor a 0.",
};

const inputClass = "w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm";
const labelClass = "block text-sm font-medium mb-1";

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
        <h1 className="text-2xl font-bold tracking-tight mt-3">Nuevo producto</h1>
      </div>

      {error && (
        <p className="rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-3 py-2">
          {ERROR_MESSAGES[error] ?? "Revisa el formulario."}
        </p>
      )}

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
        <p className="text-xs text-black/50 dark:text-white/50">
          Las fotos se agregan después: mándamelas por chat y yo las subo por ahora.
        </p>
        <button
          type="submit"
          className="w-full rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-3 text-sm font-medium hover:opacity-90"
        >
          Crear producto
        </button>
      </form>
    </div>
  );
}
