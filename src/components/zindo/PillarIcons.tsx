import { zindoColors } from "@/components/zindo/theme";

const iconProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: zindoColors.gold,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function EvolucionIcon() {
  return (
    <svg {...iconProps}>
      <g transform="translate(32,50)">
        <path id="pillarPetal" d="M0,0 C -9,-7 -10,-24 0,-33 C 10,-24 9,-7 0,0 Z" />
        <use href="#pillarPetal" transform="rotate(35)" />
        <use href="#pillarPetal" transform="rotate(-35)" />
        <use href="#pillarPetal" transform="rotate(64)" />
        <use href="#pillarPetal" transform="rotate(-64)" />
      </g>
      <path d="M14,52 C20,56 44,56 50,52" />
    </svg>
  );
}

export function TiendaIcon() {
  return (
    <svg {...iconProps}>
      <path d="M23,25 C23,15.5 27,10 32,10 C37,10 41,15.5 41,25" />
      <path d="M16,25 L48,25 L44.5,55 C44.2,58 41.8,60 38.5,60 L25.5,60 C22.2,60 19.8,58 19.5,55 Z" />
      <g transform="translate(32,41) rotate(38)">
        <path d="M0,-9 C4.5,-5 4.5,5 0,9 C-4.5,5 -4.5,-5 0,-9 Z" />
        <path d="M0,-6.5 L0,6.5" />
      </g>
    </svg>
  );
}

export function LibreriaIcon() {
  return (
    <svg {...iconProps}>
      <path d="M32,20 C28,16.5 22,14.5 15,14.5 C12,14.5 10,15 10,17.5 L10,44 C10,46.5 12,47 15,47 C22,47 28,48.5 32,52" />
      <path d="M32,20 C36,16.5 42,14.5 49,14.5 C52,14.5 54,15 54,17.5 L54,44 C54,46.5 52,47 49,47 C42,47 36,48.5 32,52" />
      <path d="M32,20 L32,52" />
    </svg>
  );
}

export function ContactoIcon() {
  return (
    <svg {...iconProps}>
      <rect x="9" y="17" width="46" height="32" rx="4" />
      <path d="M9,20 L32,38 L55,20" />
    </svg>
  );
}
