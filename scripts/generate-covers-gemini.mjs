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

// ── 品牌 DNA — 統一視覺後綴（真實攝影風格） ─────────────────────
const BRAND_DNA = [
  'premium editorial food photography',
  'natural diffused window light',
  'shallow depth of field',
  'muted earth tones warm olive honey palette',
  'Kinfolk magazine aesthetic',
  'shot on medium format camera',
  '16:9 cinematic crop',
  'no text no watermark no logo no person',
].join(', ');

// ── 文章 Prompts（真實攝影風格，無 AI 合成感） ──────────────────
const COVER_PROMPTS = {
  // ── 科學萃取 ───────────────────────────────────────────────────
  'polyphenols-sirt1-longevity-2026':
    'golden extra virgin olive oil poured into small glass vial on white marble, dried botanical herbs scattered nearby, open scientific journal, warm afternoon window light still life, macro close-up',

  'hydroxytyrosol-brain-cognition-memory':
    'small amber glass bottles with golden olive extract on linen cloth, fresh olive sprig, white ceramic mortar with herbs, soft natural light flat lay, apothecary still life',

  'hydroxytyrosol-brain-cognition-2026':
    'premium olive oil in elegant dark glass bottle beside fresh green herbs and small vial, marble surface, warm diffused light, minimalist science editorial still life',

  'oleocanthal-anti-inflammation-brain-protection':
    'fresh green olives with olive branch and golden oil drizzle on white linen, anti-inflammatory herbs turmeric rosemary beside, overhead flat lay, natural morning light',

  'oleocanthal-pungency-anti-inflammation':
    'extreme macro fresh green olive cross-section on dark slate, golden oil droplet emerging from center, shallow depth of field bokeh, natural side light, fine food photography',

  'olive-oil-polyphenol-content-how-to-verify':
    'premium EVOO bottle with official quality certificate beside it, magnifying glass resting on label, clean white wooden desk, soft window light, authenticity verification still life',

  'polyphenol-decay-science-2026':
    'two identical olive oil bottles side by side, one golden fresh one darker aged, white marble surface, clean window light comparison still life, quality and freshness concept',

  '2026-evoo-quality-polyphenol-index':
    'single artisan dark glass EVOO bottle with quality seal on white marble, sprig of olive branch, warm side light, minimalist premium product photography, editorial clean',

  // ── 品味鑑賞 / Selection ────────────────────────────────────────
  'evoo-sensory-evaluation-ioc-standards':
    'cobalt blue professional olive oil tasting glass filled with golden oil, white linen napkin, tasting notes notebook and pen, warm afternoon light still life, sommelier evaluation setup',

  'evoo-buying-guide-2026':
    'three premium extra virgin olive oil bottles on aged wooden shelf, warm kitchen morning light filtering through window, rustic Mediterranean pantry, editorial still life',

  'olive-oil-complete-buying-guide-2026':
    'curated selection of EVOO bottles with visible labels on white marble counter, shopping guide concept, natural diffused light, clean editorial food photography',

  'olive-oil-fraud-detection-authentic-vs-fake':
    'two olive oil bottles on marble, authentic dark glass beside pale suspicious imitation, magnifying glass resting between them, natural side light, investigative still life',

  'olive-oil-terroir-spain-greece-italy':
    'three small ceramic bowls with different regional olive oils, terroir concept, Mediterranean tiles background, natural window light overhead, food geography still life',

  'olive-oil-vs-avocado-oil-complete-comparison':
    'olive oil and avocado oil bottles side by side on white marble, sliced avocado and fresh olives between them, warm kitchen light, comparison food photography editorial',

  'olive-oil-storage-guide-2026':
    'dark glass olive oil bottle in cool wooden cabinet with terracotta tiles, away from light and heat, Mediterranean kitchen atmosphere, warm but dim ambient light, proper storage scene',

  // ── 健康科學 ───────────────────────────────────────────────────
  'olive-oil-cooking-heat-stability-smoke-point':
    'golden olive oil stream pouring into hot cast iron skillet on kitchen stove, steam rising gently, warm kitchen bokeh background, natural cooking photography, editorial food moment',

  'olive-oil-grades-classification-complete-guide':
    'four olive oil bottles lined up from premium dark glass to light plastic, grade comparison concept, white marble surface, clean studio light, product classification editorial',

  'predimed-study-complete-explainer-olive-oil-heart':
    'heart-healthy Mediterranean breakfast spread, EVOO bottle, fresh tomatoes, whole grain bread, olives, nuts on rustic wooden table, warm morning light, diet science editorial',

  'olive-oil-shelf-life-oxidation-storage':
    'two olive oil bottles on windowsill, one fresh vibrant gold one oxidized amber, calendar page beside, soft natural light, freshness and time concept still life',

  'olive-oil-daily-intake-dosage-science':
    'elegant wooden tablespoon filled with golden extra virgin olive oil resting on white linen, morning light casting soft shadow, minimalist dosage ritual photography',

  'olive-oil-health-benefits-science-complete':
    'lush Mediterranean breakfast scene: EVOO bottle, fresh olives, green vegetables, almonds, tomatoes, whole grain on white marble, health and vitality editorial flat lay',

  // ── 餐桌美學 Lifestyle ─────────────────────────────────────────
  'morning-ritual-evoo-metabolism':
    'morning ritual: white ceramic tablespoon of golden EVOO beside espresso cup on wooden tray, soft sunrise window light, fresh rosemary sprig, minimalist lifestyle photography',

  'olive-oil-ancient-egypt-ritual-heritage':
    'ancient alabaster vessel and terracotta amphora with golden oil, dried botanical elements, warm candlelight glow, archaeological museum aesthetic still life, warm amber tones',

  'olive-tree-ancient-civilization-heritage':
    'ancient gnarled millennial olive tree with massive twisted trunk, golden hour sunlight through silver-green leaves, Mediterranean landscape, wide angle heritage photography',

  'olive-oil-renaissance-art-science-history':
    'ornate Flemish-style still life with ceramic olive oil flask, dried herbs, old leather-bound books, candlelight on dark wooden table, chiaroscuro Old Master photography',

  'olive-oil-silk-road-trade-history':
    'weathered terracotta amphora with golden olive oil beside ancient map and compass, warm amber light, archaeological documentary photography, historical trading still life',

  // ── 美容與生活 ─────────────────────────────────────────────────
  'squalene-olive-oil-skin-beauty-molecular':
    'amber cosmetic vial of olive squalene beside fresh olive sprig on white marble, small green leaves, soft natural light close-up, luxury beauty ingredient still life',

  'mediterranean-diet-anti-aging-2026':
    'vibrant Mediterranean longevity food spread: EVOO bottle, colorful vegetables, fresh herbs, olive branch, ceramic bowls on white linen, warm golden natural light flat lay',

  'mediterranean-diet-anti-aging-women-2026':
    'Mediterranean morning wellness scene: golden olive oil, fresh figs, pomegranate, herbs, ceramic cup on terracotta tile, warm feminine lifestyle editorial photography',

  // ── 料理應用 ───────────────────────────────────────────────────
  'olive-oil-cooking-science-can-evoo-stir-fry':
    'cast iron skillet with golden olive oil shimmering on wooden kitchen surface, fresh garlic cloves and rosemary sprig beside, warm morning window light from side, Mediterranean home cooking still life, editorial food photography, no smoke no fire',


  // ── 新增 2026-05-05 ────────────────────────────────────────────
  'olive-oil-stir-fry-cancer-myth-debunked':
    'cast iron skillet with golden olive oil shimmering on worn wooden surface, fresh garlic and cherry tomatoes beside, warm morning kitchen window light, Mediterranean home cooking still life, reassuring and calm atmosphere, Kinfolk editorial food photography, film grain, no smoke, no flames, no text',

  'olive-oil-storage-refrigerator-taiwan-guide':
    'dark glass bottle of premium extra virgin olive oil placed inside a shadowy kitchen cabinet away from light, cool and calm interior atmosphere, soft diffused natural light, food preservation editorial concept, Kinfolk still life photography, muted earth tones, no text',

  'olive-oil-daily-intake-how-much':
    'white marble table with a premium extra virgin olive oil bottle and a measuring spoon beside a small shallow dish filled with golden olive oil, warm morning light, Mediterranean healthy lifestyle editorial, clean minimalist composition, Kinfolk food photography, no text',

  // ── 認證指南 ───────────────────────────────────────────────────
  'olive-oil-pdo-dop-igp-certification-guide':
    'three premium olive oil bottles with official PDO DOP IGP certification seals on aged oak shelf, Mediterranean terracotta tiles background, warm amber afternoon light, editorial product photography, European certification concept',
};

// ── Hero 圖片 Prompts ────────────────────────────────────────────
const HERO_PROMPTS = {
  homepage:
    'panoramic Mediterranean olive grove at golden hour sunrise, rows of ancient silver-green olive trees stretching to horizon, warm amber light filtering through leaves, wide cinematic landscape photography, serene and majestic',
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
