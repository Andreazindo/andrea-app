import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { PlainBackLink } from "@/components/BackLink";
import { addContentBlockAction, updateContentBlockAction, deleteContentBlockAction } from "./actions";

export const metadata: Metadata = { title: "Contenido multimedia (Admin)" };

const SECTIONS = [
  { key: "cursos_online", label: "Cursos Online", valueHelp: "Slug de la URL (ej. mente-maestra)" },
  { key: "webinars", label: "Webinars", valueHelp: "ID de YouTube o de Google Drive" },
  { key: "testimonios", label: "Testimonios", valueHelp: "ID de YouTube o de Google Drive" },
  { key: "entrevistas", label: "Entrevistas", valueHelp: "ID de YouTube o de Google Drive" },
  { key: "libreria_21dias", label: "Librería · 21 Días de Gratitud", valueHelp: "Enlace o ID" },
  { key: "libreria_meditaciones", label: "Librería · Meditaciones", valueHelp: "ID de YouTube o de Google Drive" },
  { key: "libreria_mas_recursos", label: "Librería · Más Recursos", valueHelp: "ID de YouTube/Drive o enlace" },
] as const;

const KIND_LABELS: Record<string, string> = {
  YOUTUBE: "YouTube",
  DRIVE: "Google Drive",
  LINK: "Enlace",
  COURSE: "Curso",
};

const ERROR_MESSAGES: Record<string, string> = {
  "item-invalido": "Completa tipo, título y valor.",
};

const inputClass = "w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm";
const labelClass = "block text-sm font-medium mb-1";
const sectionClass = "rounded-lg border border-black/10 dark:border-white/15 p-4 space-y-3";
const secondaryButtonClass =
  "rounded-md border border-black/15 dark:border-white/20 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10";

export default async function MultimediaAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; guardado?: string }>;
}) {
  await requireAdmin("/admin/multimedia");
  const { error, guardado } = await searchParams;

  const allBlocks = await prisma.contentBlock.findMany({ orderBy: { position: "asc" } });
  const bySection = Object.fromEntries(SECTIONS.map((s) => [s.key, allBlocks.filter((b) => b.section === s.key)]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      <div>
        <PlainBackLink href="/" label="Inicio" />
        <h1 className="text-2xl font-bold tracking-tight mt-3 mb-1">Contenido multimedia</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Cursos, webinars, testimonios, entrevistas y recursos de Librería — sin tocar código.
        </p>
      </div>

      {guardado && (
        <p className="rounded-md bg-green-500/10 text-green-700 dark:text-green-400 text-sm px-3 py-2">
          Cambios guardados.
        </p>
      )}
      {error && (
        <p className="rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-3 py-2">
          {ERROR_MESSAGES[error] ?? "Revisa el formulario."}
        </p>
      )}

      {SECTIONS.map((section) => {
        const items = bySection[section.key] ?? [];
        const defaultKind = section.key === "cursos_online" ? "COURSE" : "YOUTUBE";
        return (
          <section key={section.key} className="space-y-4">
            <h2 className="text-sm font-semibold">{section.label}</h2>

            {items.map((item) => (
              <div key={item.id} className={sectionClass}>
                <form action={updateContentBlockAction} className="space-y-3">
                  <input type="hidden" name="id" value={item.id} />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} htmlFor={`kind-${item.id}`}>
                        Tipo
                      </label>
                      <select
                        id={`kind-${item.id}`}
                        name="kind"
                        defaultValue={item.kind}
                        className={inputClass}
                      >
                        {Object.entries(KIND_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor={`title-${item.id}`}>
                        Título
                      </label>
                      <input
                        id={`title-${item.id}`}
                        name="title"
                        defaultValue={item.title}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`value-${item.id}`}>
                      Valor ({section.valueHelp})
                    </label>
                    <input
                      id={`value-${item.id}`}
                      name="value"
                      defaultValue={item.value}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`description-${item.id}`}>
                      Descripción (opcional, solo para tipo Enlace)
                    </label>
                    <input
                      id={`description-${item.id}`}
                      name="description"
                      defaultValue={item.description ?? ""}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="active" defaultChecked={item.active} />
                      Visible en el sitio
                    </label>
                    <button type="submit" className={secondaryButtonClass}>
                      Guardar
                    </button>
                  </div>
                </form>
                <form action={deleteContentBlockAction} className="flex justify-end">
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="text-xs text-red-600 dark:text-red-400 hover:underline">
                    Borrar &quot;{item.title}&quot;
                  </button>
                </form>
              </div>
            ))}

            <details className={sectionClass}>
              <summary className="text-sm font-semibold cursor-pointer">+ Agregar a {section.label}</summary>
              <form action={addContentBlockAction} className="mt-4 space-y-3">
                <input type="hidden" name="section" value={section.key} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass} htmlFor={`new-kind-${section.key}`}>
                      Tipo
                    </label>
                    <select
                      id={`new-kind-${section.key}`}
                      name="kind"
                      defaultValue={defaultKind}
                      className={inputClass}
                    >
                      {Object.entries(KIND_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`new-title-${section.key}`}>
                      Título
                    </label>
                    <input id={`new-title-${section.key}`} name="title" required className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor={`new-value-${section.key}`}>
                    Valor ({section.valueHelp})
                  </label>
                  <input id={`new-value-${section.key}`} name="value" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`new-description-${section.key}`}>
                    Descripción (opcional, solo para tipo Enlace)
                  </label>
                  <input id={`new-description-${section.key}`} name="description" className={inputClass} />
                </div>
                <button type="submit" className={secondaryButtonClass}>
                  Agregar
                </button>
              </form>
            </details>
          </section>
        );
      })}
    </div>
  );
}
