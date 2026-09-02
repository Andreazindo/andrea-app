import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { PlainBackLink } from "@/components/BackLink";
import {
  AdminPageHeader,
  AdminFlash,
  adminCardClass as sectionClass,
  adminInputClass as inputClass,
  adminLabelClass as labelClass,
  adminButtonSecondaryClass as secondaryButtonClass,
  adminDangerLinkClass,
} from "@/components/admin/ui";
import { addContentBlockAction, updateContentBlockAction, deleteContentBlockAction } from "./actions";

export const metadata: Metadata = { title: "Contenido multimedia (Admin)" };

const SECTIONS = [
  { key: "cursos_online", label: "Cursos Online", valueHelp: "Slug de la URL (ej. mente-maestra)" },
  { key: "webinars", label: "Webinars", valueHelp: "ID de YouTube o de Google Drive" },
  { key: "testimonios", label: "Testimonios", valueHelp: "ID de YouTube o de Google Drive" },
  { key: "entrevistas", label: "Entrevistas", valueHelp: "ID de YouTube o de Google Drive" },
  { key: "libreria_21dias", label: "Librería · 21 Días de Gratitud", valueHelp: "URL de la imagen (ej. /zindo/21-dias-gratitud/01.webp)" },
  { key: "libreria_meditaciones", label: "Librería · Meditaciones", valueHelp: "ID de YouTube o de Google Drive" },
  { key: "libreria_mas_recursos", label: "Librería · Más Recursos", valueHelp: "ID de YouTube/Drive o enlace" },
] as const;

const KIND_LABELS: Record<string, string> = {
  YOUTUBE: "YouTube",
  DRIVE: "Google Drive",
  LINK: "Enlace",
  COURSE: "Curso",
  IMAGE: "Imagen",
};

const ERROR_MESSAGES: Record<string, string> = {
  "item-invalido": "Completa tipo, título y valor.",
};

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
        <div className="mt-3">
          <AdminPageHeader
            title="Contenido multimedia"
            subtitle="Cursos, webinars, testimonios, entrevistas y recursos de Librería — sin tocar código."
          />
        </div>
      </div>

      <AdminFlash guardado={guardado} error={error} errorMessages={ERROR_MESSAGES} />

      {SECTIONS.map((section) => {
        const items = bySection[section.key] ?? [];
        const defaultKind =
          section.key === "cursos_online" ? "COURSE" : section.key === "libreria_21dias" ? "IMAGE" : "YOUTUBE";
        return (
          <details key={section.key} className="rounded-xl border border-[#9CBA9D]/50 bg-white p-5 shadow-sm">
            <summary className="text-sm font-semibold uppercase tracking-wide text-[#0D3B36] cursor-pointer select-none">
              {section.label}{" "}
              <span className="ml-1 text-xs font-normal normal-case text-[#1A1A1A]/50">
                ({items.length} {items.length === 1 ? "elemento" : "elementos"})
              </span>
            </summary>

            <div className="mt-4 space-y-4">
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
                      Descripción {section.key === "cursos_online" ? "" : "(opcional, solo para tipo Enlace)"}
                    </label>
                    <textarea
                      id={`description-${item.id}`}
                      name="description"
                      rows={section.key === "cursos_online" ? 3 : 1}
                      defaultValue={item.description ?? ""}
                      className={inputClass}
                    />
                  </div>
                  {section.key === "cursos_online" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass} htmlFor={`imageUrl-${item.id}`}>
                          Imagen (URL)
                        </label>
                        <input
                          id={`imageUrl-${item.id}`}
                          name="imageUrl"
                          placeholder="https://..."
                          defaultValue={item.imageUrl ?? ""}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor={`price-${item.id}`}>
                          Precio (MXN)
                        </label>
                        <input
                          id={`price-${item.id}`}
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="990"
                          defaultValue={item.priceCents != null ? (item.priceCents / 100).toString() : ""}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}
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
                  <button type="submit" className={adminDangerLinkClass}>
                    Borrar &quot;{item.title}&quot;
                  </button>
                </form>
              </div>
            ))}

            <details className={sectionClass}>
              <summary className="text-sm font-semibold cursor-pointer text-[#0D3B36]">+ Agregar a {section.label}</summary>
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
                    Descripción {section.key === "cursos_online" ? "" : "(opcional, solo para tipo Enlace)"}
                  </label>
                  <textarea
                    id={`new-description-${section.key}`}
                    name="description"
                    rows={section.key === "cursos_online" ? 3 : 1}
                    className={inputClass}
                  />
                </div>
                {section.key === "cursos_online" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} htmlFor={`new-imageUrl-${section.key}`}>
                        Imagen (URL)
                      </label>
                      <input
                        id={`new-imageUrl-${section.key}`}
                        name="imageUrl"
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor={`new-price-${section.key}`}>
                        Precio (MXN)
                      </label>
                      <input
                        id={`new-price-${section.key}`}
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="990"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
                <button type="submit" className={secondaryButtonClass}>
                  Agregar
                </button>
              </form>
            </details>
            </div>
          </details>
        );
      })}
    </div>
  );
}
