import { zindoColors } from "@/components/zindo/theme";

export type SalesPointInfo = {
  name: string;
  description: string;
  address?: string | null;
  contactInfo?: string | null;
  website?: string | null;
};

export function salesPointToText(punto: SalesPointInfo): string {
  const lines = [punto.name, punto.description];
  if (punto.address) lines.push(`Dirección: ${punto.address}`);
  if (punto.address) {
    lines.push(`Maps: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(punto.address)}`);
  }
  if (punto.contactInfo) lines.push(`Contacto: ${punto.contactInfo}`);
  if (punto.website) lines.push(`Web: ${punto.website}`);
  return lines.join("\n");
}

function DownloadLink({ text, fileName }: { text: string; fileName: string }) {
  return (
    <a
      href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`}
      download={fileName}
      className="text-sm hover:underline"
      style={{ color: zindoColors.ink, opacity: 0.6 }}
    >
      Descargar información ⬇
    </a>
  );
}

export function ZindoSalesPointCard(punto: SalesPointInfo) {
  const { name, description, address, contactInfo, website } = punto;
  const mapsHref = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null;
  const telHref = contactInfo ? `tel:${contactInfo.replace(/[^\d+]/g, "")}` : null;
  const websiteHref = website ? (website.startsWith("http") ? website : `https://${website}`) : null;

  return (
    <div
      className="zindo-fade-in h-full rounded-lg bg-white/70 border p-6"
      style={{ borderColor: zindoColors.sage, fontFamily: "var(--font-zindo-body)" }}
    >
      <h3
        className="text-lg uppercase tracking-[0.1em]"
        style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
      >
        {name}
      </h3>
      <p className="mt-2 text-sm" style={{ color: zindoColors.ink, opacity: 0.75 }}>
        {description}
      </p>

      {(mapsHref || telHref || websiteHref) && (
        <div className="mt-4 flex flex-col gap-1.5">
          {mapsHref && (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline"
              style={{ color: zindoColors.gold }}
            >
              Ver ubicación en Maps →
            </a>
          )}
          {telHref && (
            <a href={telHref} className="text-sm hover:underline" style={{ color: zindoColors.ink, opacity: 0.85 }}>
              {contactInfo}
            </a>
          )}
          {websiteHref && (
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
              style={{ color: zindoColors.ink, opacity: 0.85 }}
            >
              {website}
            </a>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t" style={{ borderColor: zindoColors.sage }}>
        <DownloadLink text={salesPointToText(punto)} fileName={`${name.replace(/[^a-z0-9]+/gi, "-")}.txt`} />
      </div>
    </div>
  );
}
