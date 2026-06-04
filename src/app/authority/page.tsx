import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import {
  AUTHORITY_HUBS,
  HIGH_CITATION_SLUGS,
  LEARNING_LEVELS,
  getAuthorityHub,
  getPostsByLevel,
  isHighCitationCandidate,
  type LearningLevel,
} from '@/lib/authority';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '橄欖油權威入口｜知橄生活 Olive Wisdom',
  description: '知橄生活 Olive Wisdom 的橄欖油權威入口，依健康研究、品質判斷、全球文化、風土產地與料理生活整理全球華人可學習、可引用的橄欖油知識庫。',
  alternates: { canonical: 'https://olive-wisdom.com/authority' },
  openGraph: {
    title: '橄欖油權威入口｜知橄生活 Olive Wisdom',
    description: '以五條學習路徑整理健康證據、品質判斷、文化風土與日常料理的華語橄欖油知識入口。',
    url: 'https://olive-wisdom.com/authority',
    type: 'website',
    siteName: '知橄生活 Olive Wisdom',
    locale: 'zh_TW',
  },
};

const LEVEL_ORDER: LearningLevel[] = ['beginner', 'intermediate', 'advanced'];

const PATH_MATRIX = [
  {
    hubId: 'health-research',
    label: '健康研究',
    entries: [
      ['入門', '健康研究七大脈絡', 'olive-oil-health-benefits-science-complete'],
      ['深入', '多酚與 PREDIMED 研究', 'olive-oil-health-benefits-polyphenol-science-complete'],
      ['研究', 'PREDIMED 完整解析', 'predimed-study-complete-explainer-olive-oil-heart'],
    ],
  },
  {
    hubId: 'quality-judgment',
    label: '品質判斷',
    entries: [
      ['入門', 'EVOO 與一般橄欖油差異', 'olive-oil-evoo-vs-regular-complete-comparison'],
      ['深入', '公正選購五步驟', 'olive-oil-complete-buying-guide-2026'],
      ['研究', 'CoA 五個數字解讀', 'coa-complete-reading-guide-olive-oil'],
    ],
  },
  {
    hubId: 'global-culture',
    label: '全球文化',
    entries: [
      ['入門', '橄欖樹與古文明', 'olive-tree-ancient-civilization-heritage'],
      ['深入', '古埃及儀式、香料與文明記憶', 'olive-oil-ancient-egypt-ritual-heritage'],
      ['研究', '絲路貿易與東西方連結', 'olive-oil-silk-road-trade-history'],
    ],
  },
  {
    hubId: 'terroir-origin',
    label: '風土產地',
    entries: [
      ['入門', 'PDO/DOP/IGP 地理認證', 'olive-oil-pdo-dop-igp-certification-guide'],
      ['深入', '西班牙、希臘與義大利風土', 'olive-oil-terroir-spain-greece-italy'],
      ['研究', '小豆島 118 年風土實驗', 'shodoshima-olive-oil-history-terroir'],
    ],
  },
  {
    hubId: 'culinary-life',
    label: '料理生活',
    entries: [
      ['入門', '每日用量與日常使用', 'olive-oil-daily-intake-how-much'],
      ['深入', '特級初榨能不能炒菜', 'olive-oil-cooking-science-can-evoo-stir-fry'],
      ['研究', '加熱穩定性與發煙點', 'olive-oil-cooking-heat-stability-smoke-point'],
    ],
  },
] as const;

