import Image from "next/image";
import { zindoColors } from "@/components/zindo/theme";

export default function Loading() {
  return (
    <div>
      <section className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        <Image src="/zindo/marble.jpg" alt="" fill className="object-cover" />
        <div className="relative z-10 animate-pulse space-y-3">
          <div className="mx-auto h-7 w-56 rounded" style={{ backgroundColor: `${zindoColors.green}33` }} />
          <div className="mx-auto h-4 w-72 rounded" style={{ backgroundColor: `${zindoColors.ink}22` }} />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="h-9 w-24 rounded-full border animate-pulse" style={{ borderColor: zindoColors.sage }} />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <li
              key={i}
              className="h-32 rounded-lg border bg-white/50 animate-pulse"
              style={{ borderColor: zindoColors.sage }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
