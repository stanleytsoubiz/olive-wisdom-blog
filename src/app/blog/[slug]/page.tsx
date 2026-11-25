import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getAllSlugs, getAllPosts } from '@/lib/posts';
import { getImages, getPostImageUrl } from '@/lib/images';
import { CATEGORY_MAP, categoryLabel } from '@/lib/categories';
import { findPathPosition, getNextInPath } from '@/lib/learning-paths';
import type { Metadata } from 'next';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import ArticleNewsletterCTA from '@/components/ArticleNewsletterCTA';
import VerdictCard from '@/components/VerdictCard';
import { getVerdict } from '@/lib/verdicts';
import PodcastSlot from '@/components/PodcastSlot';
import PodcastTimestamps from '@/components/PodcastTimestamps';
import { getEpisode } from '@/lib/podcast';
import { getCoverStyle, getCoverSeriesLabel, getCoverSourceLabel } from '@/lib/covers';

export const dynamic = 'force-static';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: '文章不存在' };

  // OG image: prefer the images.json cover URL (the same source the
  // article body cover uses), then the frontmatter coverImage, then the
  // local WebP cover. Never .jpg: the 7 newest articles have remote
  // Unsplash covers and no local .jpg exists, so the old fallback 404'd.
  const imagesData = await getImages();
  const coverPath =
    imagesData.posts[slug]?.url ||
    post.coverImage ||
    `/images/covers/${slug}.webp`;
  const ogImageUrl = coverPath.startsWith('http')
    ? coverPath
    : `https://olive-wisdom.com${coverPath}`;

  // Use focusKeyword in title for SEO signal: "主關鍵字：文章標題" —
  // but never stack it when the title already says it (A8 rule): if every
  // keyword token already appears in the title (whitespace-insensitive),
  // or the title opens with the keyword's core phrase, the bare title is
  // the SEO title. (Was: "PREDIMED研究：PREDIMED 研究完整解析…".)
  // NOTE: do NOT append "｜知橄生活" here — layout.tsx title template
  // ("%s｜知橄生活 Olive Wisdom") adds the site suffix once.
  const norm = (t: string) => t.replace(/[\s　]/g, '').toLowerCase();
  const fkNorm = post.focusKeyword ? norm(post.focusKeyword) : '';
  const titleNorm = norm(post.title);
  const fkTokens = (post.focusKeyword ?? '').split(/[\s　]+/).filter(Boolean);
  // For long single-phrase keywords, a near-complete core inside the title
  // also counts as covered (e.g. 差別 vs 到底差在哪裡）.
  const fkCore =
    fkNorm.length >= 6
      ? fkNorm.slice(0, fkNorm.length - (fkNorm.length >= 12 ? 4 : 2))
      : '';
  const fkCovered =
    fkTokens.length > 0 &&
    (fkTokens.every((t) => titleNorm.includes(norm(t))) ||
      (fkCore.length >= 4 && titleNorm.includes(fkCore)));
  const seoTitle = post.focusKeyword && !fkCovered && fkNorm !== titleNorm
    ? `${post.focusKeyword}：${post.title}`
    : post.title;

  return {
    title: seoTitle,
    description: post.excerpt,
    keywords: post.tags ?? [],
    openGraph: {
      title: `${seoTitle}｜知橄生活 Olive Wisdom`,
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
      // Internal links stay in the same tab; only external links open a new tab.
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text: string, href: string) => {
        const internal = href.startsWith('/') || href.startsWith('https://olive-wisdom.com');
        const attrs = internal
          ? ''
          : ' target="_blank" rel="noopener noreferrer"';
        return `<a href="${href}" class="text-olive-600 underline hover:text-olive-800"${attrs}>${text}</a>`;
      });

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
      result.push(`<h2 id="${_h2id}" class="font-serif text-2xl font-bold text-olive-800 mt-[2.2em] mb-[0.8em]">${inline(_h2t)}</h2>`);
      continue;
    }
    if (/^# (.+)$/.test(line)) {
      closeList(); closeTable(); closeBlockquote();
      result.push(`<h1 class="font-serif text-3xl font-bold text-olive-900 mt-8 mb-4">${inline(line.replace(/^# /, ''))}</h1>`);
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
        result.push('<blockquote class="font-serif border-l-[3px] border-gold-400 pl-6 my-8 italic text-olive-900 text-[1.125rem] leading-[1.75]">');
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
      // Table separator row: after removing pipes, only -, : and whitespace
      // remain. Written as a char-set test, NOT a regex character-class
      // literal: Tailwind's content scanner would read such a literal as
      // an arbitrary-property class and emit invalid CSS, which Turbopack
      // (Next 16's default bundler) refuses to parse. Do not reintroduce
      // the bracket form here, not even inside a comment.
      const stripped = line.replace(/\|/g, '');
      const isSeparatorRow = stripped.length > 0 && [...stripped].every(c => '-: \t\r'.includes(c));
      if (isSeparatorRow) {
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
      result.push(`<li class="flex gap-2 text-gray-700 leading-relaxed"><span class="text-olive-400 mt-1 shrink-0 select-none">·</span><span>${inline(line.replace(/^[-*+] /, ''))}</span></li>`);
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
    result.push(`<p class="text-gray-700 leading-[1.85] mb-5">${inline(line)}</p>`);
  }

  closeList(); closeTable(); closeBlockquote();
  return result.join('\n');
}

