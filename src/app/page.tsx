import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { getImages, getHeroImage } from '@/lib/images';
import SubscribeForm from '@/components/SubscribeForm';
import ContactForm from '@/components/ContactForm';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '知橄生活 Olive Wisdom — 以科學與美學，精煉您的健康時光',
  description: '知橄生活 Olive Wisdom，為 35+ 知性追求者打造的橄欖油科學與美學空間。探索多酚、SIRT1、羥基酪醇、地中海飲食完整知識庫。',
};

// 意圖入口導航
const INTENT_HUBS = [
  {
    href: '/blog?cat=health',
    question: '我想選一瓶好油',
    desc: '不被行銷話術騙——讀我們的鑑別指南',
    icon: '🫒',
    accent: 'border-amber-400',
    tag: '選購指南',
  },
  {
    href: '/blog?cat=science',
    question: '我想懂科學依據',
    desc: '多酚、PREDIMED、羥基酪醇——讀實證',
    icon: '🔬',
    accent: 'border-emerald-400',
    tag: '科學實證',
  },
  {
    href: '/blog?cat=lifestyle',
    question: '我想用在料理上',
    desc: '發煙點、風味搭配、晨間儀式——實用指南',
    icon: '🍳',
    accent: 'border-rose-400',
    tag: '料理應用',
  },
  {
    href: '/blog?cat=culture',
    question: '我想讀深度故事',
    desc: '三千年橄欖文明史詩——知性的閱讀體驗',
    icon: '📖',
    accent: 'border-purple-400',
    tag: '知性史詩',
  },
];

