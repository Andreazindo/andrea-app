"use client";

import { useState } from "react";
import { zindoColors } from "@/components/zindo/theme";

export function GratitudeGallery({ images }: { images: { url: string; alt: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={img.url}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Ver ${img.alt}`}
            className="aspect-square overflow-hidden rounded-lg border transition-opacity hover:opacity-90"
            style={{ borderColor: zindoColors.sage }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Cerrar"
            className="absolute top-4 right-4 text-white text-2xl leading-none"
          >
            ×
          </button>
          {openIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i !== null && i > 0 ? i - 1 : i));
              }}
              aria-label="Anterior"
              className="absolute left-2 sm:left-6 text-white text-3xl leading-none px-2 py-4"
            >
              ‹
            </button>
          )}
          {openIndex < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i));
              }}
              aria-label="Siguiente"
              className="absolute right-2 sm:right-6 text-white text-3xl leading-none px-2 py-4"
            >
              ›
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[openIndex].url}
            alt={images[openIndex].alt}
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
