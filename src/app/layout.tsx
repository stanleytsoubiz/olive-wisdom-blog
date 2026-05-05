import type { Metadata } from 'next';
import Link from 'next/link';
import SubscribeForm from '@/components/SubscribeForm';
import ScrollHeader from '@/components/ScrollHeader';
import MobileMenu from '@/components/MobileMenu';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { getAllPosts } from '@/lib/posts';
import { Noto_Serif_TC, Noto_Sans_TC } from 'next/font/google';
import './globals.css';

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '知橄生活 Olive Wisdom — 以科學與美學，精煉您的健康時光',
    template: '%s｜知橄生活 Olive Wisdom',
  },
  description:
    '知橄生活 Olive Wisdom，為 35+ 知性追求者打造的橄欖油科學與美學空間。以嚴謹科研實證，引導您認識液態黃金的健康奧秘：多酚、SIRT1、羥基酪醇、地中海飲食完整知識庫。',
  metadataBase: new URL('https://olive-wisdom.com'),
  keywords: ['橄欖油', '特級初榨橄欖油', 'EVOO', '地中海飲食', '抗衰老', '多酚', '羥基酪醇', 'SIRT1', '健康飲食'],
  authors: [{ name: '知橄生活研究團隊', url: 'https://olive-wisdom.com' }],
  creator: '知橄生活 Olive Wisdom',
  publisher: '知橄生活 Olive Wisdom',
  robots: { index: true, follow: true },
  openGraph: {
    title: '知橄生活 Olive Wisdom — 以科學與美學，精煉您的健康時光',
    description: '為 35+ 知性追求者打造的橄欖油科學與美學空間，以嚴謹科研實證探索地中海飲食與長壽之道。',
    url: 'https://olive-wisdom.com',
    siteName: '知橄生活 Olive Wisdom',
    locale: 'zh_TW',
    type: 'website',
    images: [
      {
        url: 'https://olive-wisdom.com/hero-grove.webp',
        width: 1200,
        height: 630,
        alt: '知橄生活 Olive Wisdom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@OliveWisdomTW',
    creator: '@OliveWisdomTW',
    title: '知橄生活 Olive Wisdom',
    description: '為 35+ 知性追求者打造的橄欖油科學與美學空間',
    images: ['https://olive-wisdom.com/hero-grove.webp'],
  },
  alternates: {
    canonical: 'https://olive-wisdom.com',
    languages: {
      'zh-TW': 'https://olive-wisdom.com',
      'x-default': 'https://olive-wisdom.com',
    },
  },
};

const NAV_LINKS = [
  { href: '/blog?cat=science', label: '科學萃取' },
  { href: '/blog?cat=health', label: '品味鑑賞' },
  { href: '/blog?cat=lifestyle', label: '餐桌美學' },
  { href: '/blog?cat=culture', label: '知性史詩' },
  { href: '/topics', label: '所有主題' },
  { href: '/about', label: '關於知橄' },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Dynamic footer: show 4 most recent posts
  const recentPosts = getAllPosts().slice(0, 4);
  return (
    <html lang="zh-TW" className={`${notoSerifTC.variable} ${notoSansTC.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#4a5824" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* next/font handles Google Fonts preconnect automatically */}
        {/* LCP Hero image preload */}
        <link
          rel="preload"
          as="image"
          href="/hero-grove.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: '知橄生活 Olive Wisdom',
              alternateName: ['Olive Wisdom', '知橄生活'],
              url: 'https://olive-wisdom.com',
              logo: { '@type': 'ImageObject', url: 'https://olive-wisdom.com/favicon.ico', caption: '知橄生活 Olive Wisdom' },
              description: '由食品科學、分子生物學與地中海飲食研究背景的編輯團隊撰稿，引用 PREDIMED、哈佛醫學院、EFSA 等 150+ 篇學術文獻的橄欖油知識平台。',
              knowsAbout: ['橄欖油', '特級初榨橄欖油 EVOO', '地中海飲食', '多酚', '羥基酪醇', 'PREDIMED 研究', '抗老化科學'],
              sameAs: ['https://olive-wisdom.com', 'https://olive-wisdom.com/about', 'https://olive-wisdom.com/editorial-standards'],
              publishingPrinciples: 'https://olive-wisdom.com/editorial-standards',
              ethicsPolicy: 'https://olive-wisdom.com/editorial-standards',
              correctionsPolicy: 'https://olive-wisdom.com/editorial-standards',
            }),
          }}
        />
      </head>
      <GoogleAnalytics />
      <body className={`bg-[#FAF8F4] text-[#2C2416] font-sans antialiased min-h-screen flex flex-col ${notoSerifTC.variable} ${notoSansTC.variable}`}>
        {/* Global Header */}
        <ScrollHeader>
          <div className="max-w-6xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* SVG olive mark */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
                <ellipse cx="14" cy="14" rx="5" ry="8" fill="#4a5824" transform="rotate(-20 14 14)" />
                <path d="M14 6 Q18 10 16 16 Q14 20 12 18" stroke="#7a8f3a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                <path d="M14 8 Q9 6 8 12" stroke="#4a5824" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7"/>
              </svg>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="text-sm font-bold text-olive-900 group-hover:text-olive-700 transition-colors tracking-tight">
                  知橄生活
                </span>
                <span className="text-[10px] text-olive-500 tracking-[0.25em] uppercase font-sans">Olive Wisdom</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-stone-500 hover:text-olive-800 font-sans font-medium transition-colors tracking-wide relative group/nav"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-olive-600 group-hover/nav:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Desktop search icon */}
            <Link
              href="/search"
              aria-label="搜尋文章"
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-olive-50 transition-colors text-stone-500 hover:text-olive-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </Link>

            {/* CTA */}
            <Link
              href="/#subscribe"
              className="hidden md:inline-flex items-center gap-1 bg-olive-700 hover:bg-olive-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              訂閱專欄
            </Link>

            {/* Mobile hamburger menu */}
            <MobileMenu />
          </div>
        </ScrollHeader>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Global Footer */}
        <footer className="bg-olive-900 text-olive-200" data-pagefind-ignore>
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🫒</span>
                <div>
                  <p className="font-bold text-white text-sm">知橄生活</p>
                  <p className="text-xs text-olive-400 tracking-widest uppercase">Olive Wisdom</p>
                </div>
              </div>
              <p className="text-sm text-olive-300 leading-relaxed">
                以科學與美學，精煉您的健康時光。<br />
                為 35+ 知性人士打造的橄欖油科學與美學空間。
              </p>
            </div>

            {/* 專欄導覽 */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">專欄導覽</p>
              <ul className="space-y-2 text-sm text-olive-300">
                <li><Link href="/blog?cat=culture" className="hover:text-white transition-colors">知性史詩</Link></li>
                <li><Link href="/blog?cat=science" className="hover:text-white transition-colors">科學萃取</Link></li>
                <li><Link href="/blog?cat=health" className="hover:text-white transition-colors">品味鑑賞</Link></li>
                <li><Link href="/blog?cat=lifestyle" className="hover:text-white transition-colors">餐桌美學</Link></li>
              </ul>
            </div>

            {/* 最新文章 — dynamic */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">最新文章</p>
              <ul className="space-y-3 text-sm">
                {recentPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-olive-300 hover:text-white transition-colors leading-snug line-clamp-2 block"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 訂閱 */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">訂閱知橄週報</p>
              <p className="text-xs text-olive-300 mb-4 leading-relaxed">每週精選橄欖油研究・免費・隨時可取消</p>
              <Link
                href="/#subscribe"
                className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-olive-900 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                🫒 立即訂閱
              </Link>
              <p className="text-xs text-olive-400 mt-3">訂閱即贈《橄欖油品飲師口袋手冊》PDF</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-olive-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-olive-200 text-center sm:text-left">
              <p>© 2026 知橄生活 OLIVE WISDOM. ALL RIGHTS RESERVED.</p>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
                <Link href="/editorial-standards" className="hover:text-white transition-colors">編輯標準</Link>
                <Link href="/topics" className="hover:text-white transition-colors">所有主題</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">隱私政策</Link>
                <Link href="/terms" className="hover:text-white transition-colors">使用條款</Link>
                <Link href="/about" className="hover:text-white transition-colors">關於知橄</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
