import { zindoColors } from "@/components/zindo/theme";

export function ZindoMarbleFade() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-32"
      style={{ background: `linear-gradient(to bottom, transparent, ${zindoColors.ivory})` }}
    />
  );
}
