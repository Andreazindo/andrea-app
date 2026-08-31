"use client";

import { useEffect, useState, useTransition } from "react";
import { toggleProductLikeAction } from "@/app/tienda/like-actions";
import { zindoColors } from "@/components/zindo/theme";

export function LikeButton({
  productId,
  initialCount,
  path,
  size = "sm",
  className,
}: {
  productId: string;
  initialCount: number;
  path: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  const storageKey = `zindo:liked:${productId}`;
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(storageKey) === "1");
    } catch {
      // localStorage no disponible (modo privado, etc.) — se queda sin marcar.
    }
  }, [storageKey]);

  const iconSize = size === "lg" ? "h-6 w-6" : "h-4 w-4";

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const next = !liked;
    setLiked(next);
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
    try {
      if (next) localStorage.setItem(storageKey, "1");
      else localStorage.removeItem(storageKey);
    } catch {
      // ignorar si no hay acceso a localStorage
    }
    startTransition(async () => {
      await toggleProductLikeAction(productId, next, path);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={liked ? "Quitar me gusta" : "Me gusta"}
      aria-pressed={liked}
      className={className}
    >
      <svg
        viewBox="0 0 24 24"
        fill={liked ? zindoColors.gold : "none"}
        stroke={zindoColors.gold}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconSize}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count > 0 && (
        <span className="text-xs font-medium" style={{ color: zindoColors.ink }}>
          {count}
        </span>
      )}
    </button>
  );
}
