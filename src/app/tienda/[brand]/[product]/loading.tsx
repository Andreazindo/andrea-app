import { zindoColors, zindoFontVars } from "@/components/zindo/theme";

export default function Loading() {
  return (
    <div className={zindoFontVars} style={{ backgroundColor: zindoColors.ivory, minHeight: "100%" }}>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-6 h-9 w-40 rounded-full border animate-pulse" style={{ borderColor: zindoColors.sage }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div
            className="aspect-[4/5] w-full rounded-lg border md:max-w-md"
            style={{ borderColor: zindoColors.sage, backgroundColor: `${zindoColors.ink}11` }}
          />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded" style={{ backgroundColor: `${zindoColors.green}33` }} />
            <div className="h-4 w-full rounded" style={{ backgroundColor: `${zindoColors.ink}15` }} />
            <div className="h-4 w-5/6 rounded" style={{ backgroundColor: `${zindoColors.ink}15` }} />
            <div
              className="h-20 w-full rounded-lg border mt-8"
              style={{ borderColor: zindoColors.sage, backgroundColor: "#ffffff80" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
