/**
 * build-posts-data.mjs
 *
 * Prebuild script — converts all markdown files in content/posts/ into a
 * single bundled JSON file at src/data/posts-generated.json.
 *
 * This allows lib/posts.ts to use a static import instead of fs.readFile,
 * making it compatible with Cloudflare Workers where no filesystem exists.
 *
 * Run: node scripts/build-posts-data.mjs
 * Called automatically by "build" and "build:cf" npm scripts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const postsDirectory = path.join(projectRoot, 'content', 'posts');
const outputPath = path.join(projectRoot, 'src', 'data', 'posts-generated.json');

// Inline gray-matter parsing (avoid needing to import it in a script context)
// We use a simple frontmatter parser since gray-matter is a project dep
async function parseFrontmatter(content) {
  const { default: matter } = await import('gray-matter');
  const { data, content: body } = matter(content);
  return { data, content: body };
}

async function main() {
  if (!fs.existsSync(postsDirectory)) {
    console.error(`[build-posts-data] ERROR: content/posts/ not found at ${postsDirectory}`);
    process.exit(1);
  }

  const fileNames = fs.readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  const posts = [];
  // Build guard: no internal link may use the legacy /posts/ path any more.
  // All article links were rewritten to /blog/ (2026-11-22); the /posts/ →
  // /blog/ 301 in public/_redirects exists only for old external links.
  // Fail loudly here so a bad link never ships.
  const legacyLinkViolations = [];
  // Build guard: affiliate marketing is paused (2026-11-22) — no article may
  // claim affiliate links or carry an affiliate tracking tag. Fail loudly so
  // a paused-program claim never ships.
  const affiliateViolations = [];
  for (const fileName of fileNames) {
    const fullPath = path.join(postsDirectory, fileName);
    const raw = fs.readFileSync(fullPath, 'utf8');
    if (raw.includes('/posts/')) {
      const count = raw.split('/posts/').length - 1;
      legacyLinkViolations.push(`${fileName} (${count}×)`);
    }
    if (raw.includes('本文含聯盟行銷連結') || raw.includes('tag=olivewisdom')) {
      affiliateViolations.push(fileName);
    }
    const { data, content } = await parseFrontmatter(raw);
    posts.push({ ...data, content });
  }
  if (legacyLinkViolations.length > 0) {
    console.error('[build-posts-data] ERROR: legacy /posts/ links found — rewrite them to /blog/:');
    for (const v of legacyLinkViolations) console.error(`  - ${v}`);
    process.exit(1);
  }
  if (affiliateViolations.length > 0) {
    console.error('[build-posts-data] ERROR: affiliate claims found while affiliate marketing is paused — remove the claim / tracking tag:');
    for (const v of affiliateViolations) console.error(`  - ${v}`);
    process.exit(1);
  }

  // Sort newest-first by publication date; slug breaks ties deterministically.
  // (Dates must compare as dates, not raw values: frontmatter dates arrive as
  // a mix of strings and Date objects, and raw comparison mis-sorts them.)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    || String(a.slug).localeCompare(String(b.slug)));

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`[build-posts-data] ✓ Wrote ${posts.length} posts → src/data/posts-generated.json`);
}

main().catch((err) => {
  console.error('[build-posts-data] FATAL:', err);
  process.exit(1);
});
