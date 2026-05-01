import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getAllSlugs, getAllPosts } from '@/lib/posts';
import { getImages, getPostImageUrl } from '@/lib/images';
import type { Metadata } from 'next';
import ViewTracker from '@/components/ViewTracker';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';

export const dynamic = 'force-static';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: '文章不存在' };

  // Static AI-branded cover image as OG image (dynamic /api/og bypassed for CF Pages compat)
  const coverPath = post.coverImage ?? `/images/covers/${slug}.jpg`;
  const ogImageUrl = coverPath.startsWith('http')
    ? coverPath
    : `https://olive-wisdom.com${coverPath}`;

  return {
    title: `${post.title}｜知橄生活`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://olive-wisdom.com/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      siteName: '知橄生活 Olive Wisdom',
      locale: 'zh_TW',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
    },
    alternates: {
      canonical: `https://olive-wisdom.com/blog/${slug}`,
      languages: {
        'zh-TW': `https://olive-wisdom.com/blog/${slug}`,
        'x-default': `https://olive-wisdom.com/blog/${slug}`,
      },
    },
    twitter: {
      card: 'summary_large_image',
      site: '@OliveWisdomTW',
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  };
}

// ── Markdown → HTML (edge-compatible, no remark/rehype) ──────────────────────
function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const result: string[] = [];
  let inList = false;
  let inOrderedList = false;
  let inTable = false;
  let tableRows: string[] = [];
  let inBlockquote = false;

  const closeList = () => {
    if (inList) { result.push('</ul>'); inList = false; }
    if (inOrderedList) { result.push('</ol>'); inOrderedList = false; }
  };
  const closeTable = () => {
    if (inTable) {
      result.push(`<div class="overflow-x-auto my-8"><table class="w-full border-collapse text-sm">${tableRows.join('')}</table></div>`);
      tableRows = []; inTable = false;
    }
  };
  const closeBlockquote = () => {
    if (inBlockquote) { result.push('</blockquote>'); inBlockquote = false; }
  };

  const inline = (s: string) =>
    s
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-olive-900">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-olive-100 text-olive-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-olive-600 underline hover:text-olive-800" target="_blank" rel="noopener noreferrer">$1</a>');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\s*$/.test(line)) {
      closeList(); closeTable(); closeBlockquote();
      continue;
    }

    // Headings
    if (/^### (.+)$/.test(line)) {
      closeList(); closeTable(); closeBlockquote();
      const _h3t = line.replace(/^### /, '');
      const _h3id = 'h-' + _h3t.replace(/[^\w\u4e00-\u9fff]/g,'').slice(0,20).toLowerCase() + '-' + result.length;
      result.push(`<h3 id="${_h3id}" class="text-xl font-bold text-olive-800 mt-8 mb-3">${inline(_h3t)}</h3>`);
      continue;
    }
    if (/^## (.+)$/.test(line)) {
      closeList(); closeTable(); closeBlockquote();
      const _h2t = line.replace(/^## /, '');
      const _h2id = 'h-' + _h2t.replace(/[^\w\u4e00-\u9fff]/g,'').slice(0,20).toLowerCase() + '-' + result.length;
      result.push(`<h2 id="${_h2id}" class="text-2xl font-bold text-olive-800 mt-12 mb-4 pb-2 border-b-2 border-olive-200">${inline(_h2t)}</h2>`);
      continue;
    }
    if (/^# (.+)$/.test(line)) {
      closeList(); closeTable(); closeBlockquote();
      result.push(`<h1 class="text-3xl font-bold text-olive-900 mt-8 mb-4">${inline(line.replace(/^# /, ''))}</h1>
        <ViewTracker slug={slug} />`);
      continue;
    }

    // HR
    if (/^---+$/.test(line)) {
      closeList(); closeTable(); closeBlockquote();
      result.push('<hr class="border-olive-200 my-10" />');
      continue;
    }

    // Blockquote
    if (/^> (.+)$/.test(line)) {
      closeList(); closeTable();
      if (!inBlockquote) {
        result.push('<blockquote class="border-l-4 border-olive-400 bg-olive-50 pl-5 pr-4 py-3 rounded-r-xl my-6 italic text-gray-600">');
        inBlockquote = true;
      }
      result.push(`<p class="mb-1">${inline(line.replace(/^> /, ''))}</p>`);
      continue;
    }

    // Table
    if (/^\|.+\|$/.test(line)) {
      closeList(); closeBlockquote();
      inTable = true;
      const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
      if (/^[-:\s|]+$/.test(line.replace(/\|/g, ''))) {
        // separator row — make previous row a header
        if (tableRows.length > 0) {
          const lastRow = tableRows[tableRows.length - 1];
          tableRows[tableRows.length - 1] = lastRow.replace(/<tr>/, '<tr class="bg-olive-800 text-white">').replace(/<td /g, '<th class="border border-olive-300 px-4 py-2 font-semibold text-sm" ').replace(/<\/td>/g, '</th>');
        }
      } else {
        const isFirst = tableRows.length === 0;
        const tds = cells.map(c => `<td class="border border-olive-200 px-4 py-2 text-sm ${isFirst ? 'font-semibold bg-olive-50' : ''}">${inline(c)}</td>`).join('');
        tableRows.push(`<tr class="hover:bg-olive-50">${tds}</tr>`);
      }
      continue;
    }

    // Unordered list
    if (/^[-*+] (.+)$/.test(line)) {
      closeTable(); closeBlockquote();
      if (!inList) { result.push('<ul class="list-none space-y-2 my-4 pl-4">'); inList = true; }
      result.push(`<li class="flex gap-2 text-gray-700 leading-relaxed"><span class="text-olive-500 mt-1 shrink-0">✦</span><span>${inline(line.replace(/^[-*+] /, ''))}</span></li>`);
      continue;
    }

    // Ordered list
    if (/^\d+\. (.+)$/.test(line)) {
      closeTable(); closeBlockquote();
      if (!inOrderedList) { result.push('<ol class="list-decimal pl-6 space-y-2 my-4">'); inOrderedList = true; }
      result.push(`<li class="text-gray-700 leading-relaxed pl-1">${inline(line.replace(/^\d+\. /, ''))}</li>`);
      continue;
    }

    // Paragraph
    closeList(); closeTable(); closeBlockquote();
    result.push(`<p class="text-gray-700 leading-[1.875] mb-5 text-[1.125rem]">${inline(line)}</p>`);
  }

  closeList(); closeTable(); closeBlockquote();
  return result.join('\n');
}