export default async function HomePage() {
  const latestPosts = getAllPosts().slice(0, 6);
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
        description: '為 35+ 知性追求者打造的橄欖油科學與美學空間，以嚴謹科研實證探索地中海飲食與長壽之道。',
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

      {/* Hero — Kinfolk 底部錨定式 editorial */}
      <section className="relative h-[88vh] min-h-[520px] max-h-[800px] overflow-hidden">
        <Image src={heroSrc} alt={heroAlt} fill className="object-cover object-center" priority sizes="100vw" quality={90} />
        {/* Bottom-anchored gradient — darkens bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Top strip — subtle brand */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

        {/* Kinfolk-style bottom-anchored headline */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:pb-14">
          <div className="max-w-5xl mx-auto">
            <p className="text-gold-400 text-[11px] font-sans font-semibold tracking-[0.35em] uppercase mb-4">
              以科學與美學，精煉您的健康時光
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.02] tracking-tight mb-4">
              知橄生活
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-8">
              <p className="text-olive-200 text-base md:text-lg max-w-md leading-relaxed">
                華語世界最公正的橄欖油知識平台——<br className="hidden sm:block" />
                不接業配・引用學術・敢說真話
              </p>
              <div className="flex gap-3 flex-shrink-0">
                <Link href="/blog"
                  className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-olive-900
                             font-semibold text-sm px-6 py-3 rounded-xl transition-all
                             hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
                  探索知識庫 →
                </Link>
                <a href="#intent"
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur
                             text-white text-sm font-medium px-6 py-3 rounded-xl
                             border border-white/30 transition-all">
                  我想找什麼
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 意圖入口導航 — "我想找什麼" ────────────────────────── */}
      <section id="intent" className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-stone-200" />
            <p className="text-xs font-sans font-semibold text-stone-400 tracking-[0.25em] uppercase whitespace-nowrap">
              您今天想要…
            </p>
            <div className="h-px flex-1 bg-stone-200" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTENT_HUBS.map((hub) => (
              <Link key={hub.href} href={hub.href} className="group">
                <div className={`h-full border-t-[3px] ${hub.accent} bg-white hover:bg-stone-50
                                 rounded-b-xl p-5 transition-all duration-200
                                 hover:shadow-md hover:-translate-y-0.5`}>
                  <div className="text-3xl mb-3">{hub.icon}</div>
                  <p className="text-[10px] font-sans font-semibold text-stone-400 tracking-widest uppercase mb-1">
                    {hub.tag}
                  </p>
                  <h3 className="font-bold text-olive-900 text-base leading-snug mb-2 group-hover:text-olive-700 transition-colors">
                    {hub.question}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">
                    {hub.desc}
                  </p>
                  <p className="text-xs text-olive-600 font-semibold font-sans mt-3 group-hover:text-olive-800 transition-colors">
                    開始閱讀 →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 精選知識 — Kinfolk Editorial Layout ─────────────────── */}
      {latestPosts.length > 0 && (
        <section className="bg-[#fafaf7] py-20 px-6">
          <div className="max-w-5xl mx-auto">

            {/* Section header — minimal editorial */}
            <div className="flex items-center gap-5 mb-14">
              <span className="text-[10px] font-sans font-semibold text-stone-400 tracking-[0.3em] uppercase whitespace-nowrap">
                最新深度報導
              </span>
              <div className="h-px flex-1 bg-stone-200" />
              <Link href="/blog" className="text-[10px] font-sans font-semibold text-olive-600 hover:text-olive-800 tracking-[0.2em] uppercase transition-colors whitespace-nowrap">
                瀏覽全部 →
              </Link>
            </div>

            {/* Featured story — Kinfolk wide layout */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="group block mb-16">
                <article className="grid md:grid-cols-[5fr_4fr] gap-0 overflow-hidden">
                  {/* Image — no border radius, no card shadow */}
                  <div className="relative h-72 md:h-[420px] overflow-hidden bg-stone-200">
                    <Image
                      src={(imagesData.posts?.[featuredPost.slug]?.url) || featuredPost.coverImage}
                      alt={featuredPost.title} fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      unoptimized priority
                    />
                  </div>
                  {/* Editorial text panel */}
                  <div className="bg-white flex flex-col justify-center px-8 md:px-12 py-10 md:py-14
                                  border-t border-r border-b border-stone-200 md:border-l-0">
                    <p className="text-[10px] font-sans font-semibold text-gold-600 tracking-[0.3em] uppercase mb-5">
                      本期精選
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-olive-900 leading-[1.25] mb-5
                                   group-hover:text-olive-700 transition-colors tracking-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-stone-500 text-sm leading-[1.85] mb-7 line-clamp-4 font-sans">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] font-sans text-stone-400 mb-8 pt-5 border-t border-stone-100">
                      <span className="font-semibold text-olive-600">{featuredPost.author || '知橄研究室'}</span>
                      <span>·</span>
                      <span>{featuredPost.readTime} 分鐘閱讀</span>
                      <span>·</span>
                      <span>{new Date(featuredPost.date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}</span>
                    </div>
                    <span className="text-sm font-semibold text-olive-700 group-hover:text-olive-900
                                     transition-colors font-sans tracking-wide">
                      深度閱讀 →
                    </span>
                  </div>
                </article>
              </Link>
            )}

            {/* Secondary articles — editorial grid, no card borders */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
              {restPosts.slice(0, 4).map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <article>
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden bg-stone-200 mb-4">
                      <Image
                        src={(imagesData.posts?.[post.slug]?.url) || post.coverImage}
                        alt={post.title} fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        unoptimized
                      />
                      {/* Issue number — editorial touch */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-sans font-semibold text-stone-500 tracking-widest uppercase">
                        No.{String(i + 2).padStart(2, '0')}
                      </div>
                    </div>
                    {/* Text */}
                    <h3 className="font-bold text-olive-900 text-[0.95rem] leading-snug mb-2
                                   group-hover:text-olive-700 transition-colors tracking-tight line-clamp-3">
                      {post.title}
                    </h3>
                    <p className="text-[11px] font-sans text-stone-400 line-clamp-2 leading-relaxed mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-sans text-stone-400">
                      <span>{post.readTime} MIN</span>
                      <span className="w-1 h-1 rounded-full bg-stone-300 inline-block" />
                      <span className="text-olive-600 font-semibold group-hover:text-olive-800 transition-colors">閱讀 →</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 科學數據帶 */}
      <section className="bg-olive-800 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 text-center">
          {[
            { num: '7,447', label: '位', desc: 'PREDIMED 研究受試者', sub: '史上最大地中海飲食研究' },
            { num: '30%', label: '', desc: '心血管風險降低', sub: '高多酚 EVOO 組別數據' },
            { num: '250mg', label: '/kg+', desc: '高多酚標準含量', sub: 'EFSA 認可健康聲稱門檻' },
            { num: '3000', label: '年', desc: '橄欖樹文明歷史', sub: '克里特島古木仍在結果' },
          ].map((stat) => (
            <div key={stat.desc}>
              <div className="text-4xl font-bold text-gold-400 mb-1">{stat.num}<span className="text-2xl">{stat.label}</span></div>
              <div className="font-medium text-white text-sm mb-1">{stat.desc}</div>
              <div className="text-xs text-olive-300">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 訂閱 */}
      <section id="subscribe" className="bg-gradient-to-br from-olive-100 to-gold-50 py-20 px-6 text-center">
        <p className="text-gold-600 text-sm font-medium tracking-widest uppercase mb-3">加入知橄家族</p>
        <h2 className="text-4xl font-bold text-olive-800 mb-4">訂閱知橄週報</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          每週一封，精選最新橄欖油研究、地中海生活美學靈感，直送您的信箱。<br />
          訂閱即贈《橄欖油品飲師口袋手冊》PDF。<br />
          <span className="text-olive-600 font-medium">已有 8,000+ 知性讀者每週與我們一同探索橄欖智慧 🫒</span>
        </p>
        <SubscribeForm />
      </section>

      {/* 聯絡 */}
      <section className="max-w-2xl mx-auto py-20 px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-olive-800 mb-3">聯絡知橄生活</h2>
          <p className="text-gray-500">有合作提案、讀者迴響或問題，歡迎與我們聯繫</p>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
