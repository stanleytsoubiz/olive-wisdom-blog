#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════
 * 🏆 Layer 3：Olive Wisdom 智能圖片自動更新腳本
 *
 * 執行流程：
 *   1. 讀取 public/data/images.json（圖片元資料）
 *   2. 依 Layer 2 評分邏輯計算每張圖的品質分數
 *   3. 找出分數 < SCORE_THRESHOLD 的圖片
 *   4. 依 ARTICLE_IMAGE_PROMPTS 取得精準 prompt
 *   5. 呼叫 Skywork Image API 生成新圖
 *   6. 更新 images.json 並透過 GitHub API commit 回倉庫
 *   7. 輸出執行報告（供 GitHub Actions Summary）
 *
 * 環境變數（GitHub Secrets）：
 *   SKYWORK_API_KEY   — Skywork API Key（必填）
 *   GH_PAT            — GitHub Personal Access Token（必填，repo 權限）
 *   SCORE_THRESHOLD   — 低於此分數才觸發替換，預設 6
 *   MAX_REPLACE       — 單次最多替換張數，預設 5（防止消耗過多 API 配額）
 *   DRY_RUN           — 設為 true 則只分析不替換
 * ══════════════════════════════════════════════════════════════════
 */

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');

// ── 設定 ──────────────────────────────────────────────────────
const GH_PAT           = process.env.GH_PAT           || '';
const SCORE_THRESHOLD  = parseFloat(process.env.SCORE_THRESHOLD || '6');
const MAX_REPLACE      = parseInt(process.env.MAX_REPLACE      || '5', 10);
const DRY_RUN          = process.env.DRY_RUN === 'true';
const REPO_OWNER       = process.env.REPO_OWNER || 'stanleytsoubiz';
const REPO_NAME        = process.env.REPO_NAME  || 'olive-wisdom-blog';
const IMAGES_JSON_PATH = 'public/data/images.json';

