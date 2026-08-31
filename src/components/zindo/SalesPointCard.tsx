import { zindoColors } from "@/components/zindo/theme";

export function ZindoSalesPointCard({
  name,
  description,
  address,
  contactInfo,
  website,
}: {
  name: string;
  description: string;
  address?: string | null;
  contactInfo?: string | null;
  website?: string | null;
}) {
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
    </div>
  );
}
