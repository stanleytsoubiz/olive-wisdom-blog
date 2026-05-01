import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import type { PostFrontmatter } from '@/lib/posts';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '所有主題｜知橄生活 Olive Wisdom',
  description: '按主題瀏覽知橄生活知識庫——多酚、羥基酪醇、地中海飲食、EVOO選購、橄欖油科學，依主題深度探索。',
  alternates: { canonical: 'https://olive-wisdom.com/topics' },
};

const CATEGORIES = [
  { label: '科學萃取', value: '科學萃取' },
  { label: '品味鑑賞', value: '品味鑑賞' },
  { label: '餐桌美學', value: '餐桌美學' },
  { label: '知性史詩', value: '知性史詩' },
];

export default function TopicsPage() {
  const posts = getAllPosts();

  // Build tag map: tag → count + list of posts
  const tagMap: Record<string, { count: number; posts: PostFrontmatter[] }> = {};
  posts.forEach((p) => {
    (p.tags || []).forEach((t) => {
      if (!tagMap[t]) tagMap[t] = { count: 0, posts: [] };
      tagMap[t].count++;
      tagMap[t].posts.push(p);
    });
  });

  // Sort by count desc
  const sortedTags = Object.entries(tagMap).sort((a, b) => b[1].count - a[1].count);

  // Split: major tags (count >= 2), minor tags (count === 1)
  const majorTags = sortedTags.filter(([, v]) => v.count >= 2);
  const minorTags = sortedTags.filter(([, v]) => v.count === 1);

  const totalTags = Object.keys(tagMap).length;

  // JSON-LD schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://olive-wisdom.com' },
      { '@type': 'ListItem', position: 2, name: '知識庫', item: 'https://olive-wisdom.com/blog' },
      { '@type': 'ListItem', position: 3, name: '所有主題', item: 'https://olive-wisdom.com/topics' },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '所有主題｜知橄生活 Olive Wisdom',
    description: '按主題瀏覽知橄生活知識庫——多酚、羥基酪醇、地中海飲食、EVOO選購、橄欖油科學，依主題深度探索。',
    url: 'https://olive-wisdom.com/topics',
    numberOfItems: totalTags,
  };

  return (
    <main className="min-h-screen bg-[#fafaf7]">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Minimal white header — no image */}
      <section className="bg-white border-b border-stone-200 px-6 py-14">
        <div className="max-w-4xl mx-auto">
          {/* Gold eyebrow */}
          <p className="text-gold-500 text-[10px] font-sans font-semibold tracking-[0.35em] uppercase mb-4">
            知識索引
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-3">
            所有主題
          </h1>
          <p className="text-stone-500 font-sans text-sm mb-6">
            共 {totalTags} 個主題・{posts.length} 篇深度文章
          </p>
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-olive-700 font-sans text-sm transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>知識庫</span>
          </Link>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">

        {/* ── Major topics section ── */}
        {majorTags.length > 0 && (
          <section>
            {/* Section header */}
            <div className="mb-6">
              <p className="text-stone-400 text-[9px] font-sans font-semibold tracking-[0.3em] uppercase mb-1.5">
                Topic Groups
              </p>
              <h2 className="font-serif text-xl font-semibold text-stone-800">核心主題</h2>
            </div>
            <div className="border-t border-stone-200 pt-6">
              <div className="flex flex-wrap gap-3">
                {majorTags.map(([tag, { count }]) => {
                  // Slightly scale font for tags with more articles
                  const textSize =
                    count >= 8
                      ? 'text-base'
                      : count >= 5
                      ? 'text-[15px]'
                      : count >= 3
                      ? 'text-sm'
                      : 'text-sm';
                  return (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className={`bg-olive-50 hover:bg-olive-100 border border-olive-200 text-olive-800 font-semibold ${textSize} px-4 py-2 rounded-full transition-all hover:border-olive-300 hover:shadow-sm`}
                    >
                      #{tag}
                      <span className="ml-1.5 text-olive-500 font-normal text-xs">
                        {count}篇
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Minor topics section ── */}
        {minorTags.length > 0 && (
          <section>
            {/* Section header */}
            <div className="mb-6">
              <p className="text-stone-400 text-[9px] font-sans font-semibold tracking-[0.3em] uppercase mb-1.5">
                Extended Topics
              </p>
              <h2 className="font-serif text-xl font-semibold text-stone-800">延伸主題</h2>
            </div>
            <div className="border-t border-stone-200 pt-6">
              <div className="flex flex-wrap gap-2">
                {minorTags.map(([tag]) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-800 font-medium text-xs px-3 py-1.5 rounded-full transition-all hover:border-stone-300"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Category quick nav ── */}
        <section>
          <div className="mb-6">
            <p className="text-stone-400 text-[9px] font-sans font-semibold tracking-[0.3em] uppercase mb-1.5">
              By Category
            </p>
            <h2 className="font-serif text-xl font-semibold text-stone-800">依欄目瀏覽</h2>
          </div>
          <div className="border-t border-stone-200 pt-6">
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(({ label, value }) => (
                <Link
                  key={value}
                  href={`/blog?cat=${encodeURIComponent(value)}`}
                  className="group flex items-center gap-2 bg-white border border-stone-200 hover:border-olive-300 hover:bg-olive-50 text-stone-700 hover:text-olive-800 font-sans font-medium text-sm px-5 py-2.5 rounded-full transition-all hover:shadow-sm"
                >
                  <span>{label}</span>
                  <span className="text-stone-300 group-hover:text-olive-400 text-xs" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
