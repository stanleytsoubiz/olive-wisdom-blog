import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { getImages, getHeroImage } from '@/lib/images';
import { LEARNING_PATHS } from '@/lib/learning-paths';
import { categoryLabel } from '@/lib/categories';
import { formatPostDate } from '@/lib/format';
import PodcastHomeSection from '@/components/PodcastHomeSection';
import SearchBar from '@/components/SearchBar';
import { EVIDENCE_LAST_CHECKED } from '@/lib/evidence';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '知橄生活 Olive Wisdom — 華語世界的橄欖油知識平台',
  description: '華語世界的橄欖油知識平台：多酚與羥基酪醇的證據判讀、IOC 選油標準、地中海飲食研究解析——不接業配・引用學術・說清楚證據邊界。',
};

// 編輯精選 — same curation as the footer rail （選購完全指南 + PREDIMED
// 解析 + 加熱多酚保留率）, extended with the grades and fraud guides:
// the evergreen pieces closest to a reader's own buying decision.
const EDITORS_PICK_SLUGS = [
  'olive-oil-complete-buying-guide-2026',
  'predimed-study-complete-explainer-olive-oil-heart',
  'olive-oil-grades-classification-complete-guide',
  'olive-oil-fraud-detection-authentic-vs-fake',
  'olive-oil-cooking-polyphenol-retention-japan',
];

// 意圖入口導航
const INTENT_HUBS = [
  {
    href: '/blog?cat=health',
    question: '我想選一瓶好油',
    desc: '不被行銷話術騙——讀我們的鑑別指南',
    accent: 'border-olive-400',
    tag: '選購指南',
  },
  {
    href: '/blog?cat=science',
    question: '我想懂科學依據',
    desc: '多酚、PREDIMED、羥基酪醇——讀實證',
    accent: 'border-olive-600',
    tag: '科學萃取',
  },
  {
    href: '/blog?cat=lifestyle',
    question: '我想用在料理上',
    desc: '發煙點、風味搭配、晨間儀式——實用指南',
    accent: 'border-gold-400',
    tag: '餐桌美學',
  },
  {
    href: '/blog?cat=culture',
    question: '我想讀深度故事',
    desc: '三千年橄欖文明史詩——知性的閱讀體驗',
    accent: 'border-stone-400',
    tag: '知性史詩',
  },
];