// ── 精準視覺 Prompt 對應表（與 admin/index.html 同步）──────────
const ARTICLE_IMAGE_PROMPTS = {
  "polyphenols-sirt1-longevity-2026":
    "glowing DNA double helix surrounded by olive oil molecules, longevity science concept, green molecular structure, dark background, bioluminescent glow, scientific visualization, macro photography",
  "oleocanthal-pungency-anti-inflammation":
    "close-up fresh green olive being cold-pressed, golden-green oil droplet falling, macro photography, dark moody background, pungent sensation concept, cinematic dramatic lighting",
  "oleocanthal-anti-inflammation-brain-protection":
    "human brain silhouette glowing olive green light, anti-inflammation shield, neuroscience visualization, mediterranean olive branch overlay, dramatic dark background, artistic medical photography",
  "hydroxytyrosol-brain-cognition-memory":
    "neurons firing golden light, olive oil molecular structure overlay, brain cognition enhancement, glowing synapses, olive green gold tones, scientific macro photography, harvard lab aesthetic",
  "olive-oil-polyphenol-content-how-to-verify":
    "laboratory testing olive oil samples, polyphenol analysis equipment, scientific glass tubes golden liquid, precision measurement, clean clinical food science photography",
  "evoo-sensory-evaluation-ioc-standards":
    "professional olive oil tasting, expert smelling cobalt blue glass, sensory evaluation, white tablecloth, warm studio lighting, sommelier aesthetic, food photography",
  "morning-ritual-evoo-metabolism":
    "elegant morning ritual, golden extra virgin olive oil spoonful, white ceramic spoon, soft sunlight through window, minimalist lifestyle photography, wooden table, fresh herbs",
  "olive-oil-fraud-detection-authentic-vs-fake":
    "two olive oil bottles comparison authentic vs fake, magnifying glass revealing truth, laboratory forensic concept, dramatic split lighting, yellow warning tones, investigative photography",
  "evoo-buying-guide-2026":
    "curated premium extra virgin olive oil bottles collection, elegant retail display, dark glass artisan bottles, warm luxury product photography, golden hour light, food styling",
  "olive-oil-terroir-spain-greece-italy":
    "three mediterranean landscapes montage, olive grove terroir, Spain Greece Italy landmarks, golden sunset over ancient olive trees, travel food photography, cinematic wide shot",
  "squalene-olive-oil-skin-beauty-molecular":
    "woman luminous glowing skin, drops golden olive oil on cheek, beauty molecular concept, squalene skin barrier, luxury beauty photography, soft diffused lighting, elegance",
  "mediterranean-diet-anti-aging-women-2026":
    "vibrant mediterranean table spread, colorful vegetables fish olive oil herbs, elegant woman dining, anti-aging lifestyle, warm afternoon light, food lifestyle photography",
  "olive-tree-ancient-civilization-heritage":
    "ancient gnarled olive tree two thousand years old, dramatic golden sunset, stone wall ruins, historical Mediterranean civilization, epic landscape photography, cinematic atmosphere",
  "homepage":
    "stunning overhead flat lay premium olive oil bottle, fresh olives on branch, mediterranean herbs, warm golden light, luxury food photography, editorial style, dark marble background",
  "blog":
    "beautiful olive grove rows morning mist, golden hour light filtering leaves, tuscany landscape, aerial perspective, travel food photography, cinematic wide angle",
  "about":
    "close-up fresh pressed olive oil golden surface ripples, mediterranean lifestyle, knowledge elegance concept, warm editorial tone, fine dining photography",

  // ── 2026 年 新增文章 Prompts ────────────────────────────
  "2026-evoo-quality-polyphenol-index":
    "olive oil polyphenol molecular structure visualization, laboratory glass vials with golden liquid, scientific data charts on dark background, precision measurement aesthetic, extra virgin olive oil quality testing, high-tech science photography",
  "hydroxytyrosol-brain-cognition-2026":
    "neural network brain scan glowing olive green gold light, hydroxytyrosol molecular structure overlay, 2026 neuroscience research visualization, MRI brain with mediterranean olive branch, bioluminescent synapse photography, dark dramatic scientific",
  "mediterranean-diet-anti-aging-2026":
    "vibrant mediterranean diet 2026 anti-aging spread, colorful vegetables olive oil fish nuts legumes, telomere longevity concept elegant woman wellness, warm golden light editorial food photography, healthy aging lifestyle",
  "polyphenol-decay-science-2026":
    "olive oil oxidation time-lapse science concept, UV light penetrating glass bottle molecular decay, polyphenol half-life chemistry visualization, dark laboratory moody, before after quality comparison, scientific photography",
  "olive-oil-ancient-egypt-ritual-heritage":
    "ancient egypt olive oil ceremony ritual, hieroglyphics stone wall golden amphora, torch lit temple atmosphere 3000 BCE, archaeological heritage documentary, cinematic warm amber tones, historical food photography",
  "olive-oil-renaissance-art-science-history":
    "renaissance workshop painting olive oil lamp candle, Leonardo da Vinci manuscripts olive branch motif, antique books art history, warm amber chiaroscuro light, italian renaissance aesthetic documentary",
  "olive-oil-silk-road-trade-history":
    "ancient silk road merchant caravan desert sunset amphora olive oil trade, Mediterranean to Asia route, camels historical journey, dramatic golden dusk cinematic landscape, historical documentary photography",
  "olive-oil-storage-guide-2026":
    "premium olive oil dark glass bottle cool dark pantry storage, temperature light oxygen protection concept, elegant kitchen organization, UV rays blocked diagram, proper storage lifestyle photography, warm moody ambient light",
  "olive-oil-vs-avocado-oil-complete-comparison":
    "olive oil versus avocado oil scientific comparison flat lay, both dark bottles side by side white marble, fresh olives avocado halves, polyphenol molecular comparison, editorial food science photography",
  "olive-oil-complete-buying-guide-2026":
    "premium extra virgin olive oil buying guide 2026, multiple artisan dark glass bottles arranged elegantly, harvest date certificate of analysis visible, moody editorial product photography, olive green gold palette, expert curation"
};

const BRAND_SUFFIX = 'extra virgin olive oil, professional photography, warm mediterranean light, 16:9 cinematic';

// ── 工具函式 ──────────────────────────────────────────────────
function log(msg) { console.log(`[${new Date().toISOString().slice(11,19)}] ${msg}`); }
function warn(msg) { console.warn(`⚠️  ${msg}`); }
function die(msg)  { console.error(`❌ ${msg}`); process.exit(1); }

