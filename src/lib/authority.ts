import type { PostFrontmatter } from '@/lib/posts';

export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

export const LEARNING_LEVELS: Record<LearningLevel, {
  label: string;
  shortLabel: string;
  description: string;
  publicLabel: string;
  publicShortLabel: string;
  publicDescription: string;
}> = {
  beginner: {
    label: '初級入門',
    shortLabel: '初級',
    description: '適合剛開始認識橄欖油的讀者，先建立選購、保存、日常使用與基本風味判斷。',
    publicLabel: '先建立基本判斷',
    publicShortLabel: '入門判斷',
    publicDescription: '從選購、保存、日常使用與基本風味開始，建立安心使用橄欖油的第一套判斷。',
  },
  intermediate: {
    label: '中級理解',
    shortLabel: '中級',
    description: '適合已經會使用橄欖油、想理解品質、產地、認證與料理科學的讀者。',
    publicLabel: '深入品質與應用',
    publicShortLabel: '深入應用',
    publicDescription: '把品質、產地、認證、料理科學與餐桌應用連起來，讓日常使用更有根據。',
  },
  advanced: {
    label: '高級研究',
    shortLabel: '高級',
    description: '適合需要引用、研究或建立專業判斷的人，聚焦臨床研究、化學成分與證據邊界。',
    publicLabel: '研究與證據理解',
    publicShortLabel: '研究證據',
    publicDescription: '整理臨床研究、化學成分與健康聲稱邊界，幫助讀者看懂證據而不被行銷帶走。',
  },
};

export const HIGH_CITATION_SLUGS = [
  'olive-oil-complete-buying-guide-2026',
  'olive-oil-cooking-science-can-evoo-stir-fry',
  'olive-oil-stir-fry-cancer-myth-debunked',
  'olive-oil-cooking-heat-stability-smoke-point',
  'olive-oil-storage-refrigerator-taiwan-guide',
  'olive-oil-daily-intake-how-much',
  'olive-oil-evoo-vs-regular-complete-comparison',
  'olive-oil-polyphenol-content-how-to-verify',
  '2026-evoo-quality-polyphenol-index',
  'polyphenol-decay-science-2026',
  'coa-complete-reading-guide-olive-oil',
  'olive-oil-fraud-detection-authentic-vs-fake',
  'predimed-study-complete-explainer-olive-oil-heart',
  'olive-oil-shelf-life-oxidation-storage',
] as const;

const HEALTH_RESEARCH_SLUGS = new Set([
  'olive-oil-health-benefits-science-complete',
  'olive-oil-health-benefits-polyphenol-science-complete',
  'predimed-study-complete-explainer-olive-oil-heart',
  'polyphenols-sirt1-longevity-2026',
  'hydroxytyrosol-brain-cognition-2026',
  'hydroxytyrosol-brain-cognition-memory',
  'oleocanthal-pungency-anti-inflammation',
  'oleocanthal-anti-inflammation-brain-protection',
  'evoo-gut-microbiome-predimed-plus-mechanism',
  'olive-oil-weight-loss-science',
  'mediterranean-diet-anti-aging-2026',
  'mediterranean-diet-anti-aging-women-2026',
  'squalene-olive-oil-skin-beauty-molecular',
]);

const QUALITY_JUDGMENT_SLUGS = new Set([
  'olive-oil-complete-buying-guide-2026',
  'evoo-buying-guide-2026',
  'olive-oil-evoo-vs-regular-complete-comparison',
  'olive-oil-grades-classification-complete-guide',
  '2026-evoo-quality-polyphenol-index',
  'olive-oil-polyphenol-content-how-to-verify',
  'polyphenol-decay-science-2026',
  'coa-complete-reading-guide-olive-oil',
  'olive-oil-fraud-detection-authentic-vs-fake',
  'evoo-sensory-evaluation-ioc-standards',
  'olive-oil-vs-avocado-oil-complete-comparison',
]);

const GLOBAL_CULTURE_SLUGS = new Set([
  'olive-oil-ancient-egypt-ritual-heritage',
  'olive-oil-silk-road-trade-history',
  'olive-oil-renaissance-art-science-history',
  'olive-tree-ancient-civilization-heritage',
]);

const TERROIR_ORIGIN_SLUGS = new Set([
  'shodoshima-olive-oil-history-terroir',
  'olive-oil-terroir-spain-greece-italy',
  'olive-oil-pdo-dop-igp-certification-guide',
  'japan-coa-verification-olive-oil-guide',
]);

const CULINARY_LIFE_SLUGS = new Set([
  'olive-oil-cooking-polyphenol-retention-japan',
  'olive-oil-cooking-science-can-evoo-stir-fry',
  'olive-oil-stir-fry-cancer-myth-debunked',
  'olive-oil-cooking-heat-stability-smoke-point',
  'olive-oil-storage-refrigerator-taiwan-guide',
  'olive-oil-storage-guide-2026',
  'olive-oil-shelf-life-oxidation-storage',
  'olive-oil-after-opening-shelf-life',
  'olive-oil-daily-intake-how-much',
  'olive-oil-daily-intake-dosage-science',
  'olive-oil-calories-fatty-acid-composition',
  'morning-ritual-evoo-metabolism',
]);

