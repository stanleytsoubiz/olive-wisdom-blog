#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════
 * 🎨 Olive Wisdom — 品牌封面圖一次性生成腳本
 *
 * 架構理念：「生成一次，永久擁有」
 *   - 以 Pollinations.ai (Flux model) 生成品牌一致的 AI 封面圖
 *   - 下載圖片至 public/images/covers/ — 成為 repo 靜態資產
 *   - 更新 images.json 指向本地路徑（/images/covers/[slug].jpg）
 *   - Cloudflare CDN 直接服務，零外部依賴、零維護成本
 *
 * 執行：node scripts/generate-covers.js [--dry-run] [--slug=xxx] [--force]
 *   --dry-run        只印出 prompt，不下載
 *   --slug=xxx       只重新生成特定文章
 *   --force          強制重新生成（即使檔案已存在）
 *   --hero           同時重新生成 hero 圖片
 *
 * 無需任何 API Key。
 * ══════════════════════════════════════════════════════════════════
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

// ── 品牌 DNA 後綴（所有圖片統一風格）──────────────────────────
const BRAND_DNA = 'olive wisdom brand editorial style, dark moody background deep olive green #1A2A1C, warm gold accent light #A8894A, premium mediterranean lifestyle photography, cinematic 16:9 aspect ratio, photorealistic high quality, no text no watermark no logo';

// ── 文章封面圖 Prompt 對應表 ────────────────────────────────────
const COVER_PROMPTS = {
  // ── 科學萃取 Science ───────────────────────────────────────────
  'polyphenols-sirt1-longevity-2026':
    'glowing DNA double helix surrounded by olive oil polyphenol molecules, SIRT1 longevity gene activation concept, bioluminescent molecular structure, scientific visualization macro',

  'hydroxytyrosol-brain-cognition-memory':
    'human brain neural network glowing synapses golden light, olive branch molecular structure overlay, cognition memory enhancement concept, neuroscience visualization',

  'hydroxytyrosol-brain-cognition-2026':
    'advanced neuroscience brain scan 2026, hydroxytyrosol antioxidant molecules crossing blood-brain barrier, golden bioluminescent neurons, scientific medical photography',

  'oleocanthal-anti-inflammation-brain-protection':
    'brain silhouette with anti-inflammation golden shield, oleocanthal molecules forming protective barrier, mediterranean olive branch overlay, dramatic dark background medical art',

  'oleocanthal-pungency-anti-inflammation':
    'extreme macro fresh green olive cold-pressed, golden-green oil droplet suspended in air, molecular pungency concept, dramatic split cinematic lighting',

  'olive-oil-polyphenol-content-how-to-verify':
    'laboratory glass tubes golden olive oil samples, polyphenol analysis scientific equipment, precision measurement certificate of analysis, clean clinical food science',

  'polyphenol-decay-science-2026':
    'olive oil bottle UV light oxidation decay concept, time-lapse molecular degradation visualization, polyphenol half-life science, before after quality comparison',

  '2026-evoo-quality-polyphenol-index':
    'premium extra virgin olive oil quality index 2026, molecular polyphenol content visualization data, artisan dark bottle close-up with scientific overlay, precision measurement',

  // ── 品味鑑賞 Health / Selection ────────────────────────────────
  'evoo-sensory-evaluation-ioc-standards':
    'professional olive oil sommelier tasting cobalt blue glass, sensory evaluation expert close-up, IOC standard evaluation, luxury food photography warm studio light',

  'evoo-buying-guide-2026':
    'curated selection premium extra virgin olive oil artisan dark bottles, elegant luxury product display, harvest date visible, expert curation food styling',

  'olive-oil-complete-buying-guide-2026':
    'definitive olive oil buying guide 2026, multiple premium dark glass bottles arranged by quality tier, polyphenol certificates spread on marble, expert sommelier guidance',

  'olive-oil-fraud-detection-authentic-vs-fake':
    'authentic vs counterfeit olive oil bottles side by side comparison, magnifying glass forensic examination, dramatic investigative split lighting, truth revealed concept',

  'olive-oil-terroir-spain-greece-italy':
    'triptych three mediterranean olive grove landscapes at golden hour, Spain Jaen hills Greece Koroneiki trees Italy Puglia, terroir concept wine-like, cinematic wide angle',

  // ── 餐桌美學 Lifestyle ──────────────────────────────────────────
  'morning-ritual-evoo-metabolism':
    'elegant morning ritual golden EVOO spoonful ceramic spoon, soft sunlight streaming through window, minimalist Japanese-inspired lifestyle, wooden table fresh herbs bokeh',

  'squalene-olive-oil-skin-beauty-molecular':
    'luminous glowing skin close-up golden olive oil droplet on cheek, squalene skin barrier molecular beauty concept, luxury beauty editorial soft diffused light',

  'mediterranean-diet-anti-aging-2026':
    'vibrant mediterranean diet anti-aging table 2026, colorful vegetables fish olive oil legumes nuts arrangement, telomere longevity concept, warm golden lifestyle editorial',

  'mediterranean-diet-anti-aging-women-2026':
    'elegant mediterranean woman 35 plus radiant health, colorful anti-aging food spread olive oil center, longevity lifestyle concept, warm afternoon light editorial',

  'olive-oil-storage-guide-2026':
    'premium olive oil dark glass bottle in cool dark pantry shelf, temperature and light protection concept, elegant kitchen organization, UV protection diagram overlay, lifestyle',

  'olive-oil-vs-avocado-oil-complete-comparison':
    'olive oil versus avocado oil scientific comparison, two premium dark bottles side by side on white marble, fresh olives and avocado halves, molecular polyphenol comparison editorial',

  // ── 知性史詩 Culture / Heritage ────────────────────────────────
  'olive-tree-ancient-civilization-heritage':
    'ancient gnarled thousand-year-old olive tree dramatic golden sunset, stone ruins Mediterranean civilization, epic landscape history, cinematic atmosphere heritage',

  'olive-oil-ancient-egypt-ritual-heritage':
    'ancient egypt olive oil ceremony ritual stone altar, hieroglyphics carved wall golden amphorae, torch lit temple 3000 BCE, archaeological documentary cinematic amber',

  'olive-oil-renaissance-art-science-history':
    'renaissance workshop Florence olive oil lamp candle chiaroscuro light, Leonardo da Vinci style manuscripts olive branch, antique scientific instruments, Italian art history',

  'olive-oil-silk-road-trade-history':
    'ancient silk road caravan desert sunset, amphora olive oil traded goods camels, Mediterranean to Asia trade route epic landscape, cinematic historical documentary',

  'olive-oil-terroir-spain-greece-italy':
    'triptych mediterranean olive grove landscapes golden hour, Spain Greece Italy terroir, ancient trees cinematic wide angle, geographic origin concept',

  // ── Hero 頁面圖 ─────────────────────────────────────────────────
  '__hero_homepage':
    'stunning overhead flat lay premium olive oil bottle fresh olives mediterranean herbs, warm golden editorial photography, luxury lifestyle concept, dark marble background',

  '__hero_blog':
    'beautiful mediterranean olive grove morning mist golden hour light through leaves, aerial cinematic wide angle, tuscany landscape, travel food photography',

  '__hero_about':
    'close-up fresh pressed olive oil golden surface ripples, mediterranean knowledge elegance concept, warm editorial tone, fine dining luxury photography',
};