/** HTTP/HTTPS GET → Buffer */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

/** HTTPS POST with JSON body */
function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const data = typeof body === 'string' ? body : JSON.stringify(body);
    const req = https.request({ hostname, path, method: 'POST', headers: { ...headers, 'Content-Length': Buffer.byteLength(data) } }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ── Layer 2 評分邏輯（Node.js 版本，與前端同步）──────────────
function calcScore(key, val) {
  let score = 0;
  const sourceScore = { skywork_ai: 5, pollinations_ai: 7.0, unsplash: 2.5, unsplash_source: 1, manual: 3 };
  score += (sourceScore[val.source] ?? 2);

  const hasPrecise = !!ARTICLE_IMAGE_PROMPTS[key];
  const hasAny     = val.prompt && val.prompt.length > 5;
  if (hasPrecise) score += 2;
  else if (hasAny) score += 1;

  if (val.generated_at) {
    const days = (Date.now() - new Date(val.generated_at)) / 86400000;
    if (days <= 30) score += 1;
    else if (days <= 90) score += 0.5;
  }

  if (ARTICLE_IMAGE_PROMPTS[key]) score += 1.5;
  else if (val.prompt) {
    const kw = key.replace(/-/g,' ').split(' ').filter(w => w.length > 3);
    const overlap = kw.filter(w => (val.prompt||'').toLowerCase().includes(w)).length;
    score += Math.min(2, overlap * 0.5);
  }

  return Math.min(10, Math.max(1, Math.round(score * 10) / 10));
}

// ── Pollinations.ai 圖片生成（零 API Key）────────────────────
async function generateImage(prompt, key) {
  const seed = Math.abs(key.split('').reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0)) % 9000 + 1000;
  const encodedPrompt = encodeURIComponent(prompt + ', extra virgin olive oil, professional photography, warm mediterranean light, 16:9 cinematic');
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&model=flux&seed=${seed}&nologo=true`;
  log(`  🎨 Pollinations.ai: ${key} | seed=${seed}`);
  // Pollinations generates on-demand — verify URL is accessible
  try {
    const check = await httpGet(`https://image.pollinations.ai/prompt/${encodedPrompt}?width=1&height=1&model=flux&seed=${seed}&nologo=true`);
    if (check.status === 200) return url;
    warn(`Pollinations 回傳 ${check.status}`);
    return null;
  } catch (e) {
    warn(`Pollinations 驗證失敗: ${e.message}`);
    // Return URL anyway — might work at full resolution
    return url;
  }
}

// ── GitHub API：讀取檔案（含 SHA）────────────────────────────
async function ghGetFile(filePath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
      headers: {
        'Authorization': `token ${GH_PAT}`,
        'User-Agent':    'OliveWisdom-AutoRefresh/1.0',
        'Accept':        'application/vnd.github.v3+json'
      }
    };
    https.get(options, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`GitHub GET ${res.statusCode}`));
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      });
    }).on('error', reject);
  });
}

// ── GitHub API：更新檔案 ─────────────────────────────────────
async function ghUpdateFile(filePath, content, sha, message) {
  const encoded = Buffer.from(content).toString('base64');
  const res = await httpsPost('api.github.com',
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    {
      'Authorization': `token ${GH_PAT}`,
      'User-Agent':    'OliveWisdom-AutoRefresh/1.0',
      'Accept':        'application/vnd.github.v3+json',
      'Content-Type':  'application/json'
    },
    { message, content: encoded, sha }
  );
  return JSON.parse(res.body);
}

