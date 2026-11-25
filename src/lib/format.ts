/**
 * lib/format.ts
 *
 * Date display for post frontmatter dates.
 *
 * Frontmatter dates are date-only strings ("2026-11-23"). Feeding them to
 * `new Date()` yields UTC midnight, and `toLocaleDateString` in any
 * UTC-negative timezone then renders the PREVIOUS day. That split the
 * site: server-rendered surfaces (article page, homepage — built in UTC)
 * showed 11月23日， while the /blog list — a client component re-rendered
 * in the reader's browser (e.g. UTC-8) — showed 11月22日 for the same
 * posts.
 *
 * Format from the string parts instead: no Date object, no timezone, so
 * every surface in every timezone shows the frontmatter calendar date.
 */
export function formatPostDate(date: string, withYear = false): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!m) return date;
  const [, y, mo, d] = m;
  const md = `${Number(mo)}月${Number(d)}日`;
  return withYear ? `${y}年${md}` : md;
}
