import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchClient from './SearchClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  // Title template in layout.tsx adds "｜知橄生活 Olive Wisdom" once.
  title: '搜尋文章',
  description: '搜尋知橄生活所有橄欖油科學、地中海飲食、品飲鑑賞深度文章。',
  // Temporary safety measure (2026-11-22): noindex until a real-browser
  // keyword test confirms the pagefind search works end to end.
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://olive-wisdom.com/search' },
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#fafaf7]">
      {/* Masthead */}
      <section className="bg-white border-b border-stone-200 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-sans font-semibold text-stone-400 tracking-[0.3em] uppercase mb-3">
            知橄生活 · 全文搜尋
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-olive-900 tracking-tight mb-3">
            搜尋文章
          </h1>
          <p className="text-stone-500 font-sans text-sm">
            搜尋橄欖油科學・地中海飲食・品飲鑑賞・知性史詩
          </p>
        </div>
      </section>

      {/* Search UI */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <SearchClient />
      </section>
    </main>
  );
}
