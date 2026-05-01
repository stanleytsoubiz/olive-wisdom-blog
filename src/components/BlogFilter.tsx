'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { PostFrontmatter } from '@/lib/posts';
import type { ImagesData } from '@/lib/images';

const CATEGORY_MAP: Record<string, { label: string; en: string }> = {
  science:   { label: '科學萃取', en: 'Science'   },
  lifestyle: { label: '餐桌美學', en: 'Lifestyle'  },
  health:    { label: '品味鑑賞', en: 'Selection'  },
  culture:   { label: '知性史詩', en: 'Heritage'   },
  heritage:  { label: '知性史詩', en: 'Heritage'   },
  guide:     { label: '選購指南', en: 'Guide'      },
};

const CAT_TABS = [
  { key: '', label: '全部' },
  { key: 'science',   label: '科學萃取' },
  { key: 'health',    label: '品味鑑賞' },
  { key: 'lifestyle', label: '餐桌美學' },
  { key: 'culture',   label: '知性史詩' },
];

interface Props {
  posts: PostFrontmatter[];
  imagesData?: ImagesData;
}

export default function BlogFilter({ posts, imagesData }: Props) {
  const searchParams = useSearchParams();
  const searchQuery  = searchParams.get('q') || '';
  const initialCat   = searchParams.get('cat') || '';
  const [activeCat, setActiveCat] = useState(initialCat);

  useEffect(() => { if (initialCat) setActiveCat(initialCat); }, [initialCat]);

  const filtered = posts.filter((p) => {
    const matchesCat = activeCat
      ? (activeCat === 'culture'
          ? (p.category === 'culture' || p.category === 'heritage')
          : p.category === activeCat)
      : true;
    const matchesSearch = searchQuery
      ? (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (p.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
      : true;
    return matchesCat && matchesSearch;
  });

  const [featured, ...rest] = filtered;

  return (
    <>
      {/* ── Category Navigation ── */}
      <div className="sticky top-16 z-40 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {CAT_TABS.map((tab) => {
              const isActive = tab.key === activeCat;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCat(tab.key)}
                  className={`relative px-5 py-4 font-sans text-sm font-medium tracking-wide whitespace-nowrap transition-colors duration-200 ${
                    isActive ? 'text-olive-900' : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {tab.label}
                  {tab.key === '' && (
                    <span className="ml-1 text-xs opacity-40">({posts.length})</span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-olive-800" />
                  )}
                </button>
              );
            })}
            <div className="ml-auto pl-4 py-4 text-[11px] font-sans text-stone-400 whitespace-nowrap flex-shrink-0">
              {filtered.length} 篇
            </div>
          </div>
        </div>
      </div>

      {/* ── Articles ── */}
      <section className="max-w-6xl mx-auto py-14 px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-sans text-stone-400 tracking-widest uppercase text-xs mb-4">No Articles</p>
            <p className="text-stone-500 mb-6 text-sm">此欄目文章準備中，敬請期待</p>
            <button
              onClick={() => setActiveCat('')}
              className="font-sans text-sm text-olive-600 hover:text-olive-800 underline underline-offset-4"
            >
              返回全部文章
            </button>
          </div>
        ) : (
          <>
            {/* ── Featured Article ── */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="block group mb-16">
                <article className="grid md:grid-cols-5 gap-0">
                  {/* Image — 3/5, no rounded corners, no border */}
                  <div className="relative md:col-span-3 aspect-video md:aspect-auto md:h-[420px] overflow-hidden bg-stone-100">
                    <Image
                      src={(imagesData?.posts?.[featured.slug]?.url) || featured.coverImage || ''}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority
                    />
                  </div>
                  {/* Text panel — 2/5 */}
                  <div className="md:col-span-2 flex flex-col justify-center px-0 md:px-10 py-8 md:py-0">
                    {/* Category + read time */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.2em] uppercase">
                        {CATEGORY_MAP[featured.category]?.label ?? featured.category}
                      </span>
                      <span className="text-stone-200">—</span>
                      <span className="text-[10px] font-sans text-stone-400 tracking-wide">
                        {featured.readTime} min read
                      </span>
                    </div>
                    {/* Headline */}
                    <h2 className="text-2xl md:text-[1.75rem] font-bold text-stone-900 leading-[1.25] mb-4 tracking-tight group-hover:text-olive-800 transition-colors">
                      {featured.title}
                    </h2>
                    {/* Excerpt */}
                    <p className="text-stone-500 text-sm leading-[1.8] line-clamp-3 mb-6 font-sans">
                      {featured.excerpt}
                    </p>
                    {/* Byline */}
                    <div className="flex items-center justify-between border-t border-stone-100 pt-5">
                      <span className="font-sans text-xs text-stone-400">
                        {new Date(featured.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="font-sans text-sm text-olive-700 font-medium group-hover:text-olive-900 transition-colors">
                        閱讀全文 →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* ── Section Divider ── */}
            {rest.length > 0 && featured && (
              <div className="flex items-center gap-5 mb-12">
                <div className="h-px flex-1 bg-stone-200" />
                <span className="font-sans text-[10px] tracking-[0.25em] text-stone-400 uppercase">更多文章</span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>
            )}

            {/* ── Article Grid — NYT-style borderless cards ── */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {rest.map((post) => {
                  const cat = CATEGORY_MAP[post.category] ?? { label: post.category, en: 'Article' };
                  const imgUrl = (imagesData?.posts?.[post.slug]?.url) || post.coverImage || '';
                  return (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                      <article className="flex flex-col h-full">
                        {/* Image — clean frame, no border */}
                        <div className="relative aspect-video overflow-hidden bg-stone-100 mb-4 flex-shrink-0">
                          {imgUrl && (
                            <Image
                              src={imgUrl}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          )}
                        </div>
                        {/* Text — stacked, no container box */}
                        <div className="flex flex-col flex-1">
                          {/* Category label */}
                          <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.2em] uppercase mb-2">
                            {cat.label}
                          </p>
                          {/* Headline */}
                          <h2 className="text-[1rem] font-bold text-stone-900 leading-snug tracking-tight mb-2 line-clamp-2 flex-1 group-hover:text-olive-800 transition-colors">
                            {post.title}
                          </h2>
                          {/* Excerpt */}
                          <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed font-sans">
                            {post.excerpt}
                          </p>
                          {/* Byline */}
                          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                            <span className="font-sans text-[11px] text-stone-400">
                              {new Date(post.date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}
                              <span className="mx-2 text-stone-200">·</span>
                              {post.readTime} min
                            </span>
                            <span className="font-sans text-[11px] text-olive-600 font-semibold group-hover:text-olive-800 transition-colors">
                              閱讀 →
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
