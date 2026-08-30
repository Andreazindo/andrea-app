import Link from "next/link";
import { zindoColors } from "@/components/zindo/theme";

export function ZindoBrandCard({
  href,
  name,
  description,
  comingSoon,
}: {
  href?: string;
  name: string;
  description?: string | null;
  comingSoon?: boolean;
}) {
  const className = "block h-full rounded-lg bg-white/70 border p-6 transition-colors hover:border-[#C9A15B]";
  const style = { borderColor: zindoColors.sage, fontFamily: "var(--font-zindo-body)" };

  const content = (
    <>
      <div className="flex items-center gap-2 flex-wrap">
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
      {!comingSoon && href && (
        <span className="mt-4 inline-block text-sm font-medium" style={{ color: zindoColors.gold }}>
          Ver →
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
