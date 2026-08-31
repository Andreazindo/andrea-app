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
      <path d="M46,18.5 C41.8,14.3 36.1,12 30,12 C18,12 8.3,21.7 8.3,33.7 C8.3,37.6 9.3,41.3 11.2,44.6 L8,56 L19.7,52.9 C22.9,54.6 26.4,55.5 30,55.5 C42,55.5 51.7,45.8 51.7,33.8 C51.7,27.7 49.3,22 46,18.5 Z" />
      <path d="M23,26 C23,25 24,23.5 25,23.5 C26,23.5 27,23.5 27.5,24.5 C28,25.5 29,28 29,28.5 C29,29 28.8,29.5 28.3,30 C27.8,30.5 27.3,31 27.8,32 C28.3,33 29.8,35 31.8,36.5 C33.8,38 35.3,38.5 36.3,39 C37,39.3 37.5,39.2 38,38.7 C38.5,38.2 39.5,37 40,36.5 C40.5,36 41,36 41.8,36.3 C42.5,36.5 45,37.8 45.8,38.3 C46.5,38.8 47,39 47.2,39.5 C47.3,40 47.3,41.5 46.7,43 C46,44.5 43.3,46 41.8,46.2 C40.3,46.5 39.5,46.7 36.5,45.5 C32.8,44 27.8,40.8 24.5,36 C22,32.5 21,29.7 21,27.5" />
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
      <path d="M37,20 L33,20 C29.7,20 28,21.7 28,25 L28,29 L37,29 L35.5,36 L28,36 L28,52" />
      <path d="M28,29 L23,29" />
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
