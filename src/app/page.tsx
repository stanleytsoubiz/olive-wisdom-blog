import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { getImages, getHeroImage } from '@/lib/images';
export const dynamic = 'force-static';

import SubscribeForm from '@/components/SubscribeForm';
import ContactForm from '@/components/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '知橄生活 Olive Wisdom — 以科學與美學，精煉您的健康時光',
  description: '知橄生活 Olive Wisdom，為 35+ 知性追求者打造的橄欖油科學與美學空間。探索多酚、SIRT1、羥基酪醇、地中海飲食完整知識庫。',
};

const CATEGORIES = [
  {
    href: '/blog?cat=culture',
    label: '知性史詩',
    en: 'Heritage',
    desc: '追溯地中海千年的文明足跡，探索橄欖樹與人類命運交織的史詩。',
    icon: '🏛️',
    color: 'from-purple-800 to-purple-600',
  },
  {
    href: '/blog?cat=science',
    label: '科學萃取',
    en: 'Science',
    desc: '分子醫學、多酚機制、學術研究解析；深度科普給知性的您。',
    icon: '🔬',
    color: 'from-emerald-800 to-emerald-600',
  },
  {
    href: '/blog?cat=health',
    label: '品味鑑賞',
    en: 'Selection',
    desc: '感官鑑賞、IOC 評分標準、產地風土、辨別真偽的完整指南。',
    icon: '🏆',
    color: 'from-amber-800 to-amber-600',
  },
  {
    href: '/blog?cat=lifestyle',
    label: '餐桌美學',
    en: 'Lifestyle',
    desc: '晨間儀式、烹飪技法、護膚程序——將橄欖油融入您的生活美學。',
    icon: '✨',
    color: 'from-rose-800 to-rose-600',
  },
];