const ADVANCED_SLUGS = new Set([
  'predimed-study-complete-explainer-olive-oil-heart',
  'olive-oil-polyphenol-content-how-to-verify',
  'olive-oil-polyphenols-complete-science-guide',
  'oleocanthal-olive-oil-anti-inflammatory-science',
  'hydroxytyrosol-olive-oil-antioxidant-complete-guide',
  'olive-oil-sirt1-longevity-science',
  'olive-oil-oxidation-science-complete-guide',
  'olive-oil-cooking-heat-stability-smoke-point',
  'olive-oil-health-claims-evidence-guide',
]);

const BEGINNER_SLUGS = new Set([
  'olive-oil-complete-buying-guide-2026',
  'olive-oil-evoo-vs-regular-complete-comparison',
  'olive-oil-storage-refrigerator-taiwan-guide',
  'olive-oil-daily-intake-how-much',
  'olive-oil-fraud-detection-authentic-vs-fake',
  'olive-oil-shelf-life-oxidation-storage',
  'olive-oil-morning-ritual-complete-guide',
  'olive-oil-sensory-evaluation-bitter-spicy-guide',
  'olive-oil-food-pairing-complete-guide',
]);

export const AUTHORITY_HUBS = [
  {
    id: 'health-research',
    label: '健康研究',
    description: '整理 PREDIMED、多酚、羥基酪醇、Oleocanthal 與健康聲稱邊界，讓證據被正確理解。',
    href: '/authority#health-research',
    categories: ['science', 'health'],
  },
  {
    id: 'quality-judgment',
    label: '品質判斷',
    description: '用 IOC 標準、CoA、感官評鑑、分級與真偽辨識，建立不被行銷帶走的選油能力。',
    href: '/authority#quality-judgment',
    categories: ['selection', 'guide'],
  },
  {
    id: 'global-culture',
    label: '全球文化',
    description: '從古埃及、絲路、文藝復興到橄欖樹文明，理解橄欖油如何走進人類生活史。',
    href: '/authority#global-culture',
    categories: ['heritage'],
  },
  {
    id: 'terroir-origin',
    label: '風土產地',
    description: '閱讀西班牙、希臘、義大利、小豆島與地理認證，理解一瓶油背後的土地與年份。',
    href: '/authority#terroir-origin',
    categories: ['selection', 'lifestyle'],
  },
  {
    id: 'culinary-life',
    label: '料理生活',
    description: '把保存、加熱、用量、料理與日常餐桌連起來，讓橄欖油成為可持續的生活習慣。',
    href: '/authority#culinary-life',
    categories: ['lifestyle', 'health', 'guide'],
  },
] as const;

export function isHighCitationCandidate(slug: string) {
  return (HIGH_CITATION_SLUGS as readonly string[]).includes(slug);
}

export function getLearningLevel(post: Pick<PostFrontmatter, 'slug' | 'category' | 'tags'>): LearningLevel {
  if (ADVANCED_SLUGS.has(post.slug) || post.category === 'science') return 'advanced';
  if (BEGINNER_SLUGS.has(post.slug) || post.category === 'guide' || post.category === 'selection') return 'beginner';
  if (post.category === 'culture' || post.category === 'heritage') return 'intermediate';
  if ((post.tags || []).some((tag) => ['PREDIMED', '多酚', '羥基酪醇', 'Oleocanthal'].includes(tag))) {
    return 'advanced';
  }
  return 'intermediate';
}

export function getAuthorityHub(post: Pick<PostFrontmatter, 'slug' | 'category' | 'tags'>) {
  if (QUALITY_JUDGMENT_SLUGS.has(post.slug)) return AUTHORITY_HUBS[1];
  if (GLOBAL_CULTURE_SLUGS.has(post.slug) || post.category === 'heritage' || post.category === 'culture') return AUTHORITY_HUBS[2];
  if (TERROIR_ORIGIN_SLUGS.has(post.slug)) return AUTHORITY_HUBS[3];
  if (CULINARY_LIFE_SLUGS.has(post.slug)) return AUTHORITY_HUBS[4];
  if (
    HEALTH_RESEARCH_SLUGS.has(post.slug)
    || post.category === 'science'
    || (post.tags || []).some((tag) => ['PREDIMED', '多酚', '羥基酪醇', 'Oleocanthal', '心血管健康'].includes(tag))
  ) {
    return AUTHORITY_HUBS[0];
  }
  return AUTHORITY_HUBS[4];
}

export function getPostsByLevel(posts: PostFrontmatter[], level: LearningLevel) {
  return posts.filter((post) => getLearningLevel(post) === level);
}

export function getCitationUseCase(post: PostFrontmatter) {
  const keyword = post.focusKeyword || post.tags?.[0] || '橄欖油知識';
  if (post.category === 'science') return `${keyword}的研究背景、證據等級與健康聲稱邊界`;
  if (post.category === 'lifestyle') return `${keyword}的日常料理、保存與餐桌應用`;
  if (post.category === 'culture' || post.category === 'heritage') return `${keyword}的文化脈絡、產地故事與生活美學`;
  return `${keyword}的選購判斷、品質辨識與消費教育`;
}
