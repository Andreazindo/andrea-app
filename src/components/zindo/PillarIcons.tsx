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
      <path d="M24,46 C15,46 10,38 12,30 C7,26 9,17 18,16 C19,10 27,7 32,11 C37,7 45,10 46,16 C55,17 57,26 52,30 C54,38 49,46 40,46 C38,50 34,52 32,49 C30,52 26,50 24,46 Z" />
      <path d="M32,13 L32,47" />
      <path d="M20,22 C25,23 25,30 20,32" />
      <path d="M44,22 C39,23 39,30 44,32" />
      <path d="M23,36 C27,34 29,37 27,41" />
      <path d="M41,36 C37,34 35,37 37,41" />
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