export default async function HomePage() {
  const latestPosts = getAllPosts().slice(0, 6);
  const featuredPost = latestPosts[0];
  const restPosts = latestPosts.slice(1, 6);
  const imagesData = await getImages();
  const heroImg = getHeroImage(imagesData, 'homepage');
  // Use local WebP for LCP performance (eliminates external CDN dependency)
  const heroSrc = '/hero-grove.webp';
  const heroAlt = heroImg.alt || '知橄生活 — 地中海橄欖園晨光，特級初榨橄欖油生命之源';

  return (
    <main className="min-h-screen">
      {/* WebSite + SearchAction Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: '知橄生活 Olive Wisdom',
            alternateName: 'Olive Wisdom',
            url: 'https://olive-wisdom.com',
            description: '為 35+ 知性追求者打造的橄欖油科學與美學空間，以嚴謹科研實證探索地中海飲食與長壽之道。',
            inLanguage: 'zh-TW',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://olive-wisdom.com/blog?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      {/* Blog + ItemList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: '知橄生活 Olive Wisdom',
            url: 'https://olive-wisdom.com/blog',
            description: '橄欖油科學、地中海美學、健康飲食智慧的深度知識庫',
            inLanguage: 'zh-TW',
            author: { '@type': 'Organization', name: '知橄生活研究團隊', url: 'https://olive-wisdom.com/about' },
            publisher: { '@type': 'Organization', name: '知橄生活 Olive Wisdom', url: 'https://olive-wisdom.com' },
            blogPost: posts.slice(0, 6).map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              description: p.excerpt,
              url: `https://olive-wisdom.com/blog/${p.slug}`,
              datePublished: p.date,
              image: p.coverImage,
              inLanguage: 'zh-TW',
              keywords: (p.tags || []).join(', '),
              author: { '@type': 'Organization', name: p.author || '知橄生活研究團隊' },
            })),
          }),
        }}
      />
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src={heroSrc}
          alt={heroAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-olive-900/70 via-olive-800/60 to-olive-900/80" />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <p className="text-gold-400 text-sm font-medium tracking-[0.3em] uppercase mb-4">
            以科學與美學，精煉您的健康時光
          </p>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
            知橄生活
            <span className="block text-2xl md:text-3xl font-light tracking-[0.2em] text-olive-200 mt-2">
              OLIVE WISDOM
            </span>
          </h1>
          <p className="text-lg md:text-xl text-olive-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            橄欖油文化・地中海美學・健康飲食智慧<br />
            <span className="text-base text-olive-200">為 35+ 知性追求者打造的橄欖油深度知識空間</span>
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-olive-900 font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              探索知識庫 →
            </Link>
            <a
              href="#subscribe"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white font-medium px-8 py-4 rounded-xl border border-white/40 transition-all"
            >
              訂閱電子報
            </a>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── 四大欄目 ── */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-olive-800 mb-3">四大知識欄目</h2>
          <p className="text-gray-500">從文明史詩到分子科學，為您精煉橄欖油的完整知識圖譜</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link key={cat.href} href={cat.href}>
              <div className={`relative bg-gradient-to-br ${cat.color} text-white rounded-2xl p-6 h-44 flex flex-col justify-between hover:shadow-xl transition-all hover:-translate-y-1 group overflow-hidden`}>
                <div className="absolute top-0 right-0 text-6xl opacity-20 -translate-y-2 translate-x-2">{cat.icon}</div>
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase opacity-70 mb-1">{cat.en}</p>
                  <h3 className="text-xl font-bold">{cat.label}</h3>
                </div>
                <p className="text-sm opacity-80 leading-relaxed line-clamp-2">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 精選文章 ── */}
      {latestPosts.length > 0 && (
        <section className="max-w-6xl mx-auto py-4 px-6 pb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-olive-800">精選知識</h2>
              <p className="text-gray-500 text-sm mt-1">以嚴謹科研實證，探索橄欖油的健康奧秘</p>
            </div>
            <Link href="/blog" className="text-olive-600 hover:text-olive-800 text-sm font-medium flex items-center gap-1">
              查看全部 <span>→</span>
            </Link>
          </div>

          {/* Featured post */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className="block mb-8 group">
              <article className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden grid md:grid-cols-2">
                {featuredPost.coverImage && (
                  <div className="relative h-64 md:h-80">
                    <Image
                      src={(imagesData.posts?.[featuredPost.slug]?.url) || featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-xs bg-olive-100 text-olive-700 px-3 py-1 rounded-full inline-block w-fit mb-3 font-medium">
                    最新文章
                  </span>
                  <h3 className="text-2xl font-bold text-olive-800 mb-3 leading-tight group-hover:text-olive-600 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>⏱️ {featuredPost.readTime} 分鐘</span>
                    <span>📅 {new Date(featuredPost.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Post grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden h-full">
                  {post.coverImage && (
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={(imagesData.posts?.[post.slug]?.url) || post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-olive-800 mb-2 text-sm leading-snug line-clamp-2 group-hover:text-olive-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{post.readTime} 分鐘閱讀</span>
                      <span className="text-olive-600 font-medium">閱讀 →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 科學數據帶 ── */}
      <section className="bg-olive-800 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 text-center">
          {[
            { num: '7,447', label: '位', desc: 'PREDIMED 研究受試者', sub: '史上最大地中海飲食研究' },
            { num: '30%', label: '', desc: '心血管風險降低', sub: '高多酚 EVOO 組別數據' },
            { num: '250mg', label: '/kg+', desc: '高多酚標準含量', sub: 'EFSA 認可健康聲稱門檻' },
            { num: '3000', label: '年', desc: '橄欖樹文明歷史', sub: '克里特島古木仍在結果' },
          ].map((stat) => (
            <div key={stat.desc} className="group">
              <div className="text-4xl font-bold text-gold-400 mb-1">
                {stat.num}<span className="text-2xl">{stat.label}</span>
              </div>
              <div className="font-medium text-white text-sm mb-1">{stat.desc}</div>
              <div className="text-xs text-olive-300">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 訂閱 ── */}
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

      {/* ── 聯絡 ── */}
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
