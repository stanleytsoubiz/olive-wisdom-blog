/**
 * lib/categories.ts
 *
 * Single source of truth for article categories (分類).
 *
 * The site has 7 stored category values (science, health, selection,
 * guide, lifestyle, culture, heritage) but only 4 display columns.
 * Previously each file kept its own copy of that mapping — layout.tsx
 * NAV_LINKS + footer, BlogFilter.tsx CATEGORY_MAP + CAT_TABS, the
 * article page CATEGORY_MAP, and the homepage card labels (which used
 * yet different words: 科學查證 / 品油筆記 …). They drifted apart.
 *
 * Now: every consumer imports from here. Slugs and URLs are unchanged
 * (/blog?cat=guide etc. keep filtering exactly as before).
 *
 * NATURE_LABEL stays as a secondary small label on the list page only —
 * it describes the article's content type (選購指南 / 使用指南 …),
 * not its column.
 */

export interface CategoryColumn {
  /** The ?cat= value for this column. */
  key: string;
  label: string;
  en: string;
  href: string;
  /** Stored category values that belong to this column. */
  members: string[];
}

export const CATEGORY_COLUMNS: CategoryColumn[] = [
  { key: 'science',   label: '科學萃取', en: 'Science',   href: '/blog?cat=science',   members: ['science'] },
  { key: 'health',    label: '品味鑑賞', en: 'Selection', href: '/blog?cat=health',    members: ['health', 'selection', 'guide'] },
  { key: 'lifestyle', label: '餐桌美學', en: 'Lifestyle', href: '/blog?cat=lifestyle', members: ['lifestyle'] },
  { key: 'culture',   label: '知性史詩', en: 'Heritage',  href: '/blog?cat=culture',   members: ['culture', 'heritage'] },
];

export interface CategoryInfo {
  /** Display column label (one of the 4 column names). */
  label: string;
  en: string;
  /** Which of the 4 columns this category belongs to. */
  column: string;
  badgeClass: string;
  accentColor: string;
}

export const CATEGORY_MAP: Record<string, CategoryInfo> = {
  science:   { label: '科學萃取', en: 'Science',   column: 'science',   badgeClass: 'bg-olive-100 text-olive-800', accentColor: 'text-olive-600' },
  lifestyle: { label: '餐桌美學', en: 'Lifestyle', column: 'lifestyle', badgeClass: 'bg-gold-100 text-gold-800',   accentColor: 'text-gold-600' },
  health:    { label: '品味鑑賞', en: 'Selection', column: 'health',    badgeClass: 'bg-olive-100 text-olive-700', accentColor: 'text-olive-600' },
  selection: { label: '品味鑑賞', en: 'Selection', column: 'health',    badgeClass: 'bg-olive-100 text-olive-700', accentColor: 'text-olive-600' },
  guide:     { label: '品味鑑賞', en: 'Selection', column: 'health',    badgeClass: 'bg-olive-100 text-olive-700', accentColor: 'text-olive-600' },
  culture:   { label: '知性史詩', en: 'Heritage',  column: 'culture',   badgeClass: 'bg-stone-100 text-stone-700', accentColor: 'text-stone-600' },
  heritage:  { label: '知性史詩', en: 'Heritage',  column: 'culture',   badgeClass: 'bg-stone-100 text-stone-700', accentColor: 'text-stone-600' },
};

/** Display label for a stored category value (falls back to the raw value). */
export function categoryLabel(category: string): string {
  return CATEGORY_MAP[category]?.label ?? category;
}

/** Which of the 4 columns a stored category value belongs to. */
export function categoryColumnOf(category: string): CategoryColumn | undefined {
  const key = CATEGORY_MAP[category]?.column;
  return CATEGORY_COLUMNS.find((c) => c.key === key);
}

/**
 * Does a post with this stored category belong under the given ?cat=
 * column key? This preserves the historic filter groupings exactly:
 * culture → culture|heritage, health → health|selection|guide.
 */
export function matchesColumn(category: string, columnKey: string): boolean {
  if (!columnKey) return true;
  const column = CATEGORY_COLUMNS.find((c) => c.key === columnKey);
  return column ? column.members.includes(category) : category === columnKey;
}

/** List-page category tabs: 全部 + the 4 columns. */
export const CAT_TABS: { key: string; label: string }[] = [
  { key: '', label: '全部' },
  ...CATEGORY_COLUMNS.map((c) => ({ key: c.key, label: c.label })),
];

// 內容性質標籤 — secondary small text on the list page only (Heho
// benchmark): lets readers tell the reading purpose at a glance.
// This is NOT the column name; keep both visible, don't merge them.
export const NATURE_LABEL: Record<string, string> = {
  science:   '科學查證',
  health:    '品油筆記',
  selection: '選購指南',
  guide:     '使用指南',
  lifestyle: '餐桌應用',
  culture:   '產地探訪',
  heritage:  '產地探訪',
};
