/**
 * pagefind-opennext.mjs — pagefind for the OpenNext (Workers) build.
 *
 * Problem: the server build has no `out/` directory for pagefind to scan,
 * and scanning `.next/server/app` directly makes result URLs come out as
 * `/blog/<slug>.html` (wrong — the site uses trailing-slash URLs).
 *
 * Fix (verified in the OpenNext assessment, 2026-11-22): copy the
 * prerendered `.next/server/app` HTML files into a temp staging
 * directory, converting `x.html` → `x/index.html`, then run pagefind
 * against the staging directory with its output straight into
 * `.open-next/assets/pagefind` (so preview and deploy serve the same
 * index). Must run AFTER `opennextjs-cloudflare build` — the assets
 * directory only exists once the Worker is bundled.
 *
 * Guard: the build FAILS (exit 1) unless pagefind indexes the expected
 * number of pages (55 articles). A search index that silently loses pages
 * must never ship — the search page would show an error state instead.
 *
 * Usage: node scripts/pagefind-opennext.mjs
 * (called by `node scripts/build.mjs cf`, after the OpenNext build)
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Expected indexed pages = number of articles (55 as of 2026-11-22).
// This is a build guard, not a magic number: keep it in sync with the
// article count. `scripts/build-posts-data.mjs` prints the count on
// every build — if it changes, update this number in the same commit.
const EXPECTED_PAGES = 55;

const appDir = path.join(projectRoot, '.next', 'server', 'app');
const outDir = path.join(projectRoot, '.open-next', 'assets', 'pagefind');

function fail(message) {
  console.error(`[pagefind-opennext] ERROR: ${message}`);
  process.exit(1);
}

function collectHtmlFiles(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectHtmlFiles(full, base));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(path.relative(base, full));
    }
  }
  return out;
}

function main() {
  if (!fs.existsSync(appDir)) {
    fail(`prerendered app directory not found: ${appDir} — run the Next.js build first.`);
  }
  if (!fs.existsSync(path.join(projectRoot, '.open-next'))) {
    fail('.open-next/ not found — run `opennextjs-cloudflare build` before pagefind.');
  }

  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'olive-wisdom-pagefind-'));
  try {
    const htmlFiles = collectHtmlFiles(appDir);
    if (htmlFiles.length === 0) {
      fail(`no .html files found under ${appDir} — nothing to index.`);
    }
    for (const rel of htmlFiles) {
      // x.html → x/index.html (index.html at root stays index.html),
      // so pagefind emits trailing-slash URLs (/blog/<slug>/).
      const destRel = rel === 'index.html' ? rel : rel.replace(/\.html$/, '/index.html');
      const dest = path.join(staging, destRel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(path.join(appDir, rel), dest);
    }
    console.log(`[pagefind-opennext] staged ${htmlFiles.length} html files → ${staging}`);

    const result = spawnSync(
      'npx',
      ['pagefind', '--site', staging, '--output-path', outDir],
      { cwd: projectRoot, stdio: 'inherit', shell: process.platform === 'win32' },
    );
    if (result.error) fail(`could not start pagefind: ${result.error.message}`);
    if (result.status !== 0) fail(`pagefind exited with code ${result.status}`);

    // Guard: pagefind-entry.json carries the indexed page count.
    const entryPath = path.join(outDir, 'pagefind-entry.json');
    if (!fs.existsSync(entryPath)) fail(`pagefind output missing: ${entryPath}`);
    const entry = JSON.parse(fs.readFileSync(entryPath, 'utf8'));
    const counts = Object.values(entry.languages || {}).map((l) => l.page_count);
    const total = counts.reduce((a, b) => a + b, 0);
    console.log(`[pagefind-opennext] indexed ${total} pages (expected ${EXPECTED_PAGES})`);
    if (total !== EXPECTED_PAGES) {
      fail(
        `indexed ${total} pages, expected ${EXPECTED_PAGES} — ` +
          'the search index lost pages; refusing to ship a broken search. ' +
          'If the article count really changed, update EXPECTED_PAGES.',
      );
    }
    console.log('[pagefind-opennext] ✓ search index OK');
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
}

main();
