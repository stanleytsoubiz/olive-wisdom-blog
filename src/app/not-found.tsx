import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '頁面不存在｜知橄生活',
  description: '很抱歉，您訪問的頁面不存在。探索我們的橄欖油知識庫，找到您需要的健康智慧。',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-olive-50 px-6">
      <div className="max-w-lg text-center">
        {/* Icon */}
        <div className="text-8xl mb-6 select-none">🫒</div>

        {/* Error Code */}
        <p className="text-gold-600 text-sm font-medium tracking-[0.3em] uppercase mb-3">
          頁面不存在
        </p>

        <h1 className="text-6xl font-bold text-olive-800 mb-4">404</h1>

        <p className="text-xl text-gray-600 mb-3 font-serif">
          這片橄欖園的小徑還未開闢…
        </p>
        <p className="text-gray-500 mb-10 leading-relaxed">
          您尋找的頁面可能已移動或不存在。<br />
          讓我們帶您回到充滿橄欖智慧的知識庫。
        </p>

        {/* CTAs */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-olive-600 hover:bg-olive-700 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-md"
          >
            🏡 回到首頁
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-white hover:bg-olive-50 text-olive-700 font-medium px-8 py-3 rounded-xl border border-olive-200 transition-all"
          >
            📚 探索知識庫
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-olive-100">
          <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">熱門欄目</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {[
              { href: '/blog?cat=science', label: '科學萃取' },
              { href: '/blog?cat=health', label: '品味鑑賞' },
              { href: '/blog?cat=lifestyle', label: '餐桌美學' },
              { href: '/blog?cat=culture', label: '知性史詩' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-olive-600 hover:text-olive-800 underline-offset-2 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
