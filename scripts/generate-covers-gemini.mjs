#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════
 * 🎨 Olive Wisdom — Google AI Studio (Imagen 3) 封面圖生成腳本
 *
 * 架構理念：「品牌一致・AI 品質・本地靜態」
 *   - 使用 Google Imagen 4 (imagen-4.0-generate-001)，業界最高品質
 *   - 統一品牌 DNA 後綴確保視覺一致性（暗橄欖綠 × 暖金）
 *   - 圖片儲存至 public/images/covers/[slug].jpg（repo 靜態資產）
 *   - 同步更新 public/data/images.json（無需重 build 即可預覽）
 *
 * 執行：
 *   node scripts/generate-covers-gemini.mjs
 *   node scripts/generate-covers-gemini.mjs --dry-run
 *   node scripts/generate-covers-gemini.mjs --slug=predimed-study-complete-explainer-olive-oil-heart
 *   node scripts/generate-covers-gemini.mjs --force          # 強制重新生成所有已存在的圖片
 *   node scripts/generate-covers-gemini.mjs --missing-only   # 只生成 images.json 中缺少的文章
 *   node scripts/generate-covers-gemini.mjs --hero           # 同時重新生成 hero 圖片
 *
 * 環境變數（.env.local 或 shell 環境）：
 *   GOOGLE_AI_STUDIO_KEY — Google AI Studio API Key（必填）
 *
 * ══════════════════════════════════════════════════════════════════
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ── 載入 .env.local ──────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
      if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

// ── CLI 參數 ─────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN      = args.includes('--dry-run');
const FORCE        = args.includes('--force');
const HERO         = args.includes('--hero');
const MISSING_ONLY = args.includes('--missing-only');
const SLUG_ARG     = (args.find(a => a.startsWith('--slug=')) || '').replace('--slug=', '');

// ── 品牌 DNA — 統一視覺後綴 ─────────────────────────────────────
const BRAND_DNA = [
  'olive wisdom editorial photography',
  'dark moody background deep olive green (#1A2A1C)',
  'warm gold accent lighting (#A8894A)',
  'premium mediterranean lifestyle',
  'cinematic 16:9',
  'photorealistic ultra high quality',
  'no text no watermark no logo no person',
].join(', ');

