/**
 * optimize-covers-build.mjs — build-time JPG → WebP cover conversion.
 *
 * Why build-time, not committed WebP files?
 * ------------------------------------------
 * The 46 local article covers in public/images/covers/ are ~16 MB of JPGs.
 * Converting them once and committing the WebP files is not possible through
 * the GitHub connector this repo is pushed with: it can only push UTF-8
 * text, never binary files (see research_notes/olive-wisdom-tech-batch1-
 * 20261122/report.md, section A). So the WebP files are generated here, on
 * every build, from the committed JPGs — in CI exactly as locally.
 *
 * What it does:
 *   1. Collects every local cover referenced by public/data/images.json and
 *      by src/data/posts-generated.json (frontmatter coverImage values).
 *      A stale .webp reference (left by an interrupted build that rewrote
 *      images.json without restoring it) is normalised back to .jpg, so
 *      this step is idempotent.
 *   2. Converts each referenced JPG → WebP (max width 1200px, quality 82)
 *      into public/images/covers/. A WebP that is newer than its JPG is
 *      skipped, so a second build in a row converts nothing.
 *   3. Rewrites /images/covers/*.jpg → *.webp in the two GENERATED files
 *      the build consumes: src/data/posts-generated.json (regenerated from
 *      frontmatter on every build) and public/data/images.json (TRACKED —
 *      scripts/build.mjs backs it up before this step and restores it after
 *      the build, so the working tree is never left dirty).
 *
 * The 7 newest articles use remote Unsplash covers (no local file) and are
 * untouched. Unreferenced JPGs on disk are reported and left alone — never
 * deleted here.
 *
 * Run: node scripts/optimize-covers-build.mjs
 * Normally invoked by scripts/build.mjs, not directly.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const coversDir = path.join(projectRoot, 'public', 'images', 'covers');
const imagesJsonPath = path.join(projectRoot, 'public', 'data', 'images.json');
const postsJsonPath = path.join(projectRoot, 'src', 'data', 'posts-generated.json');

const MAX_W = 1200;
const QUALITY = 82;

// Matches /images/covers/<name>.jpg or .webp (see header: .webp refs can
// appear if a previous build was interrupted before restoring images.json).
const COVER_RE = /\/images\/covers\/([A-Za-z0-9_.\-]+)\.(?:jpg|webp)/g;

function collectReferencedJpgs() {
  const refs = new Set();
  for (const file of [imagesJsonPath, postsJsonPath]) {
    if (!fs.existsSync(file)) {
      console.warn(`[optimize-covers] WARNING: ${path.relative(projectRoot, file)} not found, skipping it as a reference source`);
      continue;
    }
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(COVER_RE)) refs.add(`${m[1]}.jpg`);
  }
  return refs;
}

function rewriteJpgToWebp(file) {
  if (!fs.existsSync(file)) return 0;
  const text = fs.readFileSync(file, 'utf8');
  const rewritten = text.replace(
    /\/images\/covers\/([A-Za-z0-9_.\-]+)\.jpg/g,
    '/images/covers/$1.webp',
  );
  if (rewritten === text) return 0;
  fs.writeFileSync(file, rewritten, 'utf8');
  return (text.match(/\/images\/covers\/[A-Za-z0-9_.\-]+\.jpg/g) || []).length;
}

async function main() {
  const { default: sharp } = await import('sharp').catch((err) => {
    console.error('[optimize-covers] ERROR: sharp is not installed — run `npm install` first:', err.message);
    process.exit(1);
  });

  const refs = collectReferencedJpgs();
  if (refs.size === 0) {
    console.error('[optimize-covers] ERROR: no local covers referenced by images.json / posts-generated.json — refusing to guess');
    process.exit(1);
  }

  const onDisk = new Set(
    fs.readdirSync(coversDir).filter((f) => f.endsWith('.jpg')),
  );
  const orphans = [...onDisk].filter((f) => !refs.has(f));
  for (const name of orphans.sort()) {
    console.warn(`[optimize-covers] WARNING: unreferenced JPG on disk, left alone: ${name}`);
  }

  let converted = 0;
  let skipped = 0;
  let totalBefore = 0;
  let totalAfter = 0;
  for (const name of [...refs].sort()) {
    const src = path.join(coversDir, name);
    if (!fs.existsSync(src)) {
      console.error(`[optimize-covers] ERROR: referenced but missing on disk: ${name}`);
      process.exit(1);
    }
    const dst = path.join(coversDir, name.slice(0, -4) + '.webp');
    const srcStat = fs.statSync(src);
    if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= srcStat.mtimeMs) {
      skipped += 1;
      totalBefore += srcStat.size;
      totalAfter += fs.statSync(dst).size;
      continue;
    }
    const info = await sharp(src)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(dst);
    totalBefore += srcStat.size;
    totalAfter += info.size;
    converted += 1;
    console.log(`[optimize-covers] ${name}: ${Math.round(srcStat.size / 1024)} KB -> ${Math.round(info.size / 1024)} KB webp`);
  }

  const rewrittenPosts = rewriteJpgToWebp(postsJsonPath);
  const rewrittenImages = rewriteJpgToWebp(imagesJsonPath);
  console.log(
    `[optimize-covers] ✓ ${converted} converted, ${skipped} up to date, ` +
    `${refs.size} referenced; ${totalBefore / 1024 / 1024} MB -> ${totalAfter / 1024 / 1024} MB ` +
    `(${Math.round(100 * (1 - totalAfter / Math.max(totalBefore, 1)))}% smaller); ` +
    `rewrote ${rewrittenPosts} refs in posts-generated.json, ${rewrittenImages} in images.json`,
  );
}

main().catch((err) => {
  console.error('[optimize-covers] FATAL:', err);
  process.exit(1);
});
