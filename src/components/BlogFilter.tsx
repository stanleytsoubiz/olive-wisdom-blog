'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { PostFrontmatter } from '@/lib/posts';
import type { ImagesData } from '@/lib/images';

const CATEGORY_MAP: Record<string, { label: string; en: string; catLine: string; badge: string }> = {
  science:   { label: '科學萃取', en: 'Science',   catLine: 'cat-line-science',   badge: 'badge-science' },
  lifestyle: { label: '餐桌美學', en: 'Lifestyle',  catLine: 'cat-line-lifestyle', badge: 'badge-lifestyle' },
  health:    { label: '品味鑑賞', en: 'Selection',  catLine: 'cat-line-health',    badge: 'badge-health' },
  culture:   { label: '知性史詩', en: 'Heritage',   catLine: 'cat-line-culture',   badge: 'badge-culture' },
  heritage:  { label: '知性史詩', en: 'Heritage',   catLine: 'cat-line-heritage',  badge: 'badge-heritage' },
  guide:     { label: '選購指南', en: 'Guide',      catLine: 'cat-line-guide',     badge: 'badge-science' },
};

const CAT_TABS = [
  { key: '', label: '全部', en: 'All' },
  { key: 'science',   label: '科學萃取', en: 'Science' },
  { key: 'health',    label: '品味鑑賞', en: 'Selection' },
  { key: 'lifestyle', label: '餐桌美學', en: 'Lifestyle' },
  { key: 'culture',   label: '知性史詩', en: 'Heritage' },
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
      {/* ── Editorial Category Bar ── */}
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
                    isActive
                      ? 'text-olive-800'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {tab.label}
                  {tab.key === '' && (
                    <span className="ml-1 text-xs opacity-50">({posts.length})</span>
                  )}
                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-olive-700" />
                  )}
                </button>
              );
            })}
            {/* Right separator + count */}
            <div className="ml-auto pl-4 py-4 text-xs font-sans text-stone-400 whitespace-nowrap flex-shrink-0">
              {filtered.length} 篇文章
            </div>
          </div>
        </div>
      </div>

      {/* ── Articles ── */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-32 border border-stone-200">
            <p className="font-sans text-stone-400 tracking-widest uppercase text-sm mb-4">No Articles</p>
            <p className="text-stone-500 mb-6">此欄目文章準備中，敬請期待</p>
            <button
              onClick={() => setActiveCat('')}
              className="font-sans text-sm text-olive-600 hover:text-olive-800 underline underline-offset-4"
            >
              返回全部文章
            </button>
          </div>
        ) : (
          <>
            {/* ── Featured Article (full-width) ── */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="block group mb-12">
                <article className={`card-editorial ${CATEGORY_MAP[featured.category]?.catLine ?? 'cat-line-science'} grid md:grid-cols-5`}>
                  {/* Image: 3/5 */}
                  <div className="relative md:col-span-3 h-64 md:h-96 overflow-hidden bg-stone-100">
                    <Image
                      src={(imagesData?.posts?.[featured.slug]?.url) || featured.coverImage || ''}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                  </div>
                  {/* Content: 2/5 */}
                  <div className="md:col-span-2 p-8 md:p-10 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={CATEGORY_MAP[featured.category]?.badge ?? 'badge-science'}>
                          {CATEGORY_MAP[featured.category]?.en ?? 'Science'}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="font-sans text-xs text-stone-400 tracking-wide">
                          {featured.readTime} MIN READ
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-olive-900 leading-tight mb-4 tracking-tight group-hover:text-olive-700 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-stone-500 text-sm leading-relaxed line-clamp-4">
                        {featured.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-stone-100">
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

            {/* ── Section divider ── */}
            {rest.length > 0 && featured && (
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-stone-200" />
                <span className="font-sans text-xs tracking-[0.25em] text-stone-400 uppercase">更多文章</span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>
            )}

            {/* ── Secondary grid (2 col then 3 col) ── */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {rest.map((post) => {
                  const cat = CATEGORY_MAP[post.category] ?? { label: post.category, en: 'Article', catLine: 'cat-line-science', badge: 'badge-science' };
                  const imgUrl = (imagesData?.posts?.[post.slug]?.url) || post.coverImage || '';
                  return (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                      <article className={`card-editorial ${cat.catLine} h-full flex flex-col`}>
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-stone-100 flex-shrink-0">
                          {imgUrl && (
                            <Image
                              src={imgUrl}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              unoptimized
                            />
                          )}
                        </div>
                        {/* Content */}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={cat.badge}>{cat.en}</span>
                            <span className="text-stone-300 font-sans text-xs">·</span>
                            <span className="font-sans text-xs text-stone-400">{post.readTime} MIN</span>
                          </div>
                          <h2 className="text-lg font-bold text-olive-900 mb-2 leading-snug tracking-tight group-hover:text-olive-700 transition-colors line-clamp-2 flex-1">
                            {post.title}
                          </h2>
                          <p className="text-sm text-stone-500 line-clamp-2 mb-4 leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                            <span className="font-sans text-xs text-stone-400">
                              {new Date(post.date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}
                            </span>
                            <span className="font-sans text-xs text-olive-600 font-semibold group-hover:text-olive-800 transition-colors">
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