// ── 文章 Prompts（每篇精心設計） ────────────────────────────────
const COVER_PROMPTS = {
  // ── 科學萃取 ───────────────────────────────────────────────────
  'polyphenols-sirt1-longevity-2026':
    'glowing DNA double helix surrounded by golden olive oil polyphenol molecules, SIRT1 longevity gene activation concept, bioluminescent molecular structure, scientific visualization macro photography',

  'hydroxytyrosol-brain-cognition-memory':
    'human brain neural network glowing golden synapses, olive molecular structure overlay, cognition memory enhancement concept, neuroscience visualization, dark studio',

  'hydroxytyrosol-brain-cognition-2026':
    'glowing neural network structure with golden antioxidant molecule pathways, bioluminescent synapse visualization, olive oil droplet molecular concept, abstract science art, deep dark background',

  'oleocanthal-anti-inflammation-brain-protection':
    'brain silhouette with anti-inflammation golden shield radiance, oleocanthal molecules forming protective barrier, mediterranean olive branch, dramatic dark background medical fine art',

  'oleocanthal-pungency-anti-inflammation':
    'extreme macro fresh green olive cold-pressed, golden-green oil droplet suspended mid-air, molecular pungency concept, dramatic split cinematic lighting, ultra sharp focus',

  'olive-oil-polyphenol-content-how-to-verify':
    'laboratory glass tubes with golden olive oil samples, polyphenol spectrometer analysis, scientific equipment precision, clean food science photography, clinical white and gold',

  'polyphenol-decay-science-2026':
    'olive oil bottle with UV light oxidation concept, time-lapse molecular degradation visualization, polyphenol half-life science, amber bottle contrast fresh vs aged',

  '2026-evoo-quality-polyphenol-index':
    'premium extra virgin olive oil quality certification, molecular polyphenol visualization data overlay, artisan dark glass bottle close-up, precision measurement aesthetic',

  // ── 品味鑑賞 / Selection ────────────────────────────────────────
  'evoo-sensory-evaluation-ioc-standards':
    'cobalt blue IOC olive oil tasting glass with golden olive oil, sensory evaluation setup, premium artisan tasting room still life, luxury food photography warm studio light, elegant tableware',

  'evoo-buying-guide-2026':
    'curated premium extra virgin olive oil bottles collection, elegant product display, dark artisan glass bottles row, warm luxury food photography, golden hour light',

  'olive-oil-complete-buying-guide-2026':
    'sophisticated olive oil selection guide, multiple premium EVOO bottles comparison, labels visible, sophisticated retail still life, magazine editorial style',

  'olive-oil-fraud-detection-authentic-vs-fake':
    'two olive oil bottles comparison authentic vs counterfeit, forensic laboratory concept, magnifying glass revealing molecular truth, dramatic split lighting investigation',

  'olive-oil-terroir-spain-greece-italy':
    'three mediterranean olive grove landscapes panorama, golden sunset over ancient olive trees, terroir concept, travel editorial photography, cinematic wide angle',

  'olive-oil-vs-avocado-oil-complete-comparison':
    'side by side premium olive oil and avocado oil bottles, elegant comparison still life, complementary green tones, dark marble surface, food styling editorial',

  'olive-oil-storage-guide-2026':
    'dark glass olive oil bottle perfect storage environment, cool dim mediterranean cellar, terracotta tile backdrop, preservation concept, moody atmospheric photography',

  // ── 新文章（本次 Session 新增）─────────────────────────────────
  'olive-oil-cooking-heat-stability-smoke-point':
    'olive oil golden stream pouring into hot cast iron skillet, smoke point visualization, high temperature cooking science concept, dramatic kitchen photography, fire and steam',

  'olive-oil-grades-classification-complete-guide':
    'five different grade olive oil bottles elegantly arranged, classification spectrum from extra virgin to pomace, premium product photography, dark stone surface, editorial layout',

  'predimed-study-complete-explainer-olive-oil-heart':
    'human heart diagram with olive oil molecular protection, PREDIMED research concept visualization, cardiovascular health science, golden molecular shield around anatomical heart',

  'olive-oil-shelf-life-oxidation-storage':
    'olive oil bottle with subtle oxidation concept, before and after quality comparison, molecular decay visualization, calendar time concept, dark dramatic still life',

  'olive-oil-daily-intake-dosage-science':
    'precise elegant tablespoon of golden extra virgin olive oil, morning ritual concept, soft morning light, wooden table, minimalist lifestyle food photography, dosage science',

  'olive-oil-health-benefits-science-complete':
    'dynamic body silhouette with seven glowing health benefit zones highlighted, olive branch and molecular structure overlay, comprehensive wellness visualization, dark medical art',

  // ── 餐桌美學 Lifestyle ─────────────────────────────────────────
  'morning-ritual-evoo-metabolism':
    'elegant morning ritual tablespoon of golden EVOO, white ceramic spoon soft sunrise light, minimalist lifestyle photography, wooden farmhouse table, fresh rosemary herbs',

  'olive-oil-ancient-egypt-ritual-heritage':
    'ancient Egyptian alabaster olive oil vessel, hieroglyphic stone wall, golden candlelight archaeological photography, museum-quality historical still life',

  'olive-tree-ancient-civilization-heritage':
    'ancient gnarled millennial olive tree trunk and roots, golden hour dramatic light, Crete or Attica Mediterranean landscape, UNESCO heritage feel, epic wide angle',

  'olive-oil-renaissance-art-science-history':
    'Renaissance painting detail with olive oil vessel, Flemish still life aesthetic, Old Master oil lamp, gold-leaf frame fragment, warm chiaroscuro dramatic lighting',

  'olive-oil-silk-road-trade-history':
    'ancient Silk Road trading amphora olive oil vessel, desert caravan archaeology, weathered terracotta with golden oil, historical documentary photography, warm amber tones',

  // ── 科學萃取 其他 ──────────────────────────────────────────────
  'squalene-olive-oil-skin-beauty-molecular':
    'squalene molecular structure visualization, olive oil droplets with luminous beauty science concept, cosmetic ingredient macro photography, golden molecular bonds on dark background, premium science editorial',

  'mediterranean-diet-anti-aging-2026':
    'mediterranean longevity concept, elegant 40+ lifestyle, olive branches, colorful vegetables, EVOO bottle, golden light, anti-aging healthy living editorial photography',

  'mediterranean-diet-anti-aging-women-2026':
    'mediterranean woman lifestyle concept, 40+ vitality, olive grove breakfast scene, EVOO morning ritual, warm golden light, female wellness editorial photography',
};