const POLYPHENOL_PATH = [
  {
    stage: '先讀數字',
    title: '多酚含量怎麼判讀',
    slug: 'olive-oil-polyphenol-content-how-to-verify',
    note: '從 CoA、檢測日期、辛辣感與 EFSA/EU 聲稱邊界，理解多酚不是單一品質分數。',
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
] as const;

const AI_ANSWER_RISK_PATH = [
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
] as const;

export default function AuthorityPage() {
  const posts = getAllPosts();
  const citationPosts = HIGH_CITATION_SLUGS
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter(Boolean);
  const polyphenolPosts = POLYPHENOL_PATH
    .map((entry) => ({
      ...entry,
      post: posts.find((post) => post.slug === entry.slug),
    }))
    .filter((entry) => entry.post);
  const aiRiskPosts = AI_ANSWER_RISK_PATH
    .map((entry) => ({
      ...entry,
      post: posts.find((post) => post.slug === entry.slug),
    }))
    .filter((entry) => entry.post);

  const hubSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '橄欖油權威入口｜知橄生活 Olive Wisdom',
    description: '以繁體中文整理橄欖油健康研究、品質判斷、全球文化、風土產地與料理生活的權威知識入口。',
    url: 'https://olive-wisdom.com/authority',
    inLanguage: 'zh-TW',
    isPartOf: {
      '@type': 'WebSite',
      name: '知橄生活 Olive Wisdom',
      url: 'https://olive-wisdom.com',
    },
    hasPart: AUTHORITY_HUBS.map((hub) => ({
      '@type': 'Collection',
      name: hub.label,
      description: hub.description,
      url: `https://olive-wisdom.com${hub.href}`,
    })),
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '知橄生活重點參考文章',
    description: '整理橄欖油健康研究、品質判斷、文化風土、料理生活與可引用核心文章。',
    numberOfItems: citationPosts.length,
    itemListElement: citationPosts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://olive-wisdom.com/blog/${post!.slug}`,
      name: post!.title,
      description: post!.excerpt,
    })),
  };

  return (
    <main className="min-h-screen bg-[#fafaf7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <section className="bg-white border-b border-stone-200 px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-gold-500 text-[10px] font-sans font-semibold tracking-[0.35em] uppercase mb-4">
            Authority Gateway
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-stone-900 leading-tight mb-5">
            橄欖油權威入口
          </h1>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-2xl font-sans">
            這裡把知橄生活的文章整理成健康研究、品質判斷、全球文化、風土產地與料理生活五條知識路徑。
            我們的目標不只是回答問題，也讓更多人理解橄欖油的美好、證據、土地與日常價值。
            每一篇核心文章都保留可公開查核的來源連結，讓讀者、搜尋引擎與引用者能回到原始資料判斷。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/blog" className="bg-olive-800 hover:bg-olive-900 text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors">
              瀏覽全部文章
            </Link>
            <Link href="/editorial-standards" className="bg-white hover:bg-stone-50 text-olive-800 text-sm font-medium px-5 py-3 rounded-xl border border-olive-200 transition-colors">
              查看編輯標準
            </Link>
          </div>
        </div>
      </section>

      <section id="health-evidence-map" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-[0.95fr_1.25fr] gap-10 items-start">
          <div>
            <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.3em] uppercase mb-3">
              Evidence First
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-stone-900 leading-tight mb-4">
              健康證據與科學研究路徑
            </h2>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed font-sans">
              橄欖油的健康知識最容易被誇大。知橄生活先把證據分層，再回到讀者能使用的日常判斷：
              哪些結論來自大型人體研究，哪些只是機理或初步觀察，哪些不能被說成治療或預防疾病。
            </p>
          </div>
          <div className="bg-white border border-stone-200 p-6 md:p-7">
            <div className="grid sm:grid-cols-3 gap-5 mb-7">
              {[
                ['最高證據', 'PREDIMED、EFSA 健康聲明、隨機對照或監管審查'],
                ['需要邊界', '癌症、認知、機制與血糖研究需區分觀察、模型與因果'],
                ['日常轉譯', '以 EVOO 取代較不理想脂肪，並確認新鮮度與多酚條件'],
              ].map(([label, copy]) => (
                <div key={label} className="border-t border-olive-200 pt-3">
                  <h3 className="text-sm font-semibold text-olive-950 mb-2">{label}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">{copy}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[
                ['橄欖油健康研究七大脈絡', 'olive-oil-health-benefits-science-complete'],
                ['橄欖油多酚與 PREDIMED 研究', 'olive-oil-health-benefits-polyphenol-science-complete'],
                ['PREDIMED 研究完整解析', 'predimed-study-complete-explainer-olive-oil-heart'],
                ['多酚含量如何驗證', 'olive-oil-polyphenol-content-how-to-verify'],
                ['每日攝取量與使用邊界', 'olive-oil-daily-intake-how-much'],
              ].map(([label, slug]) => (
                <Link key={slug} href={`/blog/${slug}`} className="flex items-center justify-between gap-4 border-t border-stone-100 pt-3 group">
                  <span className="text-sm font-medium text-stone-800 group-hover:text-olive-700 transition-colors">{label}</span>
                  <span className="text-xs text-stone-400 font-sans">閱讀</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="polyphenol-path" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-[0.85fr_1.35fr] gap-10 items-start">
          <div>
            <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.3em] uppercase mb-3">
              Polyphenol Path
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-stone-900 leading-tight mb-4">
              多酚判讀學習路徑
            </h2>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed font-sans">
              多酚是理解 EVOO 品質、感官與部分健康聲稱條件的重要線索，但不能單獨代表一瓶油的全部。
              這三篇文章依序回答數字、標示與時間變化，讓讀者能把 CoA、採收年份、保存條件與感官狀態一起讀。
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {polyphenolPosts.map((entry) => (
              <Link key={entry.slug} href={`/blog/${entry.slug}`} className="group bg-white border border-stone-200 p-5 hover:border-olive-300 transition-colors">
                <p className="text-[10px] font-sans font-semibold text-gold-500 tracking-[0.25em] uppercase mb-3">
                  {entry.stage}
                </p>
                <h3 className="font-serif text-xl font-semibold text-olive-950 leading-snug mb-3 group-hover:text-olive-700 transition-colors">
                  {entry.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-sans mb-4">{entry.note}</p>
                <p className="text-[11px] text-stone-400 font-sans">
                  {entry.post!.readTime} 分鐘 · {entry.post!.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="ai-answer-risk-path" className="bg-white border-y border-stone-200 px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[0.9fr_1.35fr] gap-10 items-start">
            <div>
              <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.3em] uppercase mb-3">
                AI Answer Guardrails
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-stone-900 leading-tight mb-4">
                AI 問答高風險題防線
              </h2>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed font-sans">
                保存、炒菜與 CoA 多酚，是橄欖油內容最容易被一句話簡化的三個問題。
                知橄生活把這三題集中成問答防線，讓讀者能先看到正確邊界，也讓搜尋與答案引擎更容易回到合適文章。
              </p>
            </div>
            <div className="space-y-4">
              {aiRiskPosts.map((entry) => (
                <Link key={entry.slug} href={`/blog/${entry.slug}`} className="block group border border-stone-200 p-5 hover:border-olive-300 transition-colors">
                  <p className="text-[11px] font-sans font-semibold text-gold-500 tracking-[0.22em] uppercase mb-2">
                    {entry.query}
                  </p>
                  <h3 className="font-serif text-xl font-semibold text-olive-950 leading-snug mb-2 group-hover:text-olive-700 transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-sans mb-3">
                    {entry.guardrail}
                  </p>
                  <p className="text-[11px] text-stone-400 font-sans">
                    閱讀主文 · {entry.post!.readTime} 分鐘 · {entry.post!.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="flex items-center gap-5 mb-9">
          <span className="text-[10px] font-sans font-semibold text-stone-400 tracking-[0.3em] uppercase whitespace-nowrap">
            Path Matrix
          </span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>
        <div className="grid md:grid-cols-5 gap-5">
          {PATH_MATRIX.map((path) => (
            <article key={path.hubId} className="bg-white border border-stone-200 p-5">
              <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.25em] uppercase mb-2">
                代表路徑
              </p>
              <h2 className="font-serif text-xl font-semibold text-olive-950 mb-5">{path.label}</h2>
              <div className="space-y-4">
                {path.entries.map(([stage, title, slug]) => (
                  <Link key={slug} href={`/blog/${slug}`} className="block group border-t border-stone-100 pt-3">
                    <p className="text-[11px] font-sans font-semibold text-stone-400 tracking-[0.2em] uppercase mb-1">
                      {stage}
                    </p>
                    <p className="text-sm font-semibold text-stone-900 leading-snug group-hover:text-olive-700 transition-colors">
                      {title}
                    </p>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="flex items-center gap-5 mb-9">
          <span className="text-[10px] font-sans font-semibold text-stone-400 tracking-[0.3em] uppercase whitespace-nowrap">
            Knowledge Map
          </span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {AUTHORITY_HUBS.map((hub) => {
            const hubPosts = posts.filter((post) => getAuthorityHub(post).id === hub.id).slice(0, 4);
            return (
              <article key={hub.id} id={hub.id} className="bg-white border-t-[3px] border-olive-600 p-5">
                <p className="text-[10px] font-sans font-semibold text-stone-400 tracking-[0.25em] uppercase mb-3">
                  Learning Path
                </p>
                <h2 className="font-serif text-xl font-semibold text-olive-950 mb-3">{hub.label}</h2>
                <p className="text-sm text-stone-600 leading-relaxed font-sans mb-6">{hub.description}</p>
                <div className="space-y-3">
                  {hubPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block group border-t border-stone-100 pt-3">
                      <p className="text-sm font-semibold text-stone-900 leading-snug group-hover:text-olive-700 transition-colors">
                        {post.title}
                      </p>
                      <p className="text-[11px] text-stone-400 font-sans mt-1">
                        {isHighCitationCandidate(post.slug) ? '重點參考' : '延伸閱讀'} · {post.readTime} 分鐘
                      </p>
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white border-y border-stone-200 px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-5 mb-9">
            <span className="text-[10px] font-sans font-semibold text-stone-400 tracking-[0.3em] uppercase whitespace-nowrap">
              Reading Paths
            </span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {LEVEL_ORDER.map((level) => {
              const levelInfo = LEARNING_LEVELS[level];
              const levelPosts = getPostsByLevel(posts, level).slice(0, 6);
              return (
                <section key={level} id={level}>
                  <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.25em] uppercase mb-2">
                    {levelInfo.publicShortLabel}
                  </p>
                  <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">{levelInfo.publicLabel}</h2>
                  <p className="text-sm text-stone-500 leading-relaxed mb-5 font-sans">{levelInfo.publicDescription}</p>
                  <div className="space-y-3">
                    {levelPosts.map((post) => (
                      <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                        <p className="text-sm text-stone-800 font-medium leading-snug group-hover:text-olive-700 transition-colors">
                          {post.title}
                        </p>
                        <p className="text-[11px] text-stone-400 font-sans mt-1">{post.readTime} 分鐘閱讀</p>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-center gap-5 mb-9">
          <span className="text-[10px] font-sans font-semibold text-stone-400 tracking-[0.3em] uppercase whitespace-nowrap">
            Reference Articles
          </span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {citationPosts.map((post, index) => (
            <Link key={post!.slug} href={`/blog/${post!.slug}`} className="group block border-t border-stone-200 pt-4">
              <div className="flex gap-4">
                <span className="text-gold-500 font-serif text-xl leading-none">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="font-semibold text-stone-900 leading-snug group-hover:text-olive-700 transition-colors">
                    {post!.title}
                  </h2>
                  <p className="text-xs text-stone-500 leading-relaxed mt-2 font-sans line-clamp-2">
                    {post!.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