// ── 設定 ───────────────────────────────────────────────────────
const COVERS_DIR    = path.join(__dirname, '..', 'public', 'images', 'covers');
const IMAGES_JSON   = path.join(__dirname, '..', 'public', 'data', 'images.json');
const IMAGE_WIDTH   = 1200;
const IMAGE_HEIGHT  = 630;
const MODEL         = 'flux';
const DELAY_MS      = 35000; // Pollinations.ai rate limit buffer (free tier: ~30s cooldown)

// ── CLI 參數 ────────────────────────────────────────────────────
const args      = process.argv.slice(2);
const DRY_RUN   = args.includes('--dry-run');
const FORCE     = args.includes('--force');
const DO_HERO   = args.includes('--hero');
const SLUG_ARG  = (args.find(a => a.startsWith('--slug=')) || '').replace('--slug=', '');

function log(msg)  { console.log(`[${new Date().toISOString().slice(11,19)}] ${msg}`); }
function warn(msg) { console.warn(`⚠️  ${msg}`); }

// ── deterministic seed from slug ───────────────────────────────
function slugSeed(slug) {
  return Math.abs(slug.split('').reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0)) % 90000 + 10000;
}

// ── Pollinations URL 建構 ───────────────────────────────────────
function pollinationsUrl(prompt, seed, w = IMAGE_WIDTH, h = IMAGE_HEIGHT) {
  const full = `${prompt}, ${BRAND_DNA}`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?width=${w}&height=${h}&model=${MODEL}&seed=${seed}&nologo=true&enhance=true`;
}

// ── 下載圖片 → Buffer ──────────────────────────────────────────
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 60000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── 主流程 ─────────────────────────────────────────────────────
async function main() {
  log('════════════════════════════════════════════════════');
  log('🎨 Olive Wisdom 品牌封面圖生成器 v2.0');
  log(`模式: ${DRY_RUN ? 'DRY_RUN（僅預覽 prompt）' : '實際下載'} | FORCE=${FORCE}`);
  log('════════════════════════════════════════════════════');

  // 建立輸出目錄
  if (!fs.existsSync(COVERS_DIR)) {
    fs.mkdirSync(COVERS_DIR, { recursive: true });
    log(`📁 建立目錄: ${COVERS_DIR}`);
  }

  // 讀取 images.json
  const imagesData = JSON.parse(fs.readFileSync(IMAGES_JSON, 'utf-8'));

  // 決定要處理的 slugs
  let slugs = Object.keys(COVER_PROMPTS).filter(s => !s.startsWith('__hero'));
  if (SLUG_ARG) slugs = slugs.filter(s => s === SLUG_ARG);
  if (DO_HERO) slugs = Object.keys(COVER_PROMPTS);

  const results = { success: [], skip: [], fail: [] };

  for (const slug of slugs) {
    const isHero  = slug.startsWith('__hero_');
    const heroKey = isHero ? slug.replace('__hero_', '') : null;
    const prompt  = COVER_PROMPTS[slug];
    const seed    = slugSeed(slug);
    const outFile = path.join(COVERS_DIR, `${slug}.jpg`);
    const localPath = `/images/covers/${slug}.jpg`;

    // 跳過已存在（除非 --force）
    if (!FORCE && fs.existsSync(outFile)) {
      log(`  ⏭️  跳過（已存在）: ${slug}`);
      results.skip.push(slug);
      continue;
    }

    const url = pollinationsUrl(prompt, seed);
    log(`\n🎨 [${slug}]`);
    log(`   prompt: ${prompt.slice(0, 80)}…`);
    log(`   seed: ${seed} | url: ${url.slice(0, 80)}…`);

    if (DRY_RUN) {
      log(`   DRY_RUN — 跳過下載`);
      results.skip.push(slug);
      continue;
    }

    // ── 最多重試 3 次（429 自動退避）──────────────────────
    let buf = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        log(`   ⬇️  下載中… (attempt ${attempt}/3)`);
        buf = await downloadImage(url);
        break;
      } catch (e) {
        const is429 = e.message.includes('429');
        if (attempt < 3) {
          const wait = is429 ? 45000 : 10000;
          warn(`   retry ${attempt}: ${e.message} → 等待 ${wait/1000}s`);
          await sleep(wait);
        } else {
          throw e;
        }
      }
    }

    try {
      if (!buf) throw new Error('no buffer');
      fs.writeFileSync(outFile, buf);
      log(`   ✅ 儲存完成: ${outFile} (${(buf.length / 1024).toFixed(0)} KB)`);

      // 更新 images.json
      if (isHero) {
        imagesData.hero[heroKey] = {
          ...imagesData.hero[heroKey],
          url: localPath,
          source: 'pollinations_ai_local',
          prompt,
          generated_at: new Date().toISOString().split('T')[0],
          quality_score: 8.5,
        };
      } else {
        imagesData.posts[slug] = {
          ...imagesData.posts[slug],
          url: localPath,
          alt: imagesData.posts[slug]?.alt || slug,
          source: 'pollinations_ai_local',
          prompt,
          generated_at: new Date().toISOString().split('T')[0],
          quality_score: 8.5,
        };
      }

      results.success.push(slug);
    } catch (e) {
      warn(`   ❌ 失敗: ${e.message}`);
      results.fail.push(slug);
    }

    // 間隔避免 rate limit
    if (slugs.indexOf(slug) < slugs.length - 1) {
      log(`   ⏳ 等待 ${DELAY_MS / 1000}s…`);
      await sleep(DELAY_MS);
    }
  }

  // 更新 images.json meta
  if (!DRY_RUN && results.success.length > 0) {
    imagesData._meta.lastUpdated = new Date().toISOString().split('T')[0];
    imagesData._meta.last_updated = new Date().toISOString();
    imagesData._meta.brand_covers = {
      last_run: new Date().toISOString(),
      generated: results.success.length,
      total_articles: slugs.length,
    };
    fs.writeFileSync(IMAGES_JSON, JSON.stringify(imagesData, null, 2), 'utf-8');
    log(`\n✅ images.json 已更新`);
  }

  // 報告
  log('\n════════════════════════════════════════════════════');
  log(`✅ 成功: ${results.success.length} 張`);
  log(`⏭️  跳過: ${results.skip.length} 張（已存在或 dry-run）`);
  log(`❌ 失敗: ${results.fail.length} 張`);
  if (results.fail.length > 0) {
    log(`失敗清單: ${results.fail.join(', ')}`);
  }
  if (!DRY_RUN && results.success.length > 0) {
    log('\n📋 下一步：');
    log('   git add public/images/covers/ public/data/images.json');
    log('   git commit -m "🎨 brand covers: AI 品牌封面圖一次性生成"');
    log('   git push origin main');
  }
  log('════════════════════════════════════════════════════');
}

main().catch(e => { console.error(e); process.exit(1); });