// ── 主流程 ───────────────────────────────────────────────────
async function main() {
  log('════════════════════════════════════════');
  log('🏆 Olive Wisdom 智能圖片自動更新 v1.0');
  log(`模式: ${DRY_RUN ? 'DRY_RUN（只分析不替換）' : '實際替換模式'}`);
  log(`閾值: score < ${SCORE_THRESHOLD}  最大替換: ${MAX_REPLACE} 張`);
  log('════════════════════════════════════════');

  if (!GH_PAT)                      die('缺少 GH_PAT 環境變數');

  // ① 讀取 images.json（從 GitHub 確保最新版本）
  log('📥 從 GitHub 讀取 images.json…');
  let fileInfo, imagesData;
  try {
    fileInfo = await ghGetFile(IMAGES_JSON_PATH);
    imagesData = JSON.parse(Buffer.from(fileInfo.content, 'base64').toString());
  } catch(e) {
    // fallback: 讀取本地檔案
    warn(`GitHub 讀取失敗（${e.message}），改用本地檔案`);
    const localPath = path.join(__dirname, '..', IMAGES_JSON_PATH);
    imagesData = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
  }
  log(`✅ 載入完成：${Object.keys(imagesData.hero||{}).length} Hero + ${Object.keys(imagesData.posts||{}).length} Posts`);

  // ② 評分所有圖片
  log('\n📊 評分分析中…');
  const allItems = [];
  Object.entries(imagesData.hero  || {}).forEach(([k, v]) => allItems.push({ section:'hero',  key:k, val:v }));
  Object.entries(imagesData.posts || {}).forEach(([k, v]) => allItems.push({ section:'posts', key:k, val:v }));

  allItems.forEach(item => {
    item.score = calcScore(item.key, item.val);
    item.val.quality_score = item.score;
    const tier = item.score >= 8 ? '🟢' : item.score >= 6 ? '🟡' : '🔴';
    log(`  ${tier} ${item.key.padEnd(50)} score=${item.score}`);
  });

  // ③ 篩選需補強圖片
  const needUpgrade = allItems
    .filter(i => i.score < SCORE_THRESHOLD)
    .sort((a, b) => a.score - b.score)  // 最差的先處理
    .slice(0, MAX_REPLACE);

  log(`\n🔴 需補強：${needUpgrade.length} 張（分數 < ${SCORE_THRESHOLD}）`);

  if (needUpgrade.length === 0) {
    log('✅ 所有圖片品質達標！無需替換。');
    writeSummary(allItems, []);
    return;
  }

  if (DRY_RUN) {
    log('\n🔵 DRY_RUN 模式：以下圖片將被替換（實際未執行）');
    needUpgrade.forEach(i => log(`  - [${i.section}/${i.key}] score=${i.score}`));
    writeSummary(allItems, needUpgrade, true);
    return;
  }

  // ④ 逐一替換
  log('\n✨ 開始替換低分圖片…');
  const replaced = [];
  for (const item of needUpgrade) {
    const { section, key, val } = item;
    const prompt = ARTICLE_IMAGE_PROMPTS[key]
      || (val.prompt && val.prompt.length > 10 ? val.prompt : null)
      || `${key.replace(/-/g,' ')} ${BRAND_SUFFIX}`;

    try {
      const newUrl = await generateImage(prompt, key);
      if (newUrl) {
        const today = new Date().toISOString().split('T')[0];
        const target = section === 'hero' ? imagesData.hero[key] : imagesData.posts[key];
        target.url          = newUrl;
        target.source       = 'pollinations_ai';
        target.prompt       = prompt;
        target.generated_at = today;
        target.quality_score = 8.5;  // 新生成 = 高分
        replaced.push({ ...item, newUrl });
        log(`  ✅ 替換成功：${key} → ${newUrl.slice(0,60)}…`);
      } else {
        warn(`生成失敗（無 file_url）：${key}`);
      }
    } catch(e) {
      warn(`生成異常：${key} — ${e.message}`);
    }

    // 間隔 3 秒，避免 API 過載
    if (needUpgrade.indexOf(item) < needUpgrade.length - 1) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  if (replaced.length === 0) {
    warn('所有替換均失敗，跳過 GitHub commit');
    process.exit(1);
  }

  // ⑤ 更新 _meta
  imagesData._meta = imagesData._meta || {};
  imagesData._meta.version       = '2.0.0';
  imagesData._meta.last_updated  = new Date().toISOString();
  imagesData._meta.auto_refresh  = {
    last_run:     new Date().toISOString(),
    replaced:     replaced.length,
    score_threshold: SCORE_THRESHOLD
  };

  // ⑥ 儲存更新後的 images.json
  const newContent = JSON.stringify(imagesData, null, 2);
  const useGit = process.env.USE_GIT_COMMIT === 'true';

  if (useGit) {
    // Git 模式：寫到 /tmp/images_updated.json，由 workflow 的 git commit 步驟推送
    log('\n📤 寫入 /tmp/images_updated.json（由 workflow git push）…');
    fs.writeFileSync('/tmp/images_updated.json', newContent, 'utf-8');
    // 同時直接更新本地工作目錄的檔案（讓 git diff 能偵測到）
    const localPath = path.join(__dirname, '..', IMAGES_JSON_PATH);
    fs.writeFileSync(localPath, newContent, 'utf-8');
    log(`✅ 本地檔案已更新（${replaced.length} 張），等待 workflow git commit`);
  } else {
    // GitHub API 模式（備用）
    log('\n📤 透過 GitHub API Commit 更新…');
    const commitMsg = `🤖 auto: 智能圖片更新 ${replaced.length}/${needUpgrade.length} 張 (score < ${SCORE_THRESHOLD})\n\n替換清單：\n${replaced.map(i=>`- ${i.section}/${i.key} (${i.score}分 → 8.5分)`).join('\n')}\n\n由 GitHub Actions 自動執行`;
    try {
      const sha = fileInfo ? fileInfo.sha : (await ghGetFile(IMAGES_JSON_PATH)).sha;
      await ghUpdateFile(IMAGES_JSON_PATH, newContent, sha, commitMsg);
      log(`✅ GitHub API commit 成功（${replaced.length} 張已更新）`);
    } catch(e) {
      // API commit 失敗時，退回寫本地檔案讓 workflow 處理
      warn(`GitHub API commit 失敗（${e.message}），改寫本地檔案`);
      const localPath = path.join(__dirname, '..', IMAGES_JSON_PATH);
      fs.writeFileSync(localPath, newContent, 'utf-8');
      fs.writeFileSync('/tmp/images_updated.json', newContent, 'utf-8');
    }
  }

  writeSummary(allItems, replaced, false);
  log('\n🎉 自動更新完成！');
}

// ── GitHub Actions Summary 報告 ──────────────────────────────
function writeSummary(allItems, replaced, isDryRun = false) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;

  const excellent = allItems.filter(i => i.score >= 8).length;
  const medium    = allItems.filter(i => i.score >= 6 && i.score < 8).length;
  const poor      = allItems.filter(i => i.score < 6).length;

  const lines = [
    '## 🏆 Olive Wisdom 智能圖片品質報告',
    '',
    `> 執行時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}  ${isDryRun ? '| **DRY_RUN 模式**' : ''}`,
    '',
    '### 📊 品質分佈',
    '',
    `| 等級 | 數量 | 百分比 |`,
    `|------|------|--------|`,
    `| 🟢 優秀 (8-10) | ${excellent} | ${Math.round(excellent/allItems.length*100)}% |`,
    `| 🟡 普通 (6-7)  | ${medium}   | ${Math.round(medium/allItems.length*100)}% |`,
    `| 🔴 需補強 (<6) | ${poor}     | ${Math.round(poor/allItems.length*100)}% |`,
    '',
    '### 📋 全部圖片評分',
    '',
    '| 圖片 | 分區 | 分數 | 來源 | 狀態 |',
    '|------|------|------|------|------|',
    ...allItems.map(i => {
      const tier = i.score >= 8 ? '🟢' : i.score >= 6 ? '🟡' : '🔴';
      const wasReplaced = replaced.some(r => r.key === i.key);
      const status = wasReplaced ? '✅ 已替換' : (isDryRun && i.score < SCORE_THRESHOLD ? '🔵 待替換' : '');
      return `| \`${i.key}\` | ${i.section} | ${tier} ${i.score} | ${i.val.source||'?'} | ${status} |`;
    }),
    '',
    replaced.length > 0
      ? `### ✅ 已替換 ${replaced.length} 張圖片\n\n${replaced.map(r => `- \`${r.key}\`: ${r.score}分 → 8.5分`).join('\n')}`
      : poor === 0 ? '### ✅ 所有圖片品質達標，無需替換！' : '### ⚠️ 無圖片被替換（DRY_RUN 或替換失敗）',
  ];

  fs.writeFileSync(summaryPath, lines.join('\n'), 'utf-8');
  log('📋 GitHub Actions Summary 已寫入');
}

main().catch(e => { console.error(e); process.exit(1); });