/**
 * Drop the in-body 「延伸閱讀」 H2 (or H3, Phase B) section at render time (blueprint 2.2-9:
 * only ONE related-reading block per article — the template's card grid).
 * The source markdown is untouched; the curated links remain available to
 * the card grid's path/tag algorithm. Trailing trust lines that some
 * articles place AFTER the 延伸閱讀 list （來源與證據評級／公正聲明／
 * 利益揭露） are preserved — they belong to the article's fixed ending.
 */
function stripRelatedSection(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let skipping = false;
  let skipLevel = 2;
  for (const line of lines) {
    const isH2 = /^## /.test(line);
    const isH3 = /^### /.test(line);
    if (isH2 || isH3) {
      const level = isH2 ? 2 : 3;
      if (skipping && level <= skipLevel) skipping = false;
      if (!skipping && line.trim() === `${'#'.repeat(level)} 延伸閱讀`) {
        skipping = true;
        skipLevel = level;
        continue;
      }
      if (skipping) continue;
    }
    if (skipping && !/^\*\*(來源與證據評級|公正聲明|利益揭露)/.test(line)) {
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // 動態載入 images.json，優先使用 images.json 中的封面圖
  const imagesData = await getImages();
  const coverImageUrl = getPostImageUrl(imagesData, slug) || post.coverImage;

  const htmlContent = markdownToHtml(stripRelatedSection(post.content));
  const verdict = getVerdict(slug);
  const episode = getEpisode(slug);
  // 封面三式系統 (blueprint 3.4): series assignment + source label
  const coverStyle = getCoverStyle(post.category);
  const coverSeriesLabel = getCoverSeriesLabel(post.category);
  const coverSourceLabel = getCoverSourceLabel(imagesData.posts[slug]?.source);
  const catInfo = CATEGORY_MAP[post.category] ?? { label: post.category, badgeClass: 'bg-gray-100 text-gray-700', accentColor: 'text-olive-600' };

  // Next article on the same learning path (shown in its own box above
  // 延伸閱讀; excluded from the related list so it is not duplicated).
  const pathPos = findPathPosition(slug);
  const nextInPath = getNextInPath(slug);
  const nextPost = nextInPath ? getPostBySlug(nextInPath.entry.slug) : null;

  // Related posts — path adjacency first, then tag overlap, then same
  // category. (Tag-only scoring degenerated to same-category random picks:
  // 85 of 117 tags are used once, so tags almost never pair up.)
  const postTags = new Set(post.tags || []);
  const related = getAllPosts()
    .filter((p) => p.slug !== slug && p.slug !== nextInPath?.entry.slug)
    .map((p) => {
      const pos = findPathPosition(p.slug);
      const samePath = !!(pos && pathPos && pos.path.id === pathPos.path.id);
      const adjacent = samePath && Math.abs(pos!.index - pathPos!.index) === 1;
      const sharedTags = (p.tags || []).filter((t) => postTags.has(t));
      const sameCategory = p.category === post.category;
      const score =
        (adjacent ? 100 : 0) +
        (samePath && !adjacent ? 40 : 0) +
        sharedTags.length * 3 +
        (sameCategory ? 1 : 0);
      let reason = '';
      if (adjacent) {
        reason = `同屬「${pathPos!.path.label}」路徑的${pos!.index > pathPos!.index ? '下一篇' : '上一篇'}`;
      } else if (samePath) {
        reason = `同屬「${pathPos!.path.label}」學習路徑`;
      } else if (sharedTags.length > 0) {
        reason = `同樣談${sharedTags[0]}`;
      } else if (sameCategory) {
        reason = `同屬${categoryLabel(p.category)}`;
      }
      return { post: p, score, reason };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

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
              url: (() => {
                const raw = coverImageUrl || post.coverImage || '';
                return raw.startsWith('http') ? raw : `https://olive-wisdom.com${raw}`;
              })(),
              caption: `${post.title} — 知橄生活 Olive Wisdom`,
            },
            datePublished: post.date,
            dateModified: post.updated || post.date,
            author: {
              '@type': 'Organization',
              name: post.author || '知橄生活研究團隊',
              url: 'https://olive-wisdom.com/about',
            },
            publisher: {
              '@type': 'Organization',
              name: '知橄生活 Olive Wisdom',
              url: 'https://olive-wisdom.com',
              logo: { '@type': 'ImageObject', url: 'https://olive-wisdom.com/icon-512.png' },
            },
            url: `https://olive-wisdom.com/blog/${slug}`,
            mainEntityOfPage: { '@type': 'WebPage', '@id': `https://olive-wisdom.com/blog/${slug}` },
            inLanguage: 'zh-TW',
            // Chinese has no word spaces, so split(/\s+/) counts lines, not
            // words — use character count instead.
            wordCount: post.content ? post.content.length : undefined,
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
            // AudioObject is added only when a real episode with an audio
            // file is registered for this article (blueprint 2.4-3).
            ...(episode?.audioUrl
              ? {
                  associatedMedia: {
                    '@type': 'AudioObject',
                    name: episode.title || post.title,
                    contentUrl: episode.audioUrl,
                    ...(episode.durationSec
                      ? {
                          duration: `PT${Math.floor(episode.durationSec / 60)}M${episode.durationSec % 60}S`,
                        }
                      : {}),
                    ...(episode.publishedAt ? { uploadDate: episode.publishedAt } : {}),
                  },
                }
              : {}),
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

      {/* FAQ Schema — article-specific only. The old category-default
          fallback asserted claims EFSA has rejected (anti-inflammatory /
          cardiovascular efficacy, morning fasting spoon advice); it never
          fired while 61/61 articles carry their own faq[], but it was a
          landmine for any future article without one. Removed (audit P0-7):
          no faq[] in frontmatter → no FAQPage schema, full stop. */}
      {post.faq && post.faq.length > 0 && (
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
      )}

      {/* Breadcrumb — minimal strip above hero */}
      <div className="max-w-[740px] mx-auto px-5 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-[11px] font-sans text-stone-500 tracking-wide">
          <Link href="/" className="hover:text-olive-600 transition-colors">首頁</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-olive-600 transition-colors">知識庫</Link>
          <span>/</span>
          <span className={`font-semibold ${catInfo.accentColor ?? 'text-olive-600'}`}>{catInfo.label}</span>
        </nav>
      </div>

      {/* Cover Image — preserves source aspect ratio (1408×768 ≈ 11:6), no cropping
          mobile: native ratio for snug fit
          desktop: native ratio capped by max-width container (max-w-6xl) — avoids ultrawide stretch
          Golden Template v1: 2026-05-14 — fix for cropped headers from object-cover on fixed-height container */}
      {coverImageUrl && (
        <figure className="bg-stone-100 mt-4 mx-auto max-w-6xl">
          <div className="relative w-full aspect-[1408/768] overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={post.coverAlt || `${post.title} — 知橄生活 Olive Wisdom`}
              fill
              className="object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
              priority
            />
            {/* Cover series chip (blueprint 3.4): CSS-only series mark,
                identical treatment on every cover */}
            {coverSeriesLabel && (
              <span className="absolute bottom-3 right-3 bg-black/55 text-white text-[10px] font-sans font-semibold tracking-[0.25em] uppercase px-2.5 py-1">
                {coverSeriesLabel}
              </span>
            )}
          </div>
          <figcaption className="px-4 py-2.5 text-xs text-stone-600 font-sans">
            封面圖{coverSourceLabel ? `：${coverSourceLabel}` : ''}・{coverStyle.name}
          </figcaption>
        </figure>
      )}

      {/* ── Article Header — below image, editorial ─────────────── */}
      <div className="border-b border-stone-100 bg-white">
        <div className="max-w-[740px] mx-auto px-5 sm:px-6 pt-8 pb-8">
          {/* Read time — category already shown in breadcrumb above */}
          <p className="text-[11px] font-sans text-stone-500 tracking-wide mb-5">{post.readTime} 分鐘閱讀</p>
          {/* Title */}
          <h1 className="font-serif text-3xl md:text-[2.5rem] font-bold text-olive-950 leading-[1.2] tracking-tight mb-6 max-w-[640px]">
            {post.title}
          </h1>
          {/* Byline + Olive Dr. badge */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-sans text-stone-500 border-t border-stone-100 pt-5">
            <span className="font-medium text-olive-700">{post.author || '知橄生活研究團隊'}</span>
            <span className="text-stone-300">|</span>
            <span>{new Date(post.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {post.updated && post.updated !== post.date && (
              <>
                <span className="text-stone-300">|</span>
                <span>更新於 {new Date(post.updated).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </>
            )}
            {(post.category === 'science' || post.category === 'health') && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-olive-50 text-olive-700 px-2.5 py-1 rounded-full font-medium border border-olive-200">
                Olive Dr. 科學審閱
              </span>
            )}
          </div>

          {/* 本文判讀卡 (blueprint 2.3-1); renders for articles with a
              verdict/basis entry in src/lib/verdicts.ts */}
          {verdict && <VerdictCard verdict={verdict} />}

          {/* Podcast 槽位 (blueprint 2.4-1): renders only when this article
              has a registered episode in src/lib/podcast.ts */}
          <PodcastSlot episode={episode} />
        </div>
      </div>

      {/* Table of Contents */}
      <TableOfContents htmlContent={htmlContent} />

      {/* Article Body */}
      <article className="max-w-[720px] mx-auto px-4 sm:px-6 pt-10 pb-16" data-pagefind-body>
        {/* Lead / Excerpt */}
        <p className="article-excerpt text-[1.15rem] text-stone-600 leading-[1.8] mb-10 font-sans border-l-[3px] border-olive-400 pl-5 italic">
          {post.excerpt}
        </p>

        {/* Affiliate Disclosure */}
        <AffiliateDisclosure content={post.content} />

        {/* Tags — each links to the topics hub */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href="/topics"
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

        {/* Share row — directly after the article's fixed ending
            （一句話總結 → 來源與證據評級 → 公正聲明）, before the CTA
            (blueprint 2.2-7; was buried at the very bottom of the page) */}
        <div className="mt-10 pt-6 border-t border-olive-100">
          <ShareButtons title={post.title} url={`https://olive-wisdom.com/blog/${slug}`} />
        </div>

        {/* Single follow CTA (blueprint 2.2-8) */}
        <ArticleNewsletterCTA />

        {/* Podcast 時間戳 (blueprint 2.4-2): anchored to this article's H2s;
            renders only when an episode with matching timestamps exists */}
        <PodcastTimestamps episode={episode} htmlContent={htmlContent} />

        {/* FAQ Accordion — article-specific Q&A for SEO Featured Snippets */}
        {post.faq && post.faq.length > 0 && (
          <div className="mt-12 pt-8 border-t border-olive-100">
            <h2 className="text-xl font-bold text-olive-800 mb-6 tracking-tight">
              常見問題
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
            <h3 className="text-sm font-sans font-semibold text-stone-400 tracking-[0.2em] uppercase mb-4">
              參考文獻
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

        {/* 修訂紀錄 — only when an update date exists and differs from the
            publish date (blueprint 2.3-5). Frontmatter has no change-note
            field, so only dates are shown; notes are never fabricated. */}
        {post.updated && post.updated !== post.date && (
          <div className="mt-12 pt-8 border-t border-olive-100">
            <h3 className="text-sm font-sans font-semibold text-stone-400 tracking-[0.2em] uppercase mb-4">
              修訂紀錄
            </h3>
            <ul className="text-sm text-stone-500 font-sans space-y-1">
              <li>
                初版發布：
                {new Date(post.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
              </li>
              <li>
                最近更新：
                {new Date(post.updated).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
              </li>
            </ul>
          </div>
        )}

      </article>

      {/* Author Trust Block — editorial byline style */}
      <section className="max-w-[720px] mx-auto px-4 sm:px-6 py-8">
        <div className="border-t border-stone-200 pt-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar — simple monogram */}
            <div className="w-12 h-12 rounded-full bg-olive-100 border border-olive-200 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <ellipse cx="14" cy="14" rx="5" ry="8" fill="#4a5824" transform="rotate(-20 14 14)" />
                <path d="M14 6 Q18 10 16 16 Q14 20 12 18" stroke="#7a8f3a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-olive-900 text-[0.95rem] mb-0.5">{post.author || '知橄生活研究團隊'}</p>
              <p className="text-xs text-stone-400 font-sans mb-3 tracking-wide">知橄生活 Olive Wisdom 編輯部</p>
              <p className="text-sm text-stone-500 font-sans leading-relaxed">
                由食品科學、分子生物學與地中海飲食研究背景的編輯團隊撰稿，
                引用 PREDIMED、哈佛醫學院、EFSA、IOC 等學術文獻。
                所有科學主張均可追溯至原始研究來源。
              </p>
              {/* Trust tags — text only, no emoji */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['引用文獻可查', '無業配廣告', 'IOC 標準對標', '定期更新'].map((label) => (
                  <span key={label}
                    className="text-[11px] font-sans font-medium text-olive-600 border border-olive-200 px-2.5 py-0.5 rounded-sm">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom row */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <a href="/about#editorial-standards" className="text-xs text-stone-400 hover:text-olive-600 font-sans transition-colors">
              編輯標準與公正聲明 →
            </a>
            <Link href="/blog" className="text-xs text-stone-400 hover:text-olive-600 font-sans transition-colors">
              ← 返回文章列表
            </Link>
          </div>
        </div>
      </section>

      {/* Next in learning path — above 延伸閱讀 */}
      {nextPost && nextInPath && (
        <section className="bg-white py-12 px-6 border-t border-stone-200">
          <div className="max-w-[900px] mx-auto">
            <div className="flex items-center gap-5 mb-6">
              <span className="text-[10px] font-sans font-semibold text-stone-500 tracking-[0.3em] uppercase whitespace-nowrap">
                這條路徑的下一篇
              </span>
              <div className="h-px flex-1 bg-stone-200" />
              <Link href="/about#learning-paths" className="text-[10px] font-sans font-semibold text-olive-600 hover:text-olive-800 tracking-[0.2em] uppercase transition-colors whitespace-nowrap">
                學習路徑 →
              </Link>
            </div>
            <Link href={`/blog/${nextPost.slug}`} className="group block border border-olive-200 bg-olive-50/50 p-6 hover:border-olive-300 transition-colors">
              <p className="text-[11px] font-sans font-semibold text-olive-600 tracking-[0.2em] uppercase mb-2">
                {nextInPath.path.label} · {nextInPath.entry.stage}
              </p>
              <h3 className="text-lg font-bold text-olive-900 leading-snug mb-2 group-hover:text-olive-700 transition-colors">
                {nextPost.title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed font-sans line-clamp-2">
                {nextPost.excerpt}
              </p>
            </Link>
          </div>
        </section>
      )}

      {/* Related Articles — Kinfolk editorial style */}
      {related.length > 0 && (
        <section className="bg-[#fafaf7] py-16 px-6 border-t border-stone-200">
          <div className="max-w-[900px] mx-auto">
            {/* Section header */}
            <div className="flex items-center gap-5 mb-10">
              <span className="text-[10px] font-sans font-semibold text-stone-500 tracking-[0.3em] uppercase whitespace-nowrap">
                延伸閱讀
              </span>
              <div className="h-px flex-1 bg-stone-200" />
              <Link href="/blog" className="text-[10px] font-sans font-semibold text-olive-600 hover:text-olive-800 tracking-[0.2em] uppercase transition-colors whitespace-nowrap">
                所有文章 →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((rel) => (
                <Link key={rel.post.slug} href={`/blog/${rel.post.slug}`} className="group">
                  <article>
                    {/* Image */}
                    {(imagesData.posts?.[rel.post.slug]?.url || rel.post.coverImage) && (
                      <div className="relative aspect-video overflow-hidden bg-stone-200 mb-4">
                        <Image
                          src={imagesData.posts?.[rel.post.slug]?.url || rel.post.coverImage || ''}
                          alt={`${rel.post.title} — 知橄生活 Olive Wisdom`}
                          fill
                          className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.2em] uppercase mb-2">
                      {categoryLabel(rel.post.category)}
                    </p>
                    <h3 className="text-[0.95rem] font-bold text-olive-900 leading-snug line-clamp-2 mb-2
                                   group-hover:text-olive-700 transition-colors tracking-tight">
                      {rel.post.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-sans mb-3">
                      {rel.post.excerpt}
                    </p>
                    {rel.reason && (
                      <p className="text-[11px] font-sans text-olive-600 mb-3">{rel.reason}</p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] font-sans text-stone-500">
                      <span>{new Date(rel.post.date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}</span>
                      <span className="w-1 h-1 rounded-full bg-stone-300 inline-block" />
                      <span>{rel.post.readTime} 分鐘閱讀</span>
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
