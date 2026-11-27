// Table-of-contents extraction — runs on the SERVER at build time so the
// client TableOfContents component receives only the small items array
// instead of the full article HTML (2026-11-26 perf tranche: previously the
// entire htmlContent string was passed as a client prop just so the client
// could regex out the headings).
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractTocItems(htmlContent: string): TocItem[] {
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  const items: TocItem[] = [];
  let m;
  while ((m = regex.exec(htmlContent)) !== null) {
    const text = m[3].replace(/<[^>]+>/g, '').trim();
    if (text) items.push({ id: m[2], text, level: parseInt(m[1]) });
  }
  return items;
}
