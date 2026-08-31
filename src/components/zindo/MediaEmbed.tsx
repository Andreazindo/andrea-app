import { zindoColors } from "@/components/zindo/theme";

export function ZindoVideoEmbed({
  title,
  youtubeId,
  driveId,
}: {
  title: string;
  youtubeId?: string;
  driveId?: string;
}) {
  const src = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}`
    : `https://drive.google.com/file/d/${driveId}/preview`;

  return (
    <div className="text-left">
      <div className="mb-3 border-l-[3px] pl-3.5" style={{ borderColor: zindoColors.gold }}>
        <p
          className="text-base leading-snug"
          style={{ color: zindoColors.green, fontFamily: "var(--font-zindo-heading)", fontWeight: 500 }}
        >
          {title}
        </p>
      </div>
      <div className="relative aspect-video overflow-hidden rounded-lg border" style={{ borderColor: zindoColors.sage }}>
        <iframe
          src={src}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}

export function ZindoLinkCard({ title, description, href }: { title: string; description?: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-left rounded-lg border p-4 hover:border-[#C9A15B] transition-colors"
      style={{ borderColor: zindoColors.sage }}
    >
      <p className="text-sm font-medium" style={{ color: zindoColors.ink }}>
        {title}
      </p>
      {description && (
        <p className="mt-1 text-xs" style={{ color: zindoColors.ink, opacity: 0.65 }}>
          {description}
        </p>
      )}
      <span className="mt-2 inline-block text-sm font-medium" style={{ color: zindoColors.gold }}>
        Abrir →
      </span>
    </a>
  );
}