export default async function HomePage() {
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 6);
  const editorsPicks = EDITORS_PICK_SLUGS
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const featuredPost = latestPosts[0];
  const restPosts = latestPosts.slice(1, 6);
  const imagesData = await getImages();
  const heroImg = getHeroImage(imagesData, 'homepage');
  const heroSrc = '/hero-grove.webp';
  const heroAlt = heroImg.alt || '知橄生活 — 地中海橄欖園晨光，特級初榨橄欖油生命之源';

  return (
    <main className="min-h-screen">
      {/* WebSite Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebSite',
        name: '知橄生活 Olive Wisdom', alternateName: 'Olive Wisdom',
        url: 'https://olive-wisdom.com',
        description: '華語世界的橄欖油知識平台——不接業配・引用學術・說清楚證據邊界。',
        inLanguage: 'zh-TW',
        potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'https://olive-wisdom.com/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' },
      }) }} />
      {/* Blog Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Blog',
        name: '知橄生活 Olive Wisdom', url: 'https://olive-wisdom.com/blog',
        description: '橄欖油科學、地中海美學、健康飲食智慧的深度知識庫',
        inLanguage: 'zh-TW',
        author: { '@type': 'Organization', name: '知橄生活研究團隊', url: 'https://olive-wisdom.com/about' },
        publisher: { '@type': 'Organization', name: '知橄生活 Olive Wisdom', url: 'https://olive-wisdom.com' },
        blogPost: latestPosts.map((p) => ({
          '@type': 'BlogPosting', headline: p.title, description: p.excerpt,
          url: `https://olive-wisdom.com/blog/${p.slug}`, datePublished: p.date,
          image: p.coverImage, inLanguage: 'zh-TW', keywords: (p.tags || []).join(', '),
          author: { '@type': 'Organization', name: p.author || '知橄生活研究團隊' },
        })),
      }) }} />
      {/* ItemList Schema — AI-extractable article index */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '知橄生活 Olive Wisdom — 精選文章',
        description: '特級初榨橄欖油科學、地中海飲食、品飲鑑賞深度文章精選',
        url: 'https://olive-wisdom.com/blog',
        numberOfItems: latestPosts.length,
        itemListElement: latestPosts.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://olive-wisdom.com/blog/${p.slug}`,
          name: p.title,
          description: p.excerpt,
        })),
      }) }} />

      {/* Hero — Kinfolk 底部錨定式 editorial */}
      <section className="relative h-[52vh] md:h-[88vh] min-h-[360px] md:min-h-[520px] max-h-[520px] md:max-h-[800px] overflow-hidden">
        <Image src={heroSrc} alt={heroAlt} fill className="object-cover object-center" priority sizes="100vw" quality={90} />
        {/* Bottom-anchored gradient — darkens bottom for text legibility.
            Wave 1: deepened + a diagonal scrim behind the text block —
            the grove photo is busy and the gold eyebrow washed out
            against sky/leaves. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/10 to-transparent" />
        {/* Top strip — subtle brand */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

        {/* Kinfolk-style bottom-anchored headline */}
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-6 pb-10 md:pb-14">
          <div className="max-w-5xl mx-auto">
            <p className="text-gold-300 text-xs font-sans font-semibold tracking-[0.3em] uppercase mb-4 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
              Olive Oil, Explained with Evidence／證據判讀
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.02] tracking-tight mb-4">
              知橄生活
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-8">
              <p className="text-white text-lg md:text-2xl font-medium max-w-lg leading-relaxed">
                華語世界的橄欖油知識平台——<br className="hidden sm:block" />
                不接業配・引用學術・說清楚證據邊界
              </p>
              <div className="flex gap-3 flex-shrink-0">
                <Link href="/blog"
                  className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-olive-900
                             font-semibold text-sm px-6 py-3 rounded-xl transition-all
                             hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
                  探索知識庫 →
                </Link>
                <Link href="/search"
                  className="inline-flex items-center gap-2 bg-white hover:bg-olive-50
                             text-olive-900 text-sm font-semibold px-6 py-3 rounded-xl
                             shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  搜尋文章
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 品類基準數據帶 (blueprint 2.1／2.3-4): directly under the hero.
          Only benchmark figures already published in /evidence, each with
          source + date labels; no market prices or live data. */}
      <section className="bg-olive-800 text-white py-7 md:py-14 px-6">
        <p className="text-center text-[11px] font-sans font-semibold text-olive-300 tracking-[0.25em] uppercase mb-4 md:mb-8">
          本站判讀所依據的基準數字
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 text-center divide-y divide-olive-700/70 md:divide-y-0">
          {[
            { num: '≤0.8', label: '%', desc: '特級初榨游離酸度上限', sub: 'IOC 貿易標準 COI/T.15/NC No. 3/Rev. 22（2026-06）・Codex CXS 33' },
            { num: '5', label: ' mg／20 g', desc: 'EFSA 核准多酚聲稱門檻', sub: '羥基酪醇及衍生物（≈≥250 mg/kg）・EFSA 意見（2011）・Reg. (EU) No 432/2012' },
            { num: '0.69', label: ' HR', desc: 'PREDIMED 主要終點風險比', sub: '7,447 人・2018 年重分析（原始 0.70）；整體飲食模式結果，非單一油品效果' },
          ].map((stat) => (
            <div key={stat.desc} className="py-3 md:py-2 first:pt-0 last:pb-0 md:first:pt-2 md:last:pb-2">
              <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2 leading-none">
                {stat.num}<span className="text-xl md:text-2xl">{stat.label}</span>
              </div>
              <div className="font-medium text-white text-sm mb-1 leading-snug">{stat.desc}</div>
              <div className="text-xs text-olive-300 leading-relaxed">{stat.sub}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-olive-300 font-sans mt-5 md:mt-8">
          數字查核日期：{EVIDENCE_LAST_CHECKED}・來源與評級標準，見
          <a href="/evidence/" className="text-gold-400 hover:text-gold-300 underline underline-offset-4 ml-1">
            證據圖書館 →
          </a>
        </p>
      </section>

      {/* ── 意圖入口導航 — "我想找什麼" ────────────────────────── */}
      <section id="intent" className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-5 md:px-6 py-6 md:py-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-stone-200" />
            <p className="text-xs font-sans font-semibold text-stone-500 tracking-[0.25em] uppercase whitespace-nowrap">
              你今天想要…
            </p>
            <div className="h-px flex-1 bg-stone-200" />
          </div>
          {/* Homepage search entry (wave 1): visible on the homepage
              itself, submits to /search via SearchBar; hot terms are
              one-tap links into the same full-text search. */}
          <div className="mb-10">
            <SearchBar placeholder="搜尋橄欖油知識：多酚、選購、發煙點…" />
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-[11px] font-sans text-stone-400 mr-1">熱門：</span>
              {['多酚', '羥基酪醇', '選購指南', '發煙點', 'PREDIMED', '假油辨識'].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="text-[11px] font-sans font-medium text-olive-700 bg-olive-50 hover:bg-olive-100 border border-olive-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTENT_HUBS.map((hub) => (
              <Link key={hub.href} href={hub.href} className="group">
                <div className={`h-full border-t-[2px] ${hub.accent} bg-white hover:bg-stone-50
                                 p-5 transition-all duration-200 hover:shadow-sm`}>
                  <p className="text-[10px] font-sans font-semibold text-stone-500 tracking-[0.2em] uppercase mb-3">
                    {hub.tag}
                  </p>
                  <h3 className="font-bold text-olive-900 text-base leading-snug mb-2 group-hover:text-olive-700 transition-colors">
                    {hub.question}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">
                    {hub.desc}
                  </p>
                  <p className="text-xs text-olive-600 font-medium font-sans mt-4 group-hover:text-olive-800 transition-colors">
                    開始閱讀 →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 我是新手，從這裡開始 — 學習路徑入口 ─────────────────── */}
      <section className="bg-[#FAF8F4] border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-5 md:px-6 py-6 md:py-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-stone-200" />
            <p className="text-xs font-sans font-semibold text-stone-500 tracking-[0.25em] uppercase whitespace-nowrap">
              我是新手，從這裡開始
            </p>
            <div className="h-px flex-1 bg-stone-200" />
          </div>
          <p className="text-sm text-stone-500 leading-relaxed font-sans max-w-2xl mb-8 -mt-4">
            不知道先讀哪一篇？五條學習路徑都從入門讀到研究級，讀完就能自己判斷一瓶油。
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {LEARNING_PATHS.map((path) => (
              <Link key={path.id} href={`/blog/${path.entries[0].slug}`} className="group">
                <div className="h-full border-t-[2px] border-olive-400 bg-white hover:bg-stone-50
                                 p-5 transition-all duration-200 hover:shadow-sm">
                  <p className="text-[10px] font-sans font-semibold text-stone-500 tracking-[0.2em] uppercase mb-3">
                    學習路徑
                  </p>
                  <h3 className="font-bold text-olive-900 text-base leading-snug mb-2 group-hover:text-olive-700 transition-colors">
                    {path.label}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">
                    {path.desc}
                  </p>
                  <p className="text-xs text-olive-600 font-medium font-sans mt-4 group-hover:text-olive-800 transition-colors">
                    入門：{path.entries[0].title} →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 精選知識 — Kinfolk Editorial Layout ─────────────────── */}
      {latestPosts.length > 0 && (
        <section className="bg-[#FAF8F4] py-16 px-5 md:px-6">
          <div className="max-w-5xl mx-auto">

            {/* Section header — minimal editorial */}
            <div className="flex items-center gap-5 mb-14">
              <span className="text-[10px] font-sans font-semibold text-stone-500 tracking-[0.3em] uppercase whitespace-nowrap">
                最新深度報導
              </span>
              <div className="h-px flex-1 bg-stone-200" />
              <Link href="/blog" className="text-[10px] font-sans font-semibold text-olive-600 hover:text-olive-800 tracking-[0.2em] uppercase transition-colors whitespace-nowrap">
                瀏覽全部 →
              </Link>
            </div>

            {/* Featured story — authoritative split layout */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="group block mb-16">
                <article className="grid md:grid-cols-[5fr_4fr] gap-0">
                  {/* Image */}
                  <div className="relative aspect-video md:aspect-auto md:h-[420px] overflow-hidden bg-stone-100">
                    <Image
                      src={(imagesData.posts?.[featuredPost.slug]?.url) || featuredPost.coverImage}
                      alt={featuredPost.title} fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 55vw"
                      priority
                    />
                  </div>
                  {/* Text panel — no border box, use left separator line on md+ */}
                  <div className="flex flex-col justify-center px-0 md:px-10 py-8 md:py-0 md:border-l md:border-stone-100">
                    <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.2em] uppercase mb-4">
                      最新深度報導
                    </p>
                    <h2 className="font-serif text-2xl md:text-[1.75rem] font-bold text-stone-900 leading-[1.25] mb-4
                                   group-hover:text-olive-800 transition-colors tracking-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-stone-500 text-sm leading-[1.85] mb-6 line-clamp-4 font-sans">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-sans text-stone-500 mb-6 pt-5 border-t border-stone-100">
                      <span className="text-olive-600 font-medium">{featuredPost.author || '知橄生活研究團隊'}</span>
                      <span className="text-stone-200">·</span>
                      <span>{featuredPost.readTime} 分鐘閱讀</span>
                      <span className="text-stone-200">·</span>
                      <span>{formatPostDate(featuredPost.date)}</span>
                    </div>
                    <span className="text-sm font-medium text-olive-700 group-hover:text-olive-900
                                     transition-colors font-sans">
                      深度閱讀 →
                    </span>
                  </div>
                </article>
              </Link>
            )}

            {/* Secondary articles — NYT-style borderless grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
              {restPosts.slice(0, 5).map((post) => {
                const catLabel = categoryLabel(post.category);
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                    <article>
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden bg-stone-100 mb-4">
                        <Image
                          src={(imagesData.posts?.[post.slug]?.url) || post.coverImage}
                          alt={post.title} fill
                          className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                      {/* Text */}
                      <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.2em] uppercase mb-2">
                        {catLabel}
                      </p>
                      <h3 className="font-bold text-stone-900 text-[0.95rem] leading-snug mb-2
                                     group-hover:text-olive-800 transition-colors tracking-tight line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-sans mb-3">
                        {post.excerpt}
                      </p>
                      <div className="pt-3 border-t border-stone-100">
                        {/* Byline on every card (wave 1) — matches the
                            featured card: 知橄生活研究團隊 */}
                        <p className="text-[10px] font-sans text-olive-600 font-medium mb-1.5">
                          {post.author || '知橄生活研究團隊'}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-sans text-stone-500">
                          <span>{formatPostDate(post.date)}</span>
                          <span className="text-stone-200">·</span>
                          <span>{post.readTime} 分鐘閱讀</span>
                          <span className="text-stone-200">·</span>
                          <span className="text-olive-600 font-semibold group-hover:text-olive-800 transition-colors">閱讀 →</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* ── 編輯精選 — evergreen guides rail (wave 1) ─────────────── */}
      {editorsPicks.length > 0 && (
        <section className="bg-white border-b border-stone-100 py-14 md:py-16 px-5 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-5 mb-10">
              <span className="text-[10px] font-sans font-semibold text-stone-500 tracking-[0.3em] uppercase whitespace-nowrap">
                編輯精選
              </span>
              <div className="h-px flex-1 bg-stone-200" />
              <Link href="/blog" className="text-[10px] font-sans font-semibold text-olive-600 hover:text-olive-800 tracking-[0.2em] uppercase transition-colors whitespace-nowrap">
                瀏覽全部 →
              </Link>
            </div>
            {/* Rail: horizontal snap-scroll on mobile, 5-up grid on lg */}
            <div className="flex gap-6 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory lg:mx-0 lg:px-0 lg:pb-0 lg:grid lg:grid-cols-5 lg:overflow-visible">
              {editorsPicks.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group shrink-0 w-[240px] snap-start lg:w-auto"
                >
                  <article>
                    <div className="relative aspect-video overflow-hidden bg-stone-100 mb-4">
                      <Image
                        src={(imagesData.posts?.[post.slug]?.url) || post.coverImage}
                        alt={post.title} fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                        sizes="(max-width: 1024px) 240px, 20vw"
                      />
                    </div>
                    <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.2em] uppercase mb-2">
                      {categoryLabel(post.category)}
                    </p>
                    <h3 className="font-bold text-stone-900 text-[0.95rem] leading-snug mb-2
                                   group-hover:text-olive-800 transition-colors tracking-tight line-clamp-3">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-sans text-stone-500 pt-3 border-t border-stone-100">
                      <span className="text-olive-600 font-medium">{post.author || '知橄生活研究團隊'}</span>
                      <span className="text-stone-200">·</span>
                      <span>{post.readTime} 分鐘閱讀</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Podcast 首頁區塊 (blueprint 2.4-4): renders only when episodes
          are registered in src/lib/podcast.ts */}
      <PodcastHomeSection />

      {/* 追蹤知橄生活 */}
      <section id="follow" className="bg-gradient-to-br from-olive-100 to-gold-50 py-14 md:py-20 px-6 text-center">
        <p className="text-gold-600 text-xs font-medium tracking-[0.25em] uppercase mb-4">加入知橄家族</p>
        <h2 className="font-serif text-2xl md:text-4xl font-bold text-olive-800 mb-4 tracking-tight">追蹤知橄生活</h2>
        <p className="text-stone-500 text-sm md:text-base leading-relaxed max-w-md mx-auto font-sans">
          新文章與研究更新都會公布在網站上；官方社群與 LINE 正在籌備中，開通後會在這裡公布。歡迎常回來看看，也把知橄生活分享給同樣在意吃一瓶好油的朋友。
        </p>
      </section>

    </main>
  );
}