const CATEGORY_MAP: Record<string, { label: string; badgeClass: string }> = {
  science:   { label: '科學萃取', badgeClass: 'bg-emerald-100 text-emerald-800' },
  lifestyle: { label: '餐桌美學', badgeClass: 'bg-amber-100 text-amber-800' },
  health:    { label: '品味鑑賞', badgeClass: 'bg-rose-100 text-rose-800' },
  culture:   { label: '知性史詩', badgeClass: 'bg-purple-100 text-purple-800' },
  heritage:  { label: '知性史詩', badgeClass: 'bg-purple-100 text-purple-800' },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // 動態載入 images.json，優先使用 images.json 中的封面圖
  const imagesData = await getImages();
  const coverImageUrl = getPostImageUrl(imagesData, slug) || post.coverImage;

  const htmlContent = markdownToHtml(post.content);
  const catInfo = CATEGORY_MAP[post.category] ?? { label: post.category, badgeClass: 'bg-gray-100 text-gray-700' };

  // Related posts — tag overlap scoring (sharedTags×3 + sameCategory×1)
  const postTags = new Set(post.tags || []);
  const related = getAllPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const sharedTags = (p.tags || []).filter((t) => postTags.has(t)).length;
      const sameCategory = p.category === post.category ? 1 : 0;
      return { post: p, score: sharedTags * 3 + sameCategory };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.post);

  return (
    <main className="min-h-screen bg-white">
      {/* JSON-LD Article Schema */}
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: {
              '@type': 'ImageObject',
              url: post.coverImage,
              caption: `${post.title} — 知橄生活 Olive Wisdom`,
            },
            datePublished: post.date,
            dateModified: post.date,
            author: {
              '@type': 'Organization',
              name: post.author || '知橄生活研究團隊',
              url: 'https://olive-wisdom.com/about',
            },
            publisher: {
              '@type': 'Organization',
              name: '知橄生活 Olive Wisdom',
              url: 'https://olive-wisdom.com',
              logo: { '@type': 'ImageObject', url: 'https://olive-wisdom.com/favicon.ico' },
            },
            url: `https://olive-wisdom.com/blog/${slug}`,
            mainEntityOfPage: { '@type': 'WebPage', '@id': `https://olive-wisdom.com/blog/${slug}` },
            inLanguage: 'zh-TW',
            wordCount: post.content ? post.content.split(/\s+/).length : undefined,
            keywords: (post.tags || []).join(', '),
            about: { '@type': 'Thing', name: '特級初榨橄欖油', sameAs: 'https://www.wikidata.org/wiki/Q192698' },
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['.article-excerpt', 'h1', 'h2', 'h3'],
            },
            isPartOf: {
              '@type': 'Blog',
              name: '知橄生活 Olive Wisdom',
              url: 'https://olive-wisdom.com/blog',
            },
          }),
        }}
      />
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
              { '@type': 'ListItem', position: 3, name: post.title, item: `https://olive-wisdom.com/blog/${slug}` },
            ],
          }),
        }}
      />

      {/* FAQ Schema — article-specific when faq[] present, fallback to category defaults */}
      {(post.faq && post.faq.length > 0) ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: post.faq.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            }),
          }}
        />
      ) : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: post.category === 'science'
                    ? '橄欖油的多酚和健康功效有科學根據嗎？'
                    : post.category === 'heritage' || post.category === 'culture'
                    ? '橄欖油在歷史上扮演什麼角色？'
                    : post.category === 'lifestyle'
                    ? '如何在日常生活中正確使用特級初榨橄欖油？'
                    : '如何選購真正高品質的特級初榨橄欖油？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: post.category === 'science'
                      ? '是的。根據 PREDIMED 研究（發表於 NEJM）、哈佛醫學院和 EFSA 的研究，特級初榨橄欖油中的多酚化合物具有科學支持的抗炎、抗氧化和心血管保護功效。'
                      : post.category === 'heritage' || post.category === 'culture'
                      ? '橄欖油在人類文明中已有 3,000 年以上的歷史，從古埃及的聖禮儀式、希臘羅馬的經濟命脈到文藝復興藝術，均有深刻記載。'
                      : post.category === 'lifestyle'
                      ? '建議每日晨間空腹攝取 1-2 湯匙高多酚特級初榨橄欖油，用於涼拌和低溫烹飪，避免高溫煎炸破壞多酚活性成分。'
                      : '選購時注意：(1) 標示「特級初榨 Extra Virgin」認證，(2) 確認酸度 ≤0.8%，(3) 標示收穫年份和多酚含量，(4) 選擇遮光深色玻璃瓶裝。',
                  },
                },
                {
                  '@type': 'Question',
                  name: '知橄生活的橄欖油推薦有商業利益衝突嗎？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '知橄生活所有內容均基於 IOC 國際橄欖理事會標準與學術文獻，公正聲明載於每篇文章底部。若文章含有聯盟行銷連結，將依法揭露並不影響推薦判斷。',
                  },
                },
              ],
            }),
          }}
        />
      )}

      {/* Cover Image */}
      {coverImageUrl && (
        <div className="relative aspect-video md:aspect-auto md:h-[480px] w-full">
          <Image
            src={coverImageUrl}
            alt={post.coverAlt || `${post.title}｜${post.category === "science" ? "橄欖油科學" : post.category === "heritage" || post.category === "culture" ? "橄欖油歷史" : post.category === "lifestyle" ? "地中海飲食" : "特級初榨橄欖油"} — 知橄生活`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 py-8 max-w-4xl mx-auto">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full mb-4 inline-block ${catInfo.badgeClass}`}>
              {catInfo.label}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mt-2 max-w-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      {/* Table of Contents */}
      <TableOfContents htmlContent={htmlContent} />

      {/* Article Body */}
      <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-16" data-pagefind-body>
        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1">✍️ <span className="text-gray-600">{post.author}</span></span>
          <span className="flex items-center gap-1">
            📅 <span className="text-gray-600">
              {new Date(post.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </span>
          <span className="flex items-center gap-1">⏱️ <span className="text-gray-600">{post.readTime} 分鐘閱讀</span></span>
        </div>

        {/* Excerpt callout */}
        <div className="article-excerpt bg-gradient-to-br from-olive-50 to-gold-50 border-l-4 border-olive-500 rounded-r-xl px-6 py-5 mb-10">
          <p className="text-gray-600 leading-relaxed italic text-base">{post.excerpt}</p>
        </div>

        {/* Affiliate Disclosure */}
        <AffiliateDisclosure content={post.content} />

        {/* Tags — each links to topic hub page */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="text-xs bg-olive-100 hover:bg-olive-200 text-olive-700 hover:text-olive-900 px-3 py-1 rounded-full font-medium transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* FAQ Accordion — article-specific Q&A for SEO Featured Snippets */}
        {post.faq && post.faq.length > 0 && (
          <div className="mt-12 pt-8 border-t border-olive-100">
            <h2 className="text-xl font-bold text-olive-800 mb-6 flex items-center gap-2">
              <span>💬</span> 常見問題
            </h2>
            <div className="space-y-3">
              {post.faq.map((item, i) => (
                <details
                  key={i}
                  className="group border border-olive-200 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer bg-olive-50 hover:bg-olive-100 transition-colors list-none">
                    <span className="font-semibold text-olive-800 text-sm leading-relaxed pr-4">
                      {item.q}
                    </span>
                    <span className="text-olive-500 shrink-0 text-lg group-open:rotate-180 transition-transform duration-200">
                      ▾
                    </span>
                  </summary>
                  <div className="px-5 py-4 text-gray-600 text-sm leading-relaxed bg-white">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {post.sources && post.sources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-olive-100">
            <h3 className="text-lg font-bold text-olive-800 mb-4 flex items-center gap-2">
              <span>📚</span> 參考文獻
            </h3>
            <ol className="space-y-2">
              {post.sources.map((src, i) => (
                <li key={i} className="text-sm text-gray-500 flex gap-2">
                  <span className="text-olive-400 font-medium shrink-0">[{i + 1}]</span>
                  <span>{src}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 pt-8 border-t border-gray-100 flex gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-olive-600 hover:text-olive-800 font-medium hover:underline"
          >
            ← 返回文章列表
          </Link>
          <Link
            href="/#subscribe"
            className="ml-auto inline-flex items-center gap-2 bg-olive-700 hover:bg-olive-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            訂閱知橄週報 🫒
          </Link>
        </div>
      </article>

      {/* Author Trust Block — E-E-A-T 升級版 */}
      <section className="max-w-[680px] mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-olive-100 rounded-2xl overflow-hidden shadow-sm">
          {/* Top bar */}
          <div className="bg-gradient-to-r from-olive-800 to-olive-700 px-6 py-3 flex items-center gap-2">
            <span className="text-xs font-sans font-semibold text-olive-200 tracking-widest uppercase">編輯公信力聲明</span>
          </div>
          {/* Author info */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-olive-600 to-olive-800 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">🫒</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-olive-900 text-base mb-0.5">{post.author || '知橄生活研究團隊'}</p>
                <p className="text-xs text-olive-600 font-sans mb-3">知橄生活 Olive Wisdom 編輯部</p>
                <p className="text-sm text-gray-600 font-sans leading-relaxed">
                  本文由食品科學、分子生物學與地中海飲食研究背景的編輯團隊撰稿，
                  並引用 PREDIMED、哈佛醫學院、EFSA、IOC 等機構的學術文獻。
                  所有科學主張皆可追溯至原始研究來源。
                </p>
                {/* Trust badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    { icon: '📚', label: '引用文獻可查' },
                    { icon: '🚫', label: '無業配廣告' },
                    { icon: '✅', label: 'IOC 標準對標' },
                    { icon: '🔄', label: '定期更新內容' },
                  ].map((badge) => (
                    <span key={badge.label}
                      className="inline-flex items-center gap-1 text-xs font-sans font-medium
                                 bg-olive-50 text-olive-700 border border-olive-200
                                 px-2.5 py-1 rounded-full">
                      <span>{badge.icon}</span>{badge.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className="border-t border-olive-100 mt-5 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-gray-400 font-sans flex items-center gap-4">
                <span>📅 發布：{new Date(post.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>⏱️ {post.readTime} 分鐘閱讀</span>
              </div>
              <div className="flex items-center gap-3">
                <a href="/about" className="text-xs text-olive-600 hover:text-olive-800 font-sans underline underline-offset-2 transition-colors">
                  了解我們的編輯標準 →
                </a>
                <ShareButtons title={post.title} url={`https://olive-wisdom.com/blog/${slug}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles — Kinfolk editorial style */}
      {related.length > 0 && (
        <section className="bg-[#fafaf7] py-16 px-6 border-t border-stone-200">
          <div className="max-w-[900px] mx-auto">
            {/* Section header */}
            <div className="flex items-center gap-5 mb-10">
              <span className="text-[10px] font-sans font-semibold text-stone-400 tracking-[0.3em] uppercase whitespace-nowrap">
                延伸閱讀
              </span>
              <div className="h-px flex-1 bg-stone-200" />
              <Link href="/blog" className="text-[10px] font-sans font-semibold text-olive-600 hover:text-olive-800 tracking-[0.2em] uppercase transition-colors whitespace-nowrap">
                所有文章 →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((rel, i) => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group">
                  <article>
                    {/* Image — no border radius, no shadow */}
                    {rel.coverImage && (
                      <div className="relative h-40 overflow-hidden bg-stone-200 mb-4">
                        <Image
                          src={rel.coverImage}
                          alt={`${rel.title} — 知橄生活 Olive Wisdom`}
                          fill
                          className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-sans font-semibold text-stone-500 tracking-widest uppercase">
                          No.{String(i + 1).padStart(2, '0')}
                        </div>
                      </div>
                    )}
                    <h3 className="text-[0.95rem] font-bold text-olive-900 leading-snug line-clamp-2 mb-2
                                   group-hover:text-olive-700 transition-colors tracking-tight">
                      {rel.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-sans text-stone-400">
                      <span>{rel.readTime} MIN</span>
                      <span className="w-1 h-1 rounded-full bg-stone-300 inline-block" />
                      <span className="text-olive-600 font-semibold group-hover:text-olive-800 transition-colors">閱讀 →</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
