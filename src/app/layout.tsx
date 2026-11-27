import type { Metadata } from 'next';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import ScrollHeader from '@/components/ScrollHeader';
import BottomNav from '@/components/BottomNav';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Noto_Serif_TC, Noto_Sans_TC } from 'next/font/google';
import { CATEGORY_COLUMNS } from '@/lib/categories';
import './globals.css';

// Perf (2026-11-26 tranche): MobileMenu is interaction-only (a hamburger
// button + a portal overlay shown on tap). Code-split it out of the
// shared initial bundle; it still SSRs the button, and its chunk loads
// off the critical path on every page.
const MobileMenu = nextDynamic(() => import('@/components/MobileMenu'));

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#4a5824" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* next/font handles Google Fonts preconnect automatically */}
        {/* hero-grove.webp 只在首頁使用（首頁以 next/Image priority 自行
            preload，另有 _headers 的 Link 標頭兜底）。先前在此全站 preload
            會讓每篇文章頁都以 high priority 搶下載 252 KiB 首頁圖、與文章
            封面競速，拖慢文章頁 LCP——2026-11-26 效能基線量測後移除。 */}
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
              {/* Brand mark — refined B olive-branch mark (true vector) on a cream rounded tile */}
              <svg width="40" height="40" viewBox="0 0 64 64" fill="none" className="flex-shrink-0" aria-hidden="true">
                <rect x="1.5" y="1.5" width="61" height="61" rx="14" fill="#F9F5EB" stroke="#D9D2BC" strokeWidth="1.5"/>
                <g transform="translate(-4.36 -4.09) scale(0.1417)">
                  <path d="M174.8 116.4 L197.8 117.5 L214.3 121.1 L230.5 126.8 L249.3 136.2 L276.2 158.3 L288.0 172.5 L300.5 191.6 L307.0 196.4 L315.4 199.2 L331.9 196.4 L342.0 190.1 L352.3 179.8 L360.1 169.5 L369.4 151.0 L373.9 134.0 L381.5 133.2 L385.7 134.9 L393.1 144.0 L394.2 148.7 L393.1 153.8 L383.6 172.8 L370.2 189.9 L353.3 207.0 L343.1 225.2 L341.8 232.7 L343.0 251.5 L350.6 274.2 L355.3 295.5 L352.9 321.2 L346.1 339.2 L340.9 339.4 L325.8 320.7 L316.3 299.4 L313.9 287.3 L312.7 268.6 L316.2 247.6 L328.2 221.0 L310.3 229.9 L296.3 240.3 L281.4 257.7 L276.2 267.7 L274.3 276.1 L284.6 282.2 L290.7 288.2 L300.0 303.9 L303.7 320.9 L303.8 337.2 L300.1 354.3 L291.6 371.3 L281.8 382.5 L270.6 389.4 L258.3 393.0 L243.4 391.8 L234.7 388.7 L224.1 379.5 L216.8 368.0 L212.0 351.5 L211.9 329.9 L215.5 313.1 L223.2 298.0 L240.3 280.9 L248.5 276.8 L260.0 274.1 L266.0 258.5 L280.9 237.3 L280.2 235.5 L264.4 239.9 L230.8 268.7 L202.3 283.0 L177.1 289.9 L162.8 291.1 L130.9 290.0 L119.1 286.2 L119.3 282.0 L128.0 268.9 L147.1 247.3 L166.4 232.7 L181.0 225.4 L204.2 218.4 L223.0 216.1 L257.1 219.5 L258.7 221.5 L254.1 225.8 L212.1 240.1 L175.9 258.1 L175.7 260.8 L239.5 235.4 L294.1 219.2 L313.7 210.0 L312.3 207.5 L304.5 206.9 L292.1 200.7 L229.5 159.4 L229.7 162.2 L239.8 171.0 L271.7 193.8 L291.3 204.9 L293.6 208.6 L291.3 210.4 L285.7 210.5 L253.5 207.0 L241.5 203.4 L222.4 193.8 L202.8 177.9 L189.2 160.5 L176.6 137.5 L171.9 123.5 L171.8 118.7 Z" fill="#476533" fillRule="evenodd"/>
                  <path d="M249.7 293.1 L250.8 294.8 L249.3 298.1 L241.0 308.2 L232.5 322.8 L227.7 343.2 L226.5 328.9 L230.3 313.8 L238.5 300.4 L244.7 294.4 Z" fill="#F9F5EB" fillRule="evenodd"/>
                </g>
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
                {/* Brand mark — refined B olive-branch mark (true vector) on a cream rounded tile */}
                <svg width="36" height="36" viewBox="0 0 64 64" fill="none" className="flex-shrink-0" aria-hidden="true">
                  <rect x="1.5" y="1.5" width="61" height="61" rx="14" fill="#F9F5EB" stroke="#D9D2BC" strokeWidth="1.5"/>
                  <g transform="translate(-4.36 -4.09) scale(0.1417)">
                    <path d="M174.8 116.4 L197.8 117.5 L214.3 121.1 L230.5 126.8 L249.3 136.2 L276.2 158.3 L288.0 172.5 L300.5 191.6 L307.0 196.4 L315.4 199.2 L331.9 196.4 L342.0 190.1 L352.3 179.8 L360.1 169.5 L369.4 151.0 L373.9 134.0 L381.5 133.2 L385.7 134.9 L393.1 144.0 L394.2 148.7 L393.1 153.8 L383.6 172.8 L370.2 189.9 L353.3 207.0 L343.1 225.2 L341.8 232.7 L343.0 251.5 L350.6 274.2 L355.3 295.5 L352.9 321.2 L346.1 339.2 L340.9 339.4 L325.8 320.7 L316.3 299.4 L313.9 287.3 L312.7 268.6 L316.2 247.6 L328.2 221.0 L310.3 229.9 L296.3 240.3 L281.4 257.7 L276.2 267.7 L274.3 276.1 L284.6 282.2 L290.7 288.2 L300.0 303.9 L303.7 320.9 L303.8 337.2 L300.1 354.3 L291.6 371.3 L281.8 382.5 L270.6 389.4 L258.3 393.0 L243.4 391.8 L234.7 388.7 L224.1 379.5 L216.8 368.0 L212.0 351.5 L211.9 329.9 L215.5 313.1 L223.2 298.0 L240.3 280.9 L248.5 276.8 L260.0 274.1 L266.0 258.5 L280.9 237.3 L280.2 235.5 L264.4 239.9 L230.8 268.7 L202.3 283.0 L177.1 289.9 L162.8 291.1 L130.9 290.0 L119.1 286.2 L119.3 282.0 L128.0 268.9 L147.1 247.3 L166.4 232.7 L181.0 225.4 L204.2 218.4 L223.0 216.1 L257.1 219.5 L258.7 221.5 L254.1 225.8 L212.1 240.1 L175.9 258.1 L175.7 260.8 L239.5 235.4 L294.1 219.2 L313.7 210.0 L312.3 207.5 L304.5 206.9 L292.1 200.7 L229.5 159.4 L229.7 162.2 L239.8 171.0 L271.7 193.8 L291.3 204.9 L293.6 208.6 L291.3 210.4 L285.7 210.5 L253.5 207.0 L241.5 203.4 L222.4 193.8 L202.8 177.9 L189.2 160.5 L176.6 137.5 L171.9 123.5 L171.8 118.7 Z" fill="#476533" fillRule="evenodd"/>
                    <path d="M249.7 293.1 L250.8 294.8 L249.3 298.1 L241.0 308.2 L232.5 322.8 L227.7 343.2 L226.5 328.9 L230.3 313.8 L238.5 300.4 L244.7 294.4 Z" fill="#F9F5EB" fillRule="evenodd"/>
                  </g>
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
                <Link href="/methodology" className="hover:text-white transition-colors">實測方法論</Link>
                <Link href="/disclosure" className="hover:text-white transition-colors">揭露政策</Link>
                <Link href="/sponsorship" className="hover:text-white transition-colors">贊助政策</Link>
                <Link href="/screening" className="hover:text-white transition-colors">篩選框架</Link>
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
