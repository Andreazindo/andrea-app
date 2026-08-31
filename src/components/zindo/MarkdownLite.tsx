import Link from "next/link";
import { zindoColors } from "@/components/zindo/theme";

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-${i++}`} style={{ color: zindoColors.green }}>
          {match[1]}
        </strong>
      );
    } else {
      const isInternal = match[3].startsWith("/");
      nodes.push(
        isInternal ? (
          <Link key={`${keyPrefix}-${i++}`} href={match[3]} className="underline" style={{ color: zindoColors.gold }}>
            {match[2]}
          </Link>
        ) : (
          <a
            key={`${keyPrefix}-${i++}`}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: zindoColors.gold }}
          >
            {match[2]}
          </a>
        )
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function ZindoMarkdownLite({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "" || line.trim() === "---") {
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="text-base font-semibold mt-8 mb-2" style={{ color: zindoColors.green, fontFamily: "var(--font-zindo-heading)" }}>
          {renderInline(line.slice(4), `h3-${key}`)}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="text-lg font-semibold mt-10 mb-3 uppercase tracking-wide" style={{ color: zindoColors.green, fontFamily: "var(--font-zindo-heading)" }}>
          {renderInline(line.slice(3), `h2-${key}`)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      i++;
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++} className="list-decimal pl-5 space-y-1.5 text-sm" style={{ color: zindoColors.ink, opacity: 0.85 }}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ol-${key}-${idx}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-5 space-y-1.5 text-sm" style={{ color: zindoColors.ink, opacity: 0.85 }}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ul-${key}-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.startsWith("**Última actualización:**")) {
      blocks.push(
        <p key={key++} className="text-xs mb-8" style={{ color: zindoColors.ink, opacity: 0.55 }}>
          {renderInline(line, `p-${key}`)}
        </p>
      );
      i++;
      continue;
    }

    if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      blocks.push(
        <p key={key++} className="text-xs italic mt-8" style={{ color: zindoColors.ink, opacity: 0.6 }}>
          {renderInline(line.slice(1, -1), `p-${key}`)}
        </p>
      );
      i++;
      continue;
    }

    blocks.push(
      <p key={key++} className="text-sm leading-relaxed mb-3" style={{ color: zindoColors.ink, opacity: 0.85 }}>
        {renderInline(line, `p-${key}`)}
      </p>
    );
    i++;
  }

  return <div style={{ fontFamily: "var(--font-zindo-body)" }}>{blocks}</div>;
}
