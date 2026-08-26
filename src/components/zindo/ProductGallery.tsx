"use client";

import { useState } from "react";
import { zindoColors } from "@/components/zindo/theme";

export function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: { id: string; url: string }[];
}) {
  const [index, setIndex] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div>
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border"
        style={{ backgroundColor: zindoColors.ivory, borderColor: zindoColors.sage }}
      >
        {hasImages ? (
          <img src={images[index].url} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/zindo/monograma.png" alt="" className="w-24 opacity-40" />
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className="h-16 w-16 flex-none overflow-hidden rounded-md border transition-opacity"
              style={{
                borderColor: i === index ? zindoColors.gold : zindoColors.sage,
                opacity: i === index ? 1 : 0.7,
              }}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
