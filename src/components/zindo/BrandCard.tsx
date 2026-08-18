import Link from "next/link";
import { zindoColors } from "@/components/zindo/theme";

export function ZindoBrandCard({
  href,
  name,
  description,
}: {
  href: string;
  name: string;
  description?: string | null;
}) {
  return (
    <Link
      href={href}
      className="block h-full rounded-lg bg-white/70 border p-6 transition-colors hover:border-[#C9A15B]"
      style={{ borderColor: zindoColors.sage, fontFamily: "var(--font-zindo-body)" }}
    >
      <h2
        className="text-lg uppercase tracking-[0.1em]"
        style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
      >
        {name}
      </h2>
      {description && (
        <p className="mt-2 text-sm" style={{ color: zindoColors.ink, opacity: 0.75 }}>
          {description}
        </p>
      )}
      <span className="mt-4 inline-block text-sm font-medium" style={{ color: zindoColors.gold }}>
        Ver catálogo →
      </span>
    </Link>
  );
}
