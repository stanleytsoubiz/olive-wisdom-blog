import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { getAllPosts } from '@/lib/posts';
import { getImages, getHeroImage, getPostImageUrl, type ImagesData } from '@/lib/images';
import type { Metadata } from 'next';
import BlogFilter from '@/components/BlogFilter';
import SearchBar from '@/components/SearchBar';

export const metadata: Metadata = {
  title: '橄欖油知識庫｜科學萃取・品味鑑賞・知性史詩・餐桌美學',
  description: '知橄生活深度文章庫：多酚 SIRT1 抗衰老、羥基酪醇腦保護、地中海飲食女性研究、IOC 感官評鑑標準、橄欖油真偽鑑別——引用 PREDIMED、哈佛、EFSA 科學文獻。',
  keywords: ['橄欖油知識庫', '特級初榨橄欖油', '多酚', '地中海飲食', '橄欖油選購', 'EVOO科學'],
  openGraph: {
    title: '知橄生活知識庫 — 橄欖油科學・地中海美學・深度文章',
    description: '深度文章庫，引用 150+ 篇學術文獻，探索橄欖油分子科學、歷史文化與生活美學。',
    url: 'https://olive-wisdom.com/blog',
    type: 'website',
    images: [{ url: 'https://olive-wisdom.com/hero-grove.webp', width: 1200, height: 630, alt: '知橄生活知識庫' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '知橄生活知識庫 — 橄欖油科學深度文章',
    description: '深度文章庫，探索橄欖油分子科學、歷史文化與生活美學。',
    images: ['https://olive-wisdom.com/hero-grove.webp'],
  },
  alternates: {
    canonical: 'https://olive-wisdom.com/blog',
    languages: { 'zh-TW': 'https://olive-wisdom.com/blog', 'x-default': 'https://olive-wisdom.com/blog' },
  },
};

export const dynamic = 'force-static';

export default async function BlogPage() {
  const posts = getAllPosts();
  const imagesData = await getImages();
  const blogHero = getHeroImage(imagesData, 'blog');

  return (
    <main className="min-h-screen bg-[#fafaf7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://olive-wisdom.com' },
          { '@type': 'ListItem', position: 2, name: '知識庫', item: 'https://olive-wisdom.com/blog' },
        ],
      }) }} />
      {/* Header — Kinfolk editorial masthead */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={blogHero.url}
          alt={blogHero.alt || '知橄生活知識庫 — 橄欖油科學與地中海美學'}
          fill className="object-cover object-center" priority unoptimized
        />
        {/* Bottom-up gradient only — same pattern as homepage hero */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        {/* Top decorative line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

        {/* Bottom-anchored copy */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-5xl mx-auto">
          <p className="text-gold-400 text-[10px] font-sans font-semibold tracking-[0.35em] uppercase mb-3">
            知橄生活 · 知識庫
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-2">
            深度文章
          </h1>
          <p className="text-olive-200 text-sm md:text-base font-sans max-w-md leading-relaxed">
            引用學術・不接業配・每篇皆可溯源
          </p>
        </div>
      </section>

      {/* Search bar — above category tabs */}
      <div className="bg-[#fafaf7] px-6 pt-8 pb-4">
        <Suspense fallback={null}>
          <SearchBar placeholder="搜尋橄欖油科學・地中海飲食・品飲鑑賞…" />
        </Suspense>
      </div>

      {/* Client-side filter + grid */}
      <BlogFilter posts={posts} imagesData={imagesData} />

      {/* CTA */}
      <section className="bg-olive-100 py-14 px-6 text-center">
        <h2 className="text-2xl font-bold text-olive-800 mb-3">每週獲取最新橄欖油知識</h2>
        <p className="text-gray-600 mb-6 text-sm">訂閱知橄週報，精選研究直送信箱</p>
        <Link
          href="/#subscribe"
          className="inline-block bg-olive-700 hover:bg-olive-800 text-white px-8 py-3 rounded-xl font-medium transition-colors"
        >
          立即訂閱 🫒
        </Link>
      </section>
    </main>
  );
}
