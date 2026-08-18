const ZINDO_HEADING_FONT = "var(--font-zindo-heading), sans-serif";

export function ZindoLogo({
  color = "currentColor",
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 420 190"
      className={className}
      role="img"
      aria-label="Zindo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle with a small break on the left, per brand manual */}
      <path
        d="M 210 20 A 72 72 0 1 1 138 92"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <line x1="126" y1="92" x2="150" y2="92" stroke={color} strokeWidth="1.5" />

      {/* Three ascending dots */}
      <circle cx="210" cy="40" r="3" fill={color} />
      <circle cx="210" cy="55" r="5.5" fill={color} />
      <circle cx="210" cy="75" r="8.5" fill={color} />

      {/* Wordmark */}
      <text
        x="210"
        y="145"
        textAnchor="middle"
        fill={color}
        fontFamily={ZINDO_HEADING_FONT}
        fontWeight={500}
        fontSize="64"
        letterSpacing="1"
      >
        ZINDO
      </text>
      {/* Registered trademark mark */}
      <circle cx="392" cy="108" r="11" stroke={color} strokeWidth="1.2" fill="none" />
      <text x="392" y="112" textAnchor="middle" fill={color} fontSize="11" fontFamily="sans-serif">
        R
      </text>
    </svg>
  );
}