// ── Hero 圖片 Prompts ────────────────────────────────────────────
const HERO_PROMPTS = {
  homepage:
    'stunning mediterranean olive grove aerial view at golden hour, rows of silver-green olive trees, warm sunrise light, cinematic landscape photography, premium brand hero image, wide panoramic',
  blog:
    'elegant mediterranean lifestyle flat lay, premium olive oil bottle, fresh olives on branch, linen textile, warm editorial photography, knowledge and culture concept',
  about:
    'close-up golden extra virgin olive oil poured from artisan bottle, rippling liquid gold surface, editorial elegance concept, dark marble background, brand identity photography',
};

// ── 路徑設定 ────────────────────────────────────────────────────
const COVERS_DIR    = path.join(ROOT, 'public', 'images', 'covers');
const IMAGES_JSON   = path.join(ROOT, 'public', 'data', 'images.json');
const POSTS_DIR     = path.join(ROOT, 'content', 'posts');

// ── 工具函式 ────────────────────────────────────────────────────
function log(emoji, msg) { console.log(`${emoji} ${msg}`); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function readImagesJson() {
  try { return JSON.parse(fs.readFileSync(IMAGES_JSON, 'utf-8')); }
  catch { return { _meta: {}, hero: {}, posts: {}, fallback: {} }; }
}

function writeImagesJson(data) {
  fs.writeFileSync(IMAGES_JSON, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function getExistingSlugs() {
  try {
    return fs.readdirSync(POSTS_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace(/\.md$/, ''));
  } catch { return []; }
}

// ── 核心：呼叫 Imagen 4 ─────────────────────────────────────────
async function generateImage(ai, prompt, outputPath, label) {
  const fullPrompt = `${prompt}, ${BRAND_DNA}`;

  if (DRY_RUN) {
    log('🔍', `[DRY-RUN] ${label}`);
    log('   ', `Prompt: ${fullPrompt.slice(0, 120)}…`);
    return { success: true, dryRun: true };
  }

  try {
    log('🎨', `Generating: ${label}`);

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
        outputMimeType: 'image/jpeg',
        // Safety filter setting for artistic food photography
        personGeneration: 'dont_allow',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      log('⚠️', `No image returned for: ${label}`);
      return { success: false };
    }

    const imageBytes = response.generatedImages[0].image.imageBytes;
    const buffer = Buffer.from(imageBytes, 'base64');
    fs.writeFileSync(outputPath, buffer);

    const sizeKB = Math.round(buffer.length / 1024);
    log('✅', `Saved ${label} (${sizeKB} KB) → ${path.relative(ROOT, outputPath)}`);
    return { success: true, sizeKB };

  } catch (err) {
    const msg = err.message || String(err);
    log('❌', `Failed: ${label} — ${msg}`);
    return { success: false, error: msg };
  }
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const apiKey = process.env.GOOGLE_AI_STUDIO_KEY;
  if (!apiKey) {
    console.error('\n❌ GOOGLE_AI_STUDIO_KEY is not set.');
    console.error('   Add it to .env.local:');
    console.error('   GOOGLE_AI_STUDIO_KEY=AIza…\n');
    console.error('   Get a free key at: https://aistudio.google.com/apikey\n');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  const imagesJson = readImagesJson();
  const allSlugs = getExistingSlugs();

  // ── Determine target slugs ────────────────────────────────────
  let slugs = SLUG_ARG
    ? [SLUG_ARG]
    : allSlugs;

  if (MISSING_ONLY && !SLUG_ARG) {
    const existingInJson = Object.keys(imagesJson.posts || {});
    const existingFiles  = fs.existsSync(COVERS_DIR)
      ? fs.readdirSync(COVERS_DIR).map(f => f.replace(/\.(jpg|png|webp)$/, ''))
      : [];
    slugs = slugs.filter(s =>
      !existingInJson.includes(s) || !existingFiles.includes(s)
    );
    log('🔎', `Missing-only mode: ${slugs.length} articles need images`);
  }

  if (!fs.existsSync(COVERS_DIR)) fs.mkdirSync(COVERS_DIR, { recursive: true });

  const stats = { attempted: 0, succeeded: 0, skipped: 0, failed: 0 };

  // ── Generate article covers ───────────────────────────────────
  for (const slug of slugs) {
    const outPath  = path.join(COVERS_DIR, `${slug}.jpg`);
    const prompt   = COVER_PROMPTS[slug];
    const hasFile  = fs.existsSync(outPath);
    const hasJson  = !!(imagesJson.posts?.[slug]?.url || '').includes('/images/covers/');

    if (!prompt) {
      log('⚠️', `No prompt defined for: ${slug} — skipping`);
      stats.skipped++;
      continue;
    }

    if (!FORCE && hasFile && hasJson) {
      log('⏭️ ', `Already exists: ${slug}`);
      stats.skipped++;
      continue;
    }

    stats.attempted++;
    const result = await generateImage(ai, prompt, outPath, slug);

    if (result.success && !result.dryRun) {
      stats.succeeded++;
      // Update images.json
      if (!imagesJson.posts) imagesJson.posts = {};
      imagesJson.posts[slug] = {
        url: `/images/covers/${slug}.jpg`,
        alt: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        source: 'google_imagen4',
        generated_at: new Date().toISOString().split('T')[0],
        quality_score: 9.0,
        prompt: prompt.slice(0, 120),
      };
      writeImagesJson(imagesJson);
    } else if (result.dryRun) {
      stats.succeeded++;
    } else {
      stats.failed++;
    }

    // Rate limit: 5 requests/min for Imagen 3 free tier
    if (stats.attempted < slugs.length && !DRY_RUN) {
      log('⏳', 'Rate limit pause (12s)…');
      await sleep(12000);
    }
  }

  // ── Generate hero images ──────────────────────────────────────
  if (HERO) {
    log('\n🏔️ ', 'Generating hero images…');
    if (!imagesJson.hero) imagesJson.hero = {};

    for (const [page, prompt] of Object.entries(HERO_PROMPTS)) {
      const outPath = path.join(ROOT, 'public', 'images', 'ai', `${page}-hero.jpg`);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });

      const result = await generateImage(ai, prompt, outPath, `hero:${page}`);
      if (result.success && !result.dryRun) {
        imagesJson.hero[page] = {
          url: `/images/ai/${page}-hero.jpg`,
          alt: `知橄生活 — ${page}`,
          source: 'google_imagen4',
          generated_at: new Date().toISOString().split('T')[0],
          quality_score: 9.0,
        };
        writeImagesJson(imagesJson);
      }
      if (!DRY_RUN) await sleep(12000);
    }
  }

  // ── Update meta ───────────────────────────────────────────────
  if (!DRY_RUN && stats.succeeded > 0) {
    imagesJson._meta = {
      ...imagesJson._meta,
      version: '3.0.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      last_google_imagen_run: {
        date: new Date().toISOString(),
        generated: stats.succeeded,
        total_articles: allSlugs.length,
      },
    };
    writeImagesJson(imagesJson);
  }

  // ── Summary ───────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(56));
  console.log('  Olive Wisdom × Google Imagen 3 — 生成完成');
  console.log('═'.repeat(56));
  console.log(`  ✅ 成功: ${stats.succeeded}`);
  console.log(`  ⏭️  跳過: ${stats.skipped}`);
  console.log(`  ❌ 失敗: ${stats.failed}`);
  if (!DRY_RUN && stats.succeeded > 0) {
    console.log(`\n  📁 圖片儲存至: public/images/covers/`);
    console.log(`  📋 images.json 已更新`);
    console.log(`\n  下一步: git add -A && git commit -m "feat: Imagen 3 covers batch"`);
    console.log(`           git push origin main`);
  }
  console.log('═'.repeat(56) + '\n');
}

main().catch(err => {
  console.error('\n❌ Unexpected error:', err.message || err);
  process.exit(1);
});
