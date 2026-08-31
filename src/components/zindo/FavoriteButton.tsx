"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleFavoriteAction } from "@/app/favoritos/actions";
import { zindoColors } from "@/components/zindo/theme";

export function FavoriteButton({
  productId,
  initialFavorited,
  canFavorite,
  path,
  size = "sm",
  className,
}: {
  productId: string;
  initialFavorited: boolean;
  canFavorite: boolean;
  path: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();
  const iconSize = size === "lg" ? "h-6 w-6" : "h-4 w-4";

  const heart = (
    <svg
      viewBox="0 0 24 24"
      fill={favorited ? zindoColors.gold : "none"}
      stroke={zindoColors.gold}
      strokeWidth={1.75}
      strokeLinejoin="round"
      className={iconSize}
    >
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1 4 2.5C10.5 6 12 5 14 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z" />
    </svg>
  );

  if (!canFavorite) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(path)}`}
        aria-label="Iniciar sesión para guardar en favoritos"
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        {heart}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorited((f) => !f);
        startTransition(async () => {
          await toggleFavoriteAction(productId, path);
        });
      }}
      className={className}
    >
      {heart}
    </button>
  );
}
