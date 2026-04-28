'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PostFrontmatter } from '@/lib/posts';
import type { ImagesData } from '@/lib/images';

const CATEGORY_MAP: Record<string, { label: string; bgColor: string }> = {
  science:   { label: '科學萃取', bgColor: 'bg-emerald-100 text-emerald-800' },
  lifestyle: { label: '餐桌美學', bgColor: 'bg-amber-100 text-amber-800' },
  health:    { label: '品味鑑賞', bgColor: 'bg-rose-100 text-rose-800' },
  culture:   { label: '知性史詩', bgColor: 'bg-purple-100 text-purple-800' },
  heritage:  { label: '知性史詩', bgColor: 'bg-purple-100 text-purple-800' },
};

const CAT_TABS = [
  { key: '', label: '全部文章' },
  { key: 'science', label: '科學萃取' },
  { key: 'health', label: '品味鑑賞' },
  { key: 'lifestyle', label: '餐桌美學' },
  { key: 'culture', label: '知性史詩' },
];

interface Props {
  posts: PostFrontmatter[];
  imagesData?: ImagesData;
}

export default function BlogFilter({ posts, imagesData }: Props) {
  const [activeCat, setActiveCat] = useState('');

  const filtered = activeCat
    ? posts.filter((p) => {
        const c = p.category?.toLowerCase();
        if (activeCat === 'culture') return c === 'culture' || c === 'heritage';
        return c === activeCat;
      })
    : posts;

  return (
    <>
      {/* Category Tabs */}
      <div className="sticky top-16 z-40 bg-white border-b border-olive-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-1 py-3 min-w-max px-1">
            {CAT_TABS.map((tab) => {
              const isActive = tab.key === activeCat;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCat(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-olive-700 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-olive-100 hover:text-olive-700'
                  }`}
                >
                  {tab.label}
                  {tab.key === '' && (
                    <span className="ml-1.5 text-xs opacity-60">({posts.length})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🫒</p>
            <p className="text-gray-500 text-lg">此欄目文章準備中，敬請期待</p>
            <button
              onClick={() => setActiveCat('')}
              className="inline-block mt-6 text-olive-600 hover:underline"
            >
              ← 返回全部文章
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.length > 0 && (
              <div className="col-span-full mb-2 text-xs text-gray-400 font-sans">
                共 <strong className="text-olive-600">{filtered.length}</strong> 篇
                {activeCat && <span> {CATEGORY_MAP[activeCat as keyof typeof CATEGORY_MAP]?.label || activeCat}</span>} 文章
              </div>
            )}
            {filtered.map((post) => {
              const catInfo = CATEGORY_MAP[post.category] ?? { label: post.category, bgColor: 'bg-gray-100 text-gray-700' };
              return (
                <article key={post.slug} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    {post.coverImage && (
                      <div className="relative h-44 sm:h-52 overflow-hidden">
                        <Image
                          src={(imagesData?.posts?.[post.slug]?.url) || post.coverImage || ''}
                          alt={`${post.title} — ${CATEGORY_MAP[post.category]?.label || '橄欖油'} | 知橄生活`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized
                        />
                        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${catInfo.bgColor} shadow-sm`}>
                          {catInfo.label}
                        </span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                        <span>⏱️ {post.readTime} 分鐘閱讀</span>
                        <span>·</span>
                        <span>{new Date(post.date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}</span>
                      </div>
                      <h2 className="text-base font-bold text-olive-800 mb-2 leading-snug group-hover:text-olive-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <span className="text-xs text-olive-600 font-semibold group-hover:underline">
                        閱讀全文 →
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
