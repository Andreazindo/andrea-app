import { zindoColors } from "@/components/zindo/theme";

const iconProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: zindoColors.gold,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="9" y="17" width="46" height="32" rx="4" />
      <path d="M9,20 L32,38 L55,20" />
    </svg>
  );
}

export function WhatsappIcon() {
  return (
    <svg {...iconProps}>
      <path d="M32,10 C19.85,10 10,19.85 10,32 C10,36.02 11.08,39.79 12.97,43.03 L10.2,54 L21.42,51.35 C24.55,53.06 28.15,54 32,54 C44.15,54 54,44.15 54,32 C54,19.85 44.15,10 32,10 Z" />
      <path
        d="M23.5,22.7 C24,21.5 24.6,21.5 25.2,21.5 C25.7,21.5 26,21.5 26.3,22.2 C26.6,23 27.4,25 27.5,25.2 C27.6,25.4 27.6,25.7 27.4,26 C27.1,26.4 26.9,26.6 26.6,26.9 C26.3,27.2 26,27.6 26.3,28.2 C26.6,28.8 27.7,30.6 29.3,32 C31.3,33.7 32.9,34.3 33.4,34.6 C33.9,34.9 34.3,34.8 34.6,34.4 C34.9,34 35.9,32.9 36.2,32.4 C36.6,31.9 36.9,32 37.4,32.2 C37.9,32.4 40.5,33.7 41,34 C41.5,34.3 41.9,34.4 42,34.8 C42.1,35.1 42.1,36.3 41.6,37.5 C41.1,38.6 39.2,39.7 38,39.8 C36.9,40 36.3,40.2 32.7,38.7 C28.3,36.9 25.3,33.2 25,32.8 C24.8,32.5 22.7,29.7 22.7,26.9 C22.7,24.8 23.6,23.7 23.5,22.7 Z"
        fill={zindoColors.gold}
        stroke="none"
      />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg {...iconProps}>
      <rect x="11" y="11" width="42" height="42" rx="12" />
      <circle cx="32" cy="32" r="10.5" />
      <circle cx="43.5" cy="20.5" r="1.5" fill={zindoColors.gold} stroke="none" />
    </svg>
  );
}

export function TiktokIcon() {
  return (
    <svg {...iconProps}>
      <path d="M35,10 C35,17 40,21.5 46,22 L46,29 C41.5,29 37.8,27.5 35,25 L35,42 C35,49 29.5,54 23.5,54 C17.5,54 12,49 12,42 C12,35 17.5,30 23.5,30 C24.5,30 25.5,30.1 26.4,30.4 L26.4,37.6 C25.5,37.2 24.5,37 23.5,37 C21,37 19,39 19,42 C19,45 21,47 23.5,47 C26,47 28,45 28,42 L28,10 Z" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="32" cy="32" r="22" />
      <path
        d="M38,20 C33.5,20 30,23.2 30,27.8 L30,32 L26,32 L26,38 L30,38 L30,48 L36,48 L36,38 L40.2,38 L41,32 L36,32 L36,28.3 C36,26.6 36.6,25.5 38.8,25.5 L41,25.5 L41,20.2 C40.6,20.1 39.3,20 38,20 Z"
        fill={zindoColors.gold}
        stroke="none"
      />
    </svg>
  );
}

export function YoutubeIcon() {
  return (
    <svg {...iconProps}>
      <rect x="8" y="18" width="48" height="28" rx="8" />
      <path d="M27,26 L40,32 L27,38 Z" fill={zindoColors.gold} stroke="none" />
    </svg>
  );
}

export function GenericLinkIcon() {
  return (
    <svg {...iconProps}>
      <path d="M27,37 L37,27" />
      <path d="M31,20 L34,20 C39.5,20 44,24.5 44,30 C44,35.5 39.5,40 34,40 L31,40" />
      <path d="M33,44 L30,44 C24.5,44 20,39.5 20,34 C20,28.5 24.5,24 30,24 L33,24" />
    </svg>
  );
}

export function iconForPlatform(name: string) {
  const key = name.trim().toLowerCase();
  if (key.includes("instagram")) return <InstagramIcon />;
  if (key.includes("tiktok")) return <TiktokIcon />;
  if (key.includes("facebook")) return <FacebookIcon />;
  if (key.includes("youtube")) return <YoutubeIcon />;
  return <GenericLinkIcon />;
}
