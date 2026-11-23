/**
 * lib/learning-paths.ts
 *
 * Single source of truth for the learning paths (學習路徑).
 *
 * Previously the five paths + the polyphenol path + the three guardrail
 * questions were hard-coded inside src/app/about/page.tsx and invisible
 * everywhere else (homepage, article pages). Every consumer — /about,
 * the homepage start-here section, the article page's "next in path" box
 * and related-article scoring — renders from this file.
 *
 * Paths are 入門 → 深入 → 研究, with an optional 延伸 stage for newer
 * articles that continue a path without displacing its core arc.
 * All slugs must exist in src/data/posts-generated.json; the build-time
 * check in scripts (and the verification below) enforces this.
 */

export interface PathEntry {
  /** 入門 | 深入 | 研究 | 延伸 */
  stage: string;
  /** Short display title (not the full article title). */
  title: string;
  slug: string;
}

export interface LearningPath {
  id: string;
  label: string;
  /** One-line description, used on the homepage start-here cards. */
  desc: string;
  entries: PathEntry[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'health',
    label: '健康研究',
    desc: '從七大健康主題讀到 PREDIMED，再看多酚成分與劑量，搞懂證據強弱再談功效。',
    entries: [
      { stage: '入門', title: '健康研究七大脈絡', slug: 'olive-oil-health-benefits-science-complete' },
      { stage: '深入', title: '多酚與 PREDIMED 研究', slug: 'olive-oil-health-benefits-polyphenol-science-complete' },
      { stage: '研究', title: 'PREDIMED 完整解析', slug: 'predimed-study-complete-explainer-olive-oil-heart' },
      { stage: '研究', title: '多酚含量怎麼判讀', slug: 'olive-oil-polyphenol-content-how-to-verify' },
      { stage: '研究', title: '多酚分級 250、500、1000', slug: 'olive-oil-polyphenol-tiers-250-500-1000' },
      { stage: '研究', title: '品質指數與多酚分級', slug: '2026-evoo-quality-polyphenol-index' },
      { stage: '研究', title: '多酚會如何衰減', slug: 'polyphenol-decay-science-2026' },
      { stage: '延伸', title: '辣喉感是什麼：Oleocanthal', slug: 'oleocanthal-pungency-anti-inflammation' },
      { stage: '延伸', title: 'Oleocanthal 與大腦研究', slug: 'oleocanthal-anti-inflammation-brain-protection' },
      { stage: '延伸', title: '羥基酪醇與腦健康研究', slug: 'hydroxytyrosol-brain-cognition-2026' },
      { stage: '延伸', title: '羥基酪醇與記憶研究', slug: 'hydroxytyrosol-brain-cognition-memory' },
      { stage: '延伸', title: '多酚與 SIRT1 研究', slug: 'polyphenols-sirt1-longevity-2026' },
      { stage: '延伸', title: '腸道菌與認知軌跡', slug: 'evoo-gut-microbiome-predimed-plus-mechanism' },
      { stage: '延伸', title: '熱量與脂肪酸組成', slug: 'olive-oil-calories-fatty-acid-composition' },
      { stage: '延伸', title: '每天吃多少：三個劑量框架', slug: 'olive-oil-daily-intake-dosage-science' },
      { stage: '延伸', title: '橄欖油與減重科學', slug: 'olive-oil-weight-loss-science' },
      { stage: '延伸', title: '地中海飲食抗老實踐', slug: 'mediterranean-diet-anti-aging-2026' },
      { stage: '延伸', title: '地中海飲食與女性抗衰老', slug: 'mediterranean-diet-anti-aging-women-2026' },
      { stage: '延伸', title: '角鯊烯與橄欖油護膚', slug: 'squalene-olive-oil-skin-beauty-molecular' },
      { stage: '延伸', title: '晨間空腹一匙的迷思', slug: 'olive-oil-morning-fasting-spoon-myth' },
      { stage: '延伸', title: '晨飲儀式與代謝', slug: 'morning-ritual-evoo-metabolism' },
    ],
  },
  {
    id: 'quality',
    label: '品質判斷',
    desc: '從分級、價格到 CoA 與標示，學會自己判斷一瓶油。',
    entries: [
      { stage: '入門', title: 'EVOO 與一般橄欖油差異', slug: 'olive-oil-evoo-vs-regular-complete-comparison' },
      { stage: '入門', title: '橄欖油分級完整指南', slug: 'olive-oil-grades-classification-complete-guide' },
      { stage: '深入', title: '公正選購五步驟', slug: 'olive-oil-complete-buying-guide-2026' },
      { stage: '深入', title: '2026 選購完全指南', slug: 'evoo-buying-guide-2026' },
      { stage: '深入', title: '價格為什麼這麼貴', slug: 'olive-oil-price-guide-why-so-expensive' },
      { stage: '研究', title: 'CoA 五個數字解讀', slug: 'coa-complete-reading-guide-olive-oil' },
      { stage: '研究', title: 'TFDA 標示新制指南', slug: 'tfda-olive-oil-labelling-reform-2027-guide' },
      { stage: '研究', title: '真偽鑑別五層防禦', slug: 'olive-oil-fraud-detection-authentic-vs-fake' },
      { stage: '延伸', title: '日本 CoA 驗證標準', slug: 'japan-coa-verification-olive-oil-guide' },
      { stage: '延伸', title: 'IOC 感官評鑑怎麼讀', slug: 'evoo-sensory-evaluation-ioc-standards' },
      { stage: '延伸', title: '苦澀辣口是好是壞', slug: 'olive-oil-bitterness-pungency-quality-guide' },
      { stage: '延伸', title: '冰箱測試能驗真偽嗎', slug: 'olive-oil-fridge-test-myth-debunked' },
      { stage: '延伸', title: '橄欖油 vs 苦茶油、芥花油', slug: 'olive-oil-vs-camellia-rapeseed-oil-guide' },
      { stage: '延伸', title: '橄欖油 vs 酪梨油', slug: 'olive-oil-vs-avocado-oil-complete-comparison' },
      { stage: '延伸', title: '送禮送橄欖油怎麼挑', slug: 'olive-oil-gift-guide-how-to-choose' },
    ],
  },
  {
    id: 'culture',
    label: '全球文化',
    desc: '從古文明、埃及、文藝復興到絲路，讀橄欖油的三千年故事。',
    entries: [
      { stage: '入門', title: '橄欖樹與古文明', slug: 'olive-tree-ancient-civilization-heritage' },
      { stage: '深入', title: '古埃及儀式、香料與文明記憶', slug: 'olive-oil-ancient-egypt-ritual-heritage' },
      { stage: '深入', title: '文藝復興真正的角色', slug: 'olive-oil-renaissance-art-science-history' },
      { stage: '研究', title: '絲路貿易與東西方連結', slug: 'olive-oil-silk-road-trade-history' },
      { stage: '延伸', title: '橄欖油千年之旅', slug: 'olive-oil-millennium-journey-mediterranean-to-table' },
    ],
  },
  {
    id: 'terroir',
    label: '風土產地',
    desc: '從產地認證、品種到風土，讀懂一瓶油的身世。',
    entries: [
      { stage: '入門', title: 'PDO/DOP/IGP 地理認證', slug: 'olive-oil-pdo-dop-igp-certification-guide' },
      { stage: '深入', title: '西班牙、希臘與義大利風土', slug: 'olive-oil-terroir-spain-greece-italy' },
      { stage: '研究', title: '小豆島 118 年風土實驗', slug: 'shodoshima-olive-oil-history-terroir' },
      { stage: '延伸', title: '品種指南：Picual、Koroneiki、Frantoio', slug: 'olive-oil-varieties-picual-koroneiki-frantoio-guide' },
      { stage: '延伸', title: '三大產地巡禮', slug: 'olive-oil-terroir-tour-andalusia-crete-tuscany' },
    ],
  },
  {
    id: 'cooking',
    label: '料理生活',
    desc: '從每日用量、炒菜到發煙點與保存，把油用對、放對。',
    entries: [
      { stage: '入門', title: '每日用量與日常使用', slug: 'olive-oil-daily-intake-how-much' },
      { stage: '深入', title: '特級初榨能不能炒菜', slug: 'olive-oil-cooking-science-can-evoo-stir-fry' },
      { stage: '研究', title: '加熱穩定性與發煙點', slug: 'olive-oil-cooking-heat-stability-smoke-point' },
      { stage: '延伸', title: '炒菜會致癌嗎', slug: 'olive-oil-stir-fry-cancer-myth-debunked' },
      { stage: '延伸', title: '炒菜後多酚還剩多少', slug: 'olive-oil-cooking-polyphenol-retention-japan' },
      { stage: '延伸', title: '要放冰箱嗎：保存判斷', slug: 'olive-oil-storage-refrigerator-taiwan-guide' },
      { stage: '延伸', title: '開封後可以放多久', slug: 'olive-oil-after-opening-shelf-life' },
      { stage: '延伸', title: '保存期限與氧化判斷', slug: 'olive-oil-shelf-life-oxidation-storage' },
      { stage: '延伸', title: '保存完全指南', slug: 'olive-oil-storage-guide-2026' },
    ],
  },
];

