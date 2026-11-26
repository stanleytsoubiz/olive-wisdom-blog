import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollHeader from '@/components/ScrollHeader';
import MobileMenu from '@/components/MobileMenu';
import BottomNav from '@/components/BottomNav';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Noto_Serif_TC, Noto_Sans_TC } from 'next/font/google';
import { CATEGORY_COLUMNS } from '@/lib/categories';
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
    default: '知橄生活 Olive Wisdom — 華語世界的橄欖油知識平台',
    template: '%s｜知橄生活 Olive Wisdom',
  },
  description:
    '知橄生活 Olive Wisdom，華語世界的橄欖油知識平台——不接業配・引用學術・說清楚證據邊界。以 IOC 國際標準與同儕審查文獻，判讀多酚、羥基酪醇與地中海飲食的證據強度。',
  metadataBase: new URL('https://olive-wisdom.com'),
  keywords: ['橄欖油', '特級初榨橄欖油', 'EVOO', '地中海飲食', '多酚', '羥基酪醇', '證據判讀', 'IOC 標準', '健康飲食'],
  authors: [{ name: '知橄生活研究團隊', url: 'https://olive-wisdom.com' }],
  creator: '知橄生活 Olive Wisdom',
  publisher: '知橄生活 Olive Wisdom',
  robots: { index: true, follow: true },
  openGraph: {
    title: '知橄生活 Olive Wisdom — 華語世界的橄欖油知識平台',
    description: '不接業配・引用學術・說清楚證據邊界。以 IOC 標準與同儕審查文獻，判讀每一項橄欖油主張的證據等級。',
    url: 'https://olive-wisdom.com',
    siteName: '知橄生活 Olive Wisdom',
    locale: 'zh_TW',
    type: 'website',
    images: [
      {
        url: 'https://olive-wisdom.com/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: '知橄生活 Olive Wisdom',
      },
    ],
  },
  alternates: {
    canonical: 'https://olive-wisdom.com',
    languages: {
      'zh-TW': 'https://olive-wisdom.com',
      'x-default': 'https://olive-wisdom.com',
    },
  },
  verification: {
    google: 'M59hCe9kdllyuhUHkoWUZdkDEp-0ONqeS3I7EIt9cTs',
  },
};

