import Image from "next/image";
import { zindoColors } from "@/components/zindo/theme";
import { ZindoBackLink } from "@/components/BackLink";
import { ZindoMarbleFade } from "@/components/zindo/MarbleFade";

export function ZindoContentPage({
  title,
  subtitle,
  backHref,
  backLabel,
  children,
}: {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
        <ZindoMarbleFade />
        <div className="relative z-10">
          <h1
            className="text-2xl sm:text-3xl uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-3 max-w-lg mx-auto text-sm sm:text-base"
              style={{ fontFamily: "var(--font-zindo-body)", color: zindoColors.ink }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 pt-6">
        <ZindoBackLink href={backHref} label={backLabel} />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 space-y-8" style={{ fontFamily: "var(--font-zindo-body)" }}>
        {children}
      </div>
    </div>
  );
}
