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
  for (const fileName of fileNames) {
    const fullPath = path.join(postsDirectory, fileName);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = await parseFrontmatter(raw);
    posts.push({ ...data, content });
  }

  // Sort newest-first (same as getAllPosts())
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

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
