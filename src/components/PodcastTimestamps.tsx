import type { Episode } from '@/lib/podcast';

/**
 * 集數時間戳（blueprint 2.4-2）：把集數的時間戳錨定到本文 H2 章節。
 * 以與 TableOfContents 相同的正則解析本文 H2（id＋文字），只渲染
 * heading 與實際 H2 完全一致的時間戳；沒有集數或無對應章節時
 * 渲染 null。
 */
function extractH2(htmlContent: string): { id: string; text: string }[] {
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  const items: { id: string; text: string }[] = [];
  let m;
  while ((m = regex.exec(htmlContent)) !== null) {
    if (m[1] !== '2') continue;
    const text = m[3].replace(/<[^>]+>/g, '').trim();
    if (text) items.push({ id: m[2], text });
  }
  return items;
}

export default function PodcastTimestamps({
  episode,
  htmlContent,
}: {
  episode?: Episode;
  htmlContent: string;
}) {
  if (!episode || episode.timestamps.length === 0) return null;
  const h2s = extractH2(htmlContent);
  const rows = episode.timestamps
    .map((t) => {
      const h = h2s.find((x) => x.text === t.heading);
      return h ? { time: t.time, heading: t.heading, id: h.id } : null;
    })
    .filter((r): r is { time: string; heading: string; id: string } => r !== null);
  if (rows.length === 0) return null;
  return (
    <div className="mt-12 pt-8 border-t border-olive-100">
      <h3 className="text-sm font-sans font-semibold text-stone-400 tracking-[0.2em] uppercase mb-4">
        本集時間戳
      </h3>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="flex items-baseline gap-3 text-sm">
            <span className="font-mono text-olive-600 shrink-0 w-14">{r.time}</span>
            <a href={`#${r.id}`} className="text-stone-600 hover:text-olive-800 underline-offset-4 hover:underline">
              {r.heading}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
