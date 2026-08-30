import Image from "next/image";
import { zindoColors } from "@/components/zindo/theme";

export default function Loading() {
  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
        <div className="relative z-10 animate-pulse space-y-3">
          <div className="mx-auto h-9 w-24 rounded-full border" style={{ borderColor: zindoColors.sage }} />
          <div className="mx-auto h-7 w-48 rounded" style={{ backgroundColor: `${zindoColors.green}33` }} />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-16">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="overflow-hidden rounded-lg border bg-white/50 animate-pulse" style={{ borderColor: zindoColors.sage }}>
              <div className="aspect-[4/5] w-full" style={{ backgroundColor: `${zindoColors.ink}11` }} />
              <div className="p-5 space-y-2">
                <div className="h-4 w-3/4 rounded" style={{ backgroundColor: `${zindoColors.ink}22` }} />
                <div className="h-3 w-1/2 rounded" style={{ backgroundColor: `${zindoColors.ink}15` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