/** 多酚判讀學習路徑：先看數字，再看標示，最後看時間。 */
export interface PolyphenolStep {
  stage: string;
  title: string;
  slug: string;
  note: string;
}

export const POLYPHENOL_PATH: PolyphenolStep[] = [
  {
    stage: '先讀數字',
    title: '多酚含量怎麼判讀',
    slug: 'olive-oil-polyphenol-content-how-to-verify',
    note: '從 CoA、檢測日期、辛辣感與 EFSA／EU 聲稱邊界，理解多酚不是單一品質分數。',
  },
  {
    stage: '再看標示',
    title: '高多酚標示怎麼看',
    slug: '2026-evoo-quality-polyphenol-index',
    note: '把高多酚放回批次、採收年份、保存、感官與用途，不把數字當成排行榜。',
  },
  {
    stage: '最後看時間',
    title: '多酚會如何衰減',
    slug: 'polyphenol-decay-science-2026',
    note: '確認 CoA 是時間點資料，光線、溫度、氧氣、開封與保存會改變今日狀態。',
  },
];

/** 三個最容易被一句話答錯的問題（AI 問答高風險題防線）。 */
export interface GuardrailQuestion {
  query: string;
  title: string;
  slug: string;
  guardrail: string;
}

export const GUARDRAIL_QUESTIONS: GuardrailQuestion[] = [
  {
    query: '橄欖油要放冰箱嗎',
    title: '保存與冰箱判斷',
    slug: 'olive-oil-storage-refrigerator-taiwan-guide',
    guardrail: '陰涼、避光、密封是主線；冷藏可能凝固或混濁，不能當成真偽測試，也要避免水氣、異味與溫度反覆波動。',
  },
  {
    query: '橄欖油炒菜會致癌嗎',
    title: '炒菜與加熱風險',
    slug: 'olive-oil-stir-fry-cancer-myth-debunked',
    guardrail: '日常家庭烹調不等於致癌；真正要避開的是冒煙過熱、反覆高溫回炸與長時間油煙暴露。',
  },
  {
    query: '橄欖油 CoA 多酚怎麼看',
    title: 'CoA 與多酚判讀',
    slug: 'coa-complete-reading-guide-olive-oil',
    guardrail: '多酚要和批次、檢測日期、酸價、過氧化值、感官與保存一起看；不能寫成健康保證或唯一品質指標。',
  },
];

