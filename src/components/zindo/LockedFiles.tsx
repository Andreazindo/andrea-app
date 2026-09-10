import Link from "next/link";
import { zindoColors } from "@/components/zindo/theme";

export function ZindoLockedFiles({
  files,
  unlocked,
  loggedIn,
  requiredProductName,
  buyHref,
}: {
  files: { id: string; label: string; url: string }[];
  unlocked: boolean;
  loggedIn: boolean;
  requiredProductName: string;
  buyHref?: string;
}) {
  if (files.length === 0) return null;

  return (
    <details className="mt-6 rounded-lg bg-white/70 border p-4" style={{ borderColor: zindoColors.sage }}>
      <summary
        className="text-sm font-semibold cursor-pointer select-none"
        style={{ color: zindoColors.green, fontFamily: "var(--font-zindo-body)" }}
      >
        Ver más
      </summary>
      <div className="mt-3" style={{ fontFamily: "var(--font-zindo-body)" }}>
        {unlocked ? (
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.id}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline"
                  style={{ color: zindoColors.gold }}
                >
                  {file.label} ↗
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm" style={{ color: zindoColors.ink, opacity: 0.75 }}>
            <p>
              Este contenido es exclusivo para quienes ya compraron <strong>{requiredProductName}</strong>.
            </p>
            {!loggedIn ? (
              <p className="mt-2">
                <Link href="/login" className="underline" style={{ color: zindoColors.gold }}>
                  Inicia sesión
                </Link>{" "}
                con la cuenta con la que compraste para verlo.
              </p>
            ) : buyHref ? (
              <p className="mt-2">
                <Link href={buyHref} className="underline" style={{ color: zindoColors.gold }}>
                  Ver {requiredProductName} en la tienda
                </Link>
              </p>
            ) : null}
          </div>
        )}
      </div>
    </details>
  );
}
