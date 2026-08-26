"use client";

import { useState } from "react";
import Link from "next/link";
import { zindoColors } from "@/components/zindo/theme";

export function ProductCard({
  href,
  name,
  description,
  priceLabel,
  images,
}: {
  href: string;
  name: string;
  description?: string | null;
  priceLabel: string;
  images: { id: string; url: string }[];
}) {
  const [index, setIndex] = useState(0);
  const hasImages = images.length > 0;
  const showControls = images.length > 1;

  function go(delta: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + delta + images.length) % images.length);
  }

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-lg bg-white/70 border transition-colors hover:border-[#C9A15B]"
      style={{ borderColor: zindoColors.sage }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ backgroundColor: zindoColors.ivory }}>
        {hasImages ? (
          <img
            src={images[index].url}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/zindo/monograma.png" alt="" className="w-16 opacity-40" />
          </div>
        )}

        {showControls && (
          <>
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={(e) => go(-1, e)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: zindoColors.ink }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={(e) => go(1, e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: zindoColors.ink }}
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((img, i) => (
                <span
                  key={img.id}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: i === index ? zindoColors.green : "#ffffffaa" }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5" style={{ fontFamily: "var(--font-zindo-body)" }}>
        <h3 className="font-semibold line-clamp-2" style={{ color: zindoColors.ink }}>
          {name}
        </h3>
        {description && (
          <p className="mt-1.5 text-sm line-clamp-2 flex-1" style={{ color: zindoColors.ink, opacity: 0.65 }}>
            {description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: zindoColors.green }}>
            {priceLabel}
          </span>
          <span className="text-sm font-medium" style={{ color: zindoColors.gold }}>
            Ver →
          </span>
        </div>
      </div>
    </Link>
  );
}
