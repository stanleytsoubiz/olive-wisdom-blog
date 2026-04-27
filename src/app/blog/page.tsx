import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { getImages, getHeroImage, getPostImageUrl, type ImagesData } from '@/lib/images';
import type { Metadata } from 'next';
import BlogFilter from '@/components/BlogFilter';

export const metadata: Metadata = {
  title: '橄欖油知識庫｜科學萃取・品味鑑賞・知性史詩・餐桌美學',
  description: '知橄生活精選 16 篇深度文章：多酚 SIRT1 抗衰老、羥基酪醇腦保護、地中海飲食女性研究、IOC 感官評鑑標準、橄欖油真偽鑑別——引用 PREDIMED、哈佛、EFSA 科學文獻。',
  keywords: ['橄欖油知識庫', '特級初榨橄欖油', '多酚', '地中海飲食', '橄欖油選購', 'EVOO科學'],
  openGraph: {
    title: '知橄生活知識庫 — 橄欖油科學・地中海美學・深度文章',
    description: '16 篇深度文章，引用 150+ 篇學術文獻，探索橄欖油分子科學、歷史文化與生活美學。',
    url: 'https://olive-wisdom.com/blog',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80', width: 1200, height: 630, alt: '知橄生活知識庫' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '知橄生活知識庫 — 橄欖油科學深度文章',
    description: '16 篇深度文章，探索橄欖油分子科學、歷史文化與生活美學。',
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80'],
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
    <main className="min-h-screen bg-olive-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://olive-wisdom.com' },
          { '@type': 'ListItem', position: 2, name: '知識庫', item: 'https://olive-wisdom.com/blog' },
        ],
      }) }} />
      {/* Header */}
      <section className="relative bg-gradient-to-br from-olive-900 to-olive-700 text-white py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={blogHero.url}
            alt={blogHero.alt || ''} fill className="object-cover" unoptimized
          />
        </div>
        <div className="relative">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-3 font-medium">知橄知識庫</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">知橄文章</h1>
          <p className="text-olive-200 max-w-xl mx-auto text-base leading-relaxed">
            以科學實證為基礎，探索橄欖油的健康奧秘與地中海生活哲學
          </p>
        </div>
      </section>

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
