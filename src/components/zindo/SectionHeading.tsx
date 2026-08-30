import { zindoColors } from "@/components/zindo/theme";

export function ZindoSectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-6">
      <h2
        className="text-xl sm:text-2xl uppercase tracking-[0.15em]"
        style={{ fontFamily: "var(--font-zindo-heading)", color: zindoColors.green }}
      >
        {children}
      </h2>
      <span className="mt-3 inline-block h-px w-12" style={{ backgroundColor: zindoColors.gold }} />
    </div>
  );
}
