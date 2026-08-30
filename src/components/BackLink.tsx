import Link from "next/link";
import { zindoColors } from "@/components/zindo/theme";

export function ZindoBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:border-[#C9A15B]"
      style={{ borderColor: zindoColors.sage, color: zindoColors.green, fontFamily: "var(--font-zindo-body)" }}
    >
      <span aria-hidden>←</span> {label}
    </Link>
  );
}

export function PlainBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-md border border-black/20 dark:border-white/25 px-3 py-1.5 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
    >
      <span aria-hidden>←</span> {label}
    </Link>
  );
}
