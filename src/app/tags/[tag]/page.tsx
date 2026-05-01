import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllPosts } from '@/lib/posts';
import { getImages } from '@/lib/images';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

interface Props { params: Promise<{ tag: string }> }

// Pre-generate all tag pages at build time
export async function generateStaticParams() {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
  return Array.from(tags).map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getAllPosts().filter((p) => (p.tags || []).includes(decoded));
  if (posts.length === 0) return { title: '主題不存在' };

  const title = `「${decoded}」相關文章｜知橄生活`;
  const description = `知橄生活所有關於「${decoded}」的深度文章，共 ${posts.length} 篇。引用學術文獻，不接業配，可信知識來源。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://olive-wisdom.com/tags/${tag}`,
      type: 'website',
      siteName: '知橄生活 Olive Wisdom',
      locale: 'zh_TW',
    },
    alternates: {
      canonical: `https://olive-wisdom.com/tags/${tag}`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const allPosts = getAllPosts();
  const posts = allPosts.filter((p) => (p.tags || []).includes(decoded));

  if (posts.length === 0) notFound();

  const imagesData = await getImages();

  // Related tags — tags that co-occur with this tag across articles
  const relatedTagCount: Record<string, number> = {};
  posts.forEach((p) =>
    (p.tags || []).filter((t) => t !== decoded).forEach((t) => {
      relatedTagCount[t] = (relatedTagCount[t] || 0) + 1;
    })
  );
  const relatedTags = Object.entries(relatedTagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([t]) => t);

  return (
    <main className="min-h-screen bg-[#fafaf7]">
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://olive-wisdom.com' },
              { '@type': 'ListItem', position: 2, name: '知識庫', item: 'https://olive-wisdom.com/blog' },
              { '@type': 'ListItem', position: 3, name: decoded, item: `https://olive-wisdom.com/tags/${tag}` },
            ],
          }),
        }}
      />
      {/* CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `「${decoded}」相關文章`,
            description: `知橄生活所有關於「${decoded}」的深度文章，引用學術文獻，不接業配。`,
            url: `https://olive-wisdom.com/tags/${tag}`,
            inLanguage: 'zh-TW',
            about: { '@type': 'Thing', name: decoded },
            hasPart: posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: `https://olive-wisdom.com/blog/${p.slug}`,
              datePublished: p.date,
              description: p.excerpt,
            })),
          }),
        }}
      />

      {/* ── Masthead ── */}
      <section className="bg-white border-b border-stone-200 px-6 py-14">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-sans text-stone-400 mb-8">
            <Link href="/" className="hover:text-olive-600 transition-colors">首頁</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-olive-600 transition-colors">知識庫</Link>
            <span>/</span>
            <span className="text-stone-600">{decoded}</span>
          </div>

          <div className="flex items-start gap-5">
            <div className="bg-olive-50 border border-olive-200 rounded-2xl px-4 py-3 text-olive-700 text-2xl font-bold leading-none flex-shrink-0">
              #
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-olive-900 tracking-tight mb-3">
                {decoded}
              </h1>
              <p className="text-stone-500 font-sans text-base">
                共 <span className="font-bold text-olive-700">{posts.length}</span> 篇深度文章
                <span className="mx-2 text-stone-300">·</span>
                引用學術・不接業配・內容持續更新
              </p>
            </div>
          </div>

          {/* Related tags */}
          {relatedTags.length > 0 && (
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-sans font-semibold text-stone-400 tracking-widest uppercase whitespace-nowrap">
                相關主題
              </span>
              {relatedTags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${encodeURIComponent(t)}`}
                  className="text-xs font-sans bg-stone-100 hover:bg-olive-100 text-stone-600 hover:text-olive-700
                             px-3 py-1 rounded-full border border-stone-200 hover:border-olive-300 transition-all"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Article grid ── */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="space-y-8">
          {posts.map((post, i) => {
            const imgUrl = (imagesData.posts?.[post.slug]?.url) || post.coverImage || '';
            return (
              <article key={post.slug} className="grid sm:grid-cols-[1fr_2fr] gap-0 border-b border-stone-200 pb-8 group">
                {/* Image — links to article */}
                {imgUrl && (
                  <Link href={`/blog/${post.slug}`} className="relative h-48 sm:h-auto overflow-hidden bg-stone-200 sm:mr-8 mb-5 sm:mb-0 rounded-lg block">
                    <Image
                      src={imgUrl}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-[1.03] transition-transform duration-500"
                      unoptimized
                      priority={i < 2}
                    />
                  </Link>
                )}
                {/* Content */}
                <div className="flex flex-col justify-center">
                  <p className="text-[10px] font-sans font-semibold text-stone-400 tracking-[0.25em] uppercase mb-2">
                    No.{String(i + 1).padStart(2, '0')}
                  </p>
                  {/* Title — links to article */}
                  <Link href={`/blog/${post.slug}`} className="group/title">
                    <h2 className="text-xl md:text-2xl font-bold text-olive-900 leading-snug tracking-tight mb-3
                                   group-hover/title:text-olive-700 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-stone-500 font-sans leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  {/* Tags — separate links, not nested inside article link */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(post.tags || []).map((t) => (
                      <Link
                        key={t}
                        href={`/tags/${encodeURIComponent(t)}`}
                        className={`text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full transition-colors
                          ${t === decoded
                            ? 'bg-olive-700 text-white'
                            : 'bg-stone-100 text-stone-500 hover:bg-olive-100 hover:text-olive-700'
                          }`}
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-sans text-stone-400">
                    <span>{post.readTime} MIN READ</span>
                    <span className="w-1 h-1 rounded-full bg-stone-300 inline-block" />
                    <span>{new Date(post.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <Link href={`/blog/${post.slug}`}
                      className="ml-auto text-olive-600 font-semibold hover:text-olive-800 transition-colors">
                      閱讀 →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Back to knowledge base */}
        <div className="mt-14 pt-8 border-t border-stone-200 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm font-sans text-olive-600 hover:text-olive-800 font-medium transition-colors"
          >
            ← 返回知識庫
          </Link>
          <Link
            href="/#subscribe"
            className="text-sm font-sans bg-olive-700 hover:bg-olive-800 text-white
                       px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            訂閱週報 🫒
          </Link>
        </div>
      </section>
    </main>
  );
}
