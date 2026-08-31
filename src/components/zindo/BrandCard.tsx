import Link from "next/link";
import { zindoColors } from "@/components/zindo/theme";

export function ZindoBrandCard({
  href,
  name,
  description,
  comingSoon,
  icon,
  ctaLabel = "Ver →",
}: {
  href?: string;
  name: string;
  description?: string | null;
  comingSoon?: boolean;
  icon?: React.ReactNode;
  ctaLabel?: string | null;
}) {
  const isInteractive = !comingSoon && Boolean(href);
  const className = `zindo-fade-in block h-full rounded-lg bg-white/70 border p-6 transition-all duration-300 ease-out${
    isInteractive ? " hover:border-[#C9A15B] hover:shadow-lg hover:-translate-y-0.5" : ""
  }${icon ? " text-center" : ""}`;
  const style = { borderColor: zindoColors.sage, fontFamily: "var(--font-zindo-body)" };

  const content = (
    <>
      {icon && (
        <div
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white"
          style={{ borderColor: zindoColors.sage, borderWidth: 1 }}
        >
          <div className="h-11 w-11">{icon}</div>
        </div>
      )}
      <div className={`flex items-center gap-2 flex-wrap${icon ? " justify-center" : ""}`}>
        <h2
          className="text-lg uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
        >
          {name}
        </h2>
        {comingSoon && (
          <span
            className="text-[10px] uppercase tracking-[0.1em] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: zindoColors.sage, color: "#ffffff" }}
          >
            Próximamente
          </span>
        )}
      </div>
      {description && (
        <p className="mt-2 text-sm" style={{ color: zindoColors.ink, opacity: 0.75 }}>
          {description}
        </p>
      )}
      {!comingSoon && href && ctaLabel && (
        <span className="mt-4 inline-block text-sm font-medium" style={{ color: zindoColors.gold }}>
          {ctaLabel}
        </span>
      )}
    </>
  );

  if (comingSoon || !href) {
    return (
      <div className={className} style={style}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      {content}
    </Link>
  );
}
