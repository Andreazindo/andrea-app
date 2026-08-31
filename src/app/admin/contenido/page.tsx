import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSiteContent, EDITABLE_CONTENT_KEYS } from "@/lib/site-content";
import { PlainBackLink } from "@/components/BackLink";
import {
  AdminPageHeader,
  AdminFlash,
  adminCardClass as sectionClass,
  adminInputClass as inputClass,
  adminLabelClass as labelClass,
  adminButtonPrimaryClass as primaryButtonClass,
  adminButtonSecondaryClass as secondaryButtonClass,
  adminDangerLinkClass,
} from "@/components/admin/ui";
import {
  updateSiteContentAction,
  addSalesPointAction,
  updateSalesPointAction,
  deleteSalesPointAction,
} from "./actions";

export const metadata: Metadata = { title: "Contenido (Admin)" };

const ERROR_MESSAGES: Record<string, string> = {
  "punto-invalido": "Nombre y descripción son obligatorios.",
};

export default async function ContenidoAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; guardado?: string }>;
}) {
  await requireAdmin("/admin/contenido");
  const { error, guardado } = await searchParams;

  const [content, salesPoints] = await Promise.all([
    getSiteContent(EDITABLE_CONTENT_KEYS),
    prisma.salesPoint.findMany({ orderBy: { position: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      <div>
        <PlainBackLink href="/" label="Inicio" />
        <div className="mt-3">
          <AdminPageHeader title="Contenido del sitio" subtitle="Textos de las páginas principales, sin tocar código." />
        </div>
      </div>

      <AdminFlash guardado={guardado} error={error} errorMessages={ERROR_MESSAGES} />

      <form action={updateSiteContentAction} className="space-y-8">
        <section className={sectionClass}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0D3B36]">Inicio</h2>
          <div>
            <label className={labelClass} htmlFor="home_tagline">
              Frase del hero
            </label>
            <input id="home_tagline" name="home_tagline" defaultValue={content.home_tagline} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="home_description">
              Descripción
            </label>
            <textarea
              id="home_description"
              name="home_description"
              rows={2}
              defaultValue={content.home_description}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="home_cta_label">
              Texto del botón
            </label>
            <input id="home_cta_label" name="home_cta_label" defaultValue={content.home_cta_label} className={inputClass} />
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0D3B36]">Tienda Wellness</h2>
          <div>
            <label className={labelClass} htmlFor="tienda_tagline">
              Frase debajo del título
            </label>
            <input id="tienda_tagline" name="tienda_tagline" defaultValue={content.tienda_tagline} className={inputClass} />
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0D3B36]">Evolución Personal</h2>
          <div>
            <label className={labelClass} htmlFor="evolucion_tagline">
              Frase debajo del título
            </label>
            <input
              id="evolucion_tagline"
              name="evolucion_tagline"
              defaultValue={content.evolucion_tagline}
              className={inputClass}
            />
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0D3B36]">Librería Gratuita</h2>
          <div>
            <label className={labelClass} htmlFor="libreria_tagline">
              Frase debajo del título
            </label>
            <input
              id="libreria_tagline"
              name="libreria_tagline"
              defaultValue={content.libreria_tagline}
              className={inputClass}
            />
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0D3B36]">Contacto</h2>
          <div>
            <label className={labelClass} htmlFor="contacto_tagline">
              Frase debajo del título
            </label>
            <input
              id="contacto_tagline"
              name="contacto_tagline"
              defaultValue={content.contacto_tagline}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="contacto_mail">
              Correo de contacto
            </label>
            <input
              id="contacto_mail"
              name="contacto_mail"
              type="email"
              placeholder="hola@zindo.com"
              defaultValue={content.contacto_mail}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="contacto_whatsapp">
              WhatsApp (número con código de país, ej. 5219981234567)
            </label>
            <input
              id="contacto_whatsapp"
              name="contacto_whatsapp"
              defaultValue={content.contacto_whatsapp}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="contacto_redes">
              Redes sociales (una por línea, formato &quot;Nombre: enlace&quot;)
            </label>
            <textarea
              id="contacto_redes"
              name="contacto_redes"
              rows={4}
              placeholder={"Instagram: https://instagram.com/zindo\nTikTok: https://tiktok.com/@zindo"}
              defaultValue={content.contacto_redes}
              className={inputClass}
            />
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0D3B36]">Legal</h2>
          <p className="text-xs text-black/50 dark:text-white/50">
            Formato Markdown simple: ## para subtítulos, **negrita**, listas con &quot;- &quot; o &quot;1. &quot;.
          </p>
          <div>
            <label className={labelClass} htmlFor="legal_terminos">
              Términos y Condiciones
            </label>
            <textarea
              id="legal_terminos"
              name="legal_terminos"
              rows={10}
              defaultValue={content.legal_terminos}
              className={`${inputClass} font-mono text-xs`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="legal_privacidad">
              Aviso de Privacidad
            </label>
            <textarea
              id="legal_privacidad"
              name="legal_privacidad"
              rows={10}
              defaultValue={content.legal_privacidad}
              className={`${inputClass} font-mono text-xs`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="legal_devoluciones">
              Política de Devoluciones
            </label>
            <textarea
              id="legal_devoluciones"
              name="legal_devoluciones"
              rows={10}
              defaultValue={content.legal_devoluciones}
              className={`${inputClass} font-mono text-xs`}
            />
          </div>
        </section>

        <button type="submit" className={primaryButtonClass}>
          Guardar contenido
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0D3B36]">Puntos de Venta</h2>

        {salesPoints.map((point) => (
          <div key={point.id} className={sectionClass}>
            <form action={updateSalesPointAction} className="space-y-4">
              <input type="hidden" name="id" value={point.id} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor={`name-${point.id}`}>
                    Nombre
                  </label>
                  <input id={`name-${point.id}`} name="name" defaultValue={point.name} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`description-${point.id}`}>
                    Descripción
                  </label>
                  <input
                    id={`description-${point.id}`}
                    name="description"
                    defaultValue={point.description}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor={`address-${point.id}`}>
                  Dirección (se convierte en enlace a Google Maps)
                </label>
                <input
                  id={`address-${point.id}`}
                  name="address"
                  defaultValue={point.address ?? ""}
                  placeholder="Calle, número, colonia, ciudad"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor={`contactInfo-${point.id}`}>
                    Contacto (teléfono/WhatsApp)
                  </label>
                  <input
                    id={`contactInfo-${point.id}`}
                    name="contactInfo"
                    defaultValue={point.contactInfo ?? ""}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`website-${point.id}`}>
                    Página web
                  </label>
                  <input
                    id={`website-${point.id}`}
                    name="website"
                    defaultValue={point.website ?? ""}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="active" defaultChecked={point.active} />
                  Visible en el sitio
                </label>
                <button type="submit" className={secondaryButtonClass}>
                  Guardar
                </button>
              </div>
            </form>
            <form action={deleteSalesPointAction} className="flex justify-end">
              <input type="hidden" name="id" value={point.id} />
              <button type="submit" className={adminDangerLinkClass}>
                Borrar &quot;{point.name}&quot;
              </button>
            </form>
          </div>
        ))}

        <details className={sectionClass}>
          <summary className="text-sm font-semibold cursor-pointer text-[#0D3B36]">+ Agregar punto de venta</summary>
          <form action={addSalesPointAction} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="new-point-name">
                  Nombre
                </label>
                <input id="new-point-name" name="name" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="new-point-description">
                  Descripción (ciudad, dirección)
                </label>
                <input id="new-point-description" name="description" required className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="new-point-address">
                Dirección (se convierte en enlace a Google Maps)
              </label>
              <input
                id="new-point-address"
                name="address"
                placeholder="Calle, número, colonia, ciudad"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="new-point-contact">
                  Contacto (teléfono/WhatsApp)
                </label>
                <input id="new-point-contact" name="contactInfo" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="new-point-website">
                  Página web
                </label>
                <input id="new-point-website" name="website" placeholder="https://..." className={inputClass} />
              </div>
            </div>
            <button type="submit" className={secondaryButtonClass}>
              Agregar
            </button>
          </form>
        </details>
      </section>
    </div>
  );
}