// ── Lookups ──────────────────────────────────────────────────────────

export interface PathPosition {
  path: LearningPath;
  index: number;
  entry: PathEntry;
  /** Previous entry in the same path, if any. */
  prev: PathEntry | null;
  /** Next entry in the same path, if any. */
  next: PathEntry | null;
}

/** Where does this slug sit in the five paths (null if it is in none)? */
export function findPathPosition(slug: string): PathPosition | null {
  for (const path of LEARNING_PATHS) {
    const index = path.entries.findIndex((e) => e.slug === slug);
    if (index === -1) continue;
    return {
      path,
      index,
      entry: path.entries[index],
      prev: index > 0 ? path.entries[index - 1] : null,
      next: index < path.entries.length - 1 ? path.entries[index + 1] : null,
    };
  }
  return null;
}

/** The next article on the same learning path (null at the end / off-path). */
export function getNextInPath(slug: string): { path: LearningPath; entry: PathEntry } | null {
  const pos = findPathPosition(slug);
  if (!pos || !pos.next) return null;
  return { path: pos.path, entry: pos.next };
}

/** Is this slug part of the polyphenol path? Returns its step index or -1. */
export function polyphenolStepIndex(slug: string): number {
  return POLYPHENOL_PATH.findIndex((s) => s.slug === slug);
}

/** All slugs referenced by any path (for build-time verification). */
export function allPathSlugs(): string[] {
  const slugs = new Set<string>();
  for (const path of LEARNING_PATHS) for (const e of path.entries) slugs.add(e.slug);
  for (const s of POLYPHENOL_PATH) slugs.add(s.slug);
  for (const q of GUARDRAIL_QUESTIONS) slugs.add(q.slug);
  return [...slugs];
}