const NAV_LINKS = [
  ...CATEGORY_COLUMNS.map((c) => ({ href: c.href, label: c.label })),
  { href: '/topics', label: '所有主題' },
  { href: '/selection', label: '選品標準' },
  { href: '/evidence', label: '證據圖書館' },
  { href: '/about', label: '關於知橄' },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${notoSerifTC.variable} ${notoSansTC.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
              logo: { '@type': 'ImageObject', url: 'https://olive-wisdom.com/icon-512.png', caption: '知橄生活 Olive Wisdom' },
              description: '由食品科學、分子生物學與地中海飲食研究背景的編輯團隊撰稿，引用 PREDIMED、哈佛醫學院、EFSA 等權威機構研究文獻的橄欖油知識平台。',
              knowsAbout: ['橄欖油', '特級初榨橄欖油 EVOO', '地中海飲食', '多酚', '羥基酪醇', 'PREDIMED 研究', '證據分級判讀'],
              sameAs: ['https://olive-wisdom.com', 'https://olive-wisdom.com/about'],
              publishingPrinciples: 'https://olive-wisdom.com/about#editorial-standards',
              ethicsPolicy: 'https://olive-wisdom.com/about#editorial-standards',
              correctionsPolicy: 'https://olive-wisdom.com/about#editorial-standards',
            }),
          }}
        />
      </head>
      <GoogleAnalytics />
      <body className={`bg-[#FAF8F4] text-[#2C2416] font-sans antialiased min-h-screen flex flex-col ${notoSerifTC.variable} ${notoSansTC.variable}`}>
        {/* Skip link (a11y): visually hidden until keyboard focus */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-olive-800 focus:text-white focus:text-sm focus:font-medium focus:px-4 focus:py-2 focus:rounded-lg"
        >
          跳到主要內容
        </a>
        {/* Global Header */}
        <ScrollHeader>
          <div className="max-w-6xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* SVG olive cluster mark — one-colour silhouette glyph of the 7D-4 engraved cluster, same mark as favicon.svg / app icons */}
              <svg width="30" height="30" viewBox="0 0 64 64" fill="none" className="flex-shrink-0" aria-hidden="true">
<path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(32 18) rotate(-4) scale(0.24 0.175)" fill="#4A5824"/>
                <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(30 17) rotate(-48) scale(0.25 0.19)" fill="#4A5824"/>
                <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(27 20) rotate(-88) scale(0.26 0.225)" fill="#4A5824"/>
                <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(26 27) rotate(-120) scale(0.25 0.21)" fill="#4A5824"/>
                <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(27 38) rotate(-168) scale(0.25 0.2)" fill="#4A5824"/>
                <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(38 38) rotate(172) scale(0.25 0.2)" fill="#4A5824"/>
                <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(44 34) rotate(138) scale(0.25 0.205)" fill="#4A5824"/>
                <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(45 25) rotate(90) scale(0.24 0.18)" fill="#4A5824"/>
                <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(34 17) rotate(44) scale(0.25 0.19)" fill="#4A5824"/>
                <path d="M32 18 L20.5 20.0" stroke="#4A5824" strokeWidth="2.6" strokeLinecap="round"/>
                <path d="M32 18 L42.5 21.5" stroke="#4A5824" strokeWidth="2.6" strokeLinecap="round"/>
                <path d="M32 18 L24.5 26.0" stroke="#4A5824" strokeWidth="2.6" strokeLinecap="round"/>
                <path d="M32 18 L36.5 28.5" stroke="#4A5824" strokeWidth="2.6" strokeLinecap="round"/>
                <ellipse cx="20.5" cy="23.5" rx="7.6" ry="6.3" transform="rotate(-14 20.5 23.5)" fill="#4A5824" stroke="#FFFFFF" strokeWidth="3.0"/>
                <ellipse cx="42.5" cy="26.5" rx="8.8" ry="6.9" transform="rotate(22 42.5 26.5)" fill="#4A5824" stroke="#FFFFFF" strokeWidth="3.0"/>
                <ellipse cx="24.5" cy="34.5" rx="8.4" ry="10.3" transform="rotate(-13 24.5 34.5)" fill="#4A5824" stroke="#FFFFFF" strokeWidth="3.0"/>
                <ellipse cx="36.5" cy="38.0" rx="9.0" ry="11.0" transform="rotate(-7 36.5 38.0)" fill="#4A5824" stroke="#FFFFFF" strokeWidth="3.0"/>
              </svg>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="text-sm font-bold text-olive-900 group-hover:text-olive-700 transition-colors tracking-tight">
                  知橄生活
                </span>
                <span className="text-[10px] text-olive-500 tracking-[0.25em] uppercase font-sans">Olive Wisdom</span>
              </div>
            </Link>

            {/* Desktop Nav — lg breakpoint: with 證據圖書館 added, eight links
                no longer fit beside logo + search + CTA at md widths */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
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
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-olive-50 transition-colors text-stone-500 hover:text-olive-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </Link>

            {/* CTA — plain text link to the homepage follow section */}
            <Link
              href="/#follow"
              className="hidden lg:inline-flex items-center gap-1 text-olive-700 hover:text-olive-900 text-sm font-medium transition-colors"
            >
              追蹤知橄生活 →
            </Link>

            {/* Mobile search icon — restored as a permanent header entry
                (blueprint 2.6); search is no longer only inside the menu */}
            <Link
              href="/search"
              aria-label="搜尋文章"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-olive-50 transition-colors text-olive-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </Link>

            {/* Mobile hamburger menu */}
            <MobileMenu />
          </div>
        </ScrollHeader>

        {/* Page Content */}
        <div className="flex-1" id="main-content" tabIndex={-1}>
          {children}
        </div>

        {/* Global Footer */}
        <footer className="bg-olive-900 text-olive-200" data-pagefind-ignore>
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                {/* SVG olive cluster mark — one-colour silhouette glyph, same mark as the header logo and favicon.svg */}
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none" className="flex-shrink-0" aria-hidden="true">
<path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(32 18) rotate(-4) scale(0.24 0.175)" fill="#F3EFDF"/>
                  <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(30 17) rotate(-48) scale(0.25 0.19)" fill="#F3EFDF"/>
                  <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(27 20) rotate(-88) scale(0.26 0.225)" fill="#F3EFDF"/>
                  <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(26 27) rotate(-120) scale(0.25 0.21)" fill="#F3EFDF"/>
                  <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(27 38) rotate(-168) scale(0.25 0.2)" fill="#F3EFDF"/>
                  <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(38 38) rotate(172) scale(0.25 0.2)" fill="#F3EFDF"/>
                  <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(44 34) rotate(138) scale(0.25 0.205)" fill="#F3EFDF"/>
                  <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(45 25) rotate(90) scale(0.24 0.18)" fill="#F3EFDF"/>
                  <path d="M0 0 C 20.7 -30.0, 19.0 -72.0, 0 -100 C -19.0 -72.0, -20.7 -30.0, 0 0 Z" transform="translate(34 17) rotate(44) scale(0.25 0.19)" fill="#F3EFDF"/>
                  <path d="M32 18 L20.5 20.0" stroke="#F3EFDF" strokeWidth="2.6" strokeLinecap="round"/>
                  <path d="M32 18 L42.5 21.5" stroke="#F3EFDF" strokeWidth="2.6" strokeLinecap="round"/>
                  <path d="M32 18 L24.5 26.0" stroke="#F3EFDF" strokeWidth="2.6" strokeLinecap="round"/>
                  <path d="M32 18 L36.5 28.5" stroke="#F3EFDF" strokeWidth="2.6" strokeLinecap="round"/>
                  <ellipse cx="20.5" cy="23.5" rx="7.6" ry="6.3" transform="rotate(-14 20.5 23.5)" fill="#F3EFDF" stroke="#343D1B" strokeWidth="3.0"/>
                  <ellipse cx="42.5" cy="26.5" rx="8.8" ry="6.9" transform="rotate(22 42.5 26.5)" fill="#F3EFDF" stroke="#343D1B" strokeWidth="3.0"/>
                  <ellipse cx="24.5" cy="34.5" rx="8.4" ry="10.3" transform="rotate(-13 24.5 34.5)" fill="#F3EFDF" stroke="#343D1B" strokeWidth="3.0"/>
                  <ellipse cx="36.5" cy="38.0" rx="9.0" ry="11.0" transform="rotate(-7 36.5 38.0)" fill="#F3EFDF" stroke="#343D1B" strokeWidth="3.0"/>
                </svg>
                <div>
                  <p className="font-bold text-white text-sm">知橄生活</p>
                  <p className="text-xs text-olive-400 tracking-widest uppercase">Olive Wisdom</p>
                </div>
              </div>
              <p className="text-sm text-olive-300 leading-relaxed">
                用證據判讀橄欖油——不接業配・引用學術・說清楚證據邊界。
              </p>
            </div>

            {/* 專欄導覽 */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">專欄導覽</p>
              <ul className="space-y-2 text-sm text-olive-300">
                {CATEGORY_COLUMNS.map((col) => (
                  <li key={col.key}><Link href={col.href} className="hover:text-white transition-colors">{col.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* 編輯精選 — closest to a purchase decision, not the latest posts */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">編輯精選</p>
              <ul className="space-y-3 text-sm">
                {[
                  { slug: 'olive-oil-complete-buying-guide-2026', title: '橄欖油選購完全指南 2026：從超市到莊園油，五步驟自己判斷' },
                  { slug: 'olive-oil-cooking-polyphenol-retention-japan', title: '橄欖油炒菜，多酚還剩多少？從日本家庭廚房看加熱後的保留率' },
                  { slug: 'predimed-study-complete-explainer-olive-oil-heart', title: 'PREDIMED 研究完整解析：7,447 人試驗如何理解橄欖油與心血管證據' },
                ].map((post) => (
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

            {/* 追蹤 — plain text link to the homepage follow section */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">追蹤知橄生活</p>
              <p className="text-xs text-olive-300 mb-4 leading-relaxed">新文章公布在網站上，官方社群與 LINE 正在籌備中，歡迎常回來看看</p>
              <Link
                href="/#follow"
                className="text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors"
              >
                追蹤知橄生活 →
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-olive-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-olive-200 text-center sm:text-left">
              <p>© 2026 知橄生活 OLIVE WISDOM. ALL RIGHTS RESERVED.</p>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
                <Link href="/about#editorial-standards" className="hover:text-white transition-colors">編輯標準</Link>
                <Link href="/evidence" className="hover:text-white transition-colors">證據圖書館</Link>
                <Link href="/topics" className="hover:text-white transition-colors">所有主題</Link>
                <Link href="/contact" className="hover:text-white transition-colors">聯絡我們</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">隱私政策</Link>
                <Link href="/terms" className="hover:text-white transition-colors">使用條款</Link>
                <Link href="/about" className="hover:text-white transition-colors">關於知橄</Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Mobile bottom navigation (blueprint 2.6) + spacer so the fixed
            bar never covers footer content on mobile. Bar is 60px + safe
            area; spacer adds clearance above that (wave 1) so the last
            footer line and anchored sections are never hidden behind it. */}
        <div className="md:hidden" style={{ height: 'calc(84px + env(safe-area-inset-bottom))' }} aria-hidden="true" />
        <BottomNav />
      </body>
    </html>
  );
}
