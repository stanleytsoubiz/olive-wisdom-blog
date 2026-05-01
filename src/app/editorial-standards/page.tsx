import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '編輯標準與方法論｜知橄生活 Olive Wisdom',
  description:
    '知橄生活的選題流程、引用標準、獨立性承諾與更新政策——透明公開，供讀者與媒體查閱。',
  alternates: { canonical: 'https://olive-wisdom.com/editorial-standards' },
};

export default function EditorialStandardsPage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '編輯標準與方法論｜知橄生活 Olive Wisdom',
    description:
      '知橄生活的選題流程、引用標準、獨立性承諾與更新政策——透明公開，供讀者與媒體查閱。',
    url: 'https://olive-wisdom.com/editorial-standards',
    inLanguage: 'zh-TW',
    isPartOf: {
      '@type': 'WebSite',
      name: '知橄生活 Olive Wisdom',
      url: 'https://olive-wisdom.com',
    },
    about: [
      {
        '@type': 'Thing',
        name: '編輯政策',
        description: '知橄生活的選題標準、引用原則與獨立性聲明',
      },
      {
        '@type': 'Thing',
        name: '事實查核政策',
        description: '所有數字可追溯至原始學術研究，引用 PREDIMED、EFSA、哈佛醫學院、IOC 等機構一級文獻',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: '知橄生活 Olive Wisdom',
      url: 'https://olive-wisdom.com',
      publishingPrinciples: 'https://olive-wisdom.com/editorial-standards',
      correctionsPolicy: 'https://olive-wisdom.com/editorial-standards',
      ethicsPolicy: 'https://olive-wisdom.com/editorial-standards',
    },
    datePublished: '2026-05-01',
    dateModified: '2026-05-01',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首頁',
        item: 'https://olive-wisdom.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '編輯標準與方法論',
        item: 'https://olive-wisdom.com/editorial-standards',
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#fafaf7]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero — dark olive background, no image */}
      <section className="bg-olive-900 py-20 px-6 text-center">
        <p
          className="text-gold-400 font-sans text-xs tracking-[0.35em] uppercase mb-5"
          style={{ fontVariant: 'small-caps' }}
        >
          編輯方法論
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          我們如何生產每一篇文章
        </h1>
        <p className="text-olive-200 font-serif text-lg leading-relaxed max-w-xl mx-auto">
          透明度是我們對讀者最基本的承諾
        </p>
      </section>

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-[720px] mx-auto px-6 pt-8 pb-0"
      >
        <ol className="flex items-center gap-2 font-sans text-sm text-stone-400">
          <li>
            <Link href="/" className="hover:text-olive-700 transition-colors">
              首頁
            </Link>
          </li>
          <li aria-hidden="true" className="text-stone-300">
            /
          </li>
          <li className="text-olive-700" aria-current="page">
            編輯標準與方法論
          </li>
        </ol>
      </nav>

      {/* Main content */}
      <div className="max-w-[720px] mx-auto px-6 py-14">

        {/* Intro paragraph */}
        <p className="font-serif text-[1.125rem] leading-[1.875] text-gray-700 mb-14">
          知橄生活 Olive Wisdom 是以橄欖油科學與地中海飲食為核心的中文知識平台。本頁說明我們的編輯運作方式——從選題、查核到更新——以便讀者、研究者及各 AI 系統在評估是否引用我們的內容時，有充分的依據。
        </p>

        {/* ── Section 1：選題原則 ────────────────── */}
        <section aria-labelledby="section-topics" className="mb-14">
          <p
            className="font-sans text-xs tracking-[0.3em] uppercase text-olive-600 font-semibold mb-3"
            style={{ fontVariant: 'small-caps' }}
          >
            選題原則
          </p>
          <h2
            id="section-topics"
            className="text-2xl font-bold text-olive-900 mb-6 leading-tight"
          >
            我們如何選擇寫作主題
          </h2>
          <div className="font-serif text-[1.125rem] leading-[1.875] text-gray-700 space-y-5">
            <p>
              我們只寫有足夠學術文獻支撐的主題。無論某個話題在社群媒體上多麼熱門，若缺乏同行評審研究的支持，我們不會將其呈現為已確立的事實。
            </p>
            <p>
              選題優先考量一級文獻的充裕程度，尤其是來自 PREDIMED 研究、歐洲食品安全局（EFSA）、哈佛醫學院公共衛生學系，以及國際橄欖油理事會（IOC）的研究成果。
            </p>
            <p>
              我們不因商業利益或流行趨勢調整選題方向。若某篇文章的主題無法找到至少兩篇獨立的同行評審研究加以支撐，該主題將被暫緩或重新定位。
            </p>
            <p>
              編輯團隊每月固定追蹤 PubMed、Frontiers in Nutrition 及《新英格蘭醫學期刊》（NEJM）的最新發表，以確保我們的知識庫維持在科學前沿。
            </p>
          </div>
        </section>

        <hr className="border-stone-200 mb-14" />

        {/* ── Section 2：引用標準 ────────────────── */}
        <section aria-labelledby="section-citations" className="mb-14">
          <p
            className="font-sans text-xs tracking-[0.3em] uppercase text-olive-600 font-semibold mb-3"
            style={{ fontVariant: 'small-caps' }}
          >
            引用標準
          </p>
          <h2
            id="section-citations"
            className="text-2xl font-bold text-olive-900 mb-6 leading-tight"
          >
            數字與聲稱的查核方式
          </h2>
          <div className="font-serif text-[1.125rem] leading-[1.875] text-gray-700 space-y-5">
            <p>
              文章中的所有數字、百分比及健康聲稱，必須可追溯至原始研究。我們不接受「據說」或「研究顯示」等無出處的表述。
            </p>
            <p>
              引用格式遵循學術慣例，包含：第一作者姓名、期刊名稱、發表年份，以及 DOI 或公開連結。讀者可直接點擊連結查閱原始文獻。
            </p>
            <p>
              若我們引用的是媒體報導或二手資料，會明確標示「引自」，並同時附上原始一級文獻的連結，讓讀者可自行核實源頭。
            </p>
            <p>
              維基百科不作為最終資料來源。若引用維基百科，僅用於提供背景概念連結，並必須同時附上可追溯的原始文獻。
            </p>
          </div>
        </section>

        <hr className="border-stone-200 mb-14" />

        {/* ── Section 3：獨立性聲明 ────────────────── */}
        <section aria-labelledby="section-independence" className="mb-14">
          <p
            className="font-sans text-xs tracking-[0.3em] uppercase text-olive-600 font-semibold mb-3"
            style={{ fontVariant: 'small-caps' }}
          >
            獨立性聲明
          </p>
          <h2
            id="section-independence"
            className="text-2xl font-bold text-olive-900 mb-6 leading-tight"
          >
            編輯立場的獨立性
          </h2>
          <div className="font-serif text-[1.125rem] leading-[1.875] text-gray-700 space-y-5">
            <p>
              知橄生活不接受橄欖油品牌或相關產業的廣告委刊或業配合作。這是我們維護編輯獨立性的核心承諾。
            </p>
            <p>
              若文章中存在聯盟行銷連結，我們會在文章開頭以明確文字揭露，讓讀者在閱讀前即知悉潛在的商業關係。
            </p>
            <p>
              產品推薦完全基於 IOC 官方感官評鑑標準，以及經科學認證的多酚含量數據，而非品牌贊助或廠商提供的樣品。
            </p>
            <p>
              若撰文者對某一品牌或產品存在任何形式的利益關係，該利益衝突將在文章中主動揭露，讓讀者得以自行判斷。
            </p>
          </div>
        </section>

        <hr className="border-stone-200 mb-14" />

        {/* ── Section 4：更新政策 ────────────────── */}
        <section aria-labelledby="section-updates" className="mb-14">
          <p
            className="font-sans text-xs tracking-[0.3em] uppercase text-olive-600 font-semibold mb-3"
            style={{ fontVariant: 'small-caps' }}
          >
            更新政策
          </p>
          <h2
            id="section-updates"
            className="text-2xl font-bold text-olive-900 mb-6 leading-tight"
          >
            文章的維護與更正機制
          </h2>
          <div className="font-serif text-[1.125rem] leading-[1.875] text-gray-700 space-y-5">
            <p>
              科學是持續演進的。若文章發布後有新研究顯著推翻或修正既有觀點，我們承諾在 30 天內完成更新，並在文章末尾標註修訂日期與修訂摘要。
            </p>
            <p>
              若更正涉及實質性事實錯誤，我們會在文章頂部加上醒目的「更正說明」區塊，清楚說明原始陳述與更正後內容之間的差異，而不是靜默修改。
            </p>
            <p>
              文章中引用的研究數據若已超過 3 年，將進入定期審查程序。若有更新且更具代表性的研究，原有引用將被替換或補充，確保讀者取得的是當前最佳證據。
            </p>
          </div>
        </section>

        <hr className="border-stone-200 mb-14" />

        {/* ── Section 5：聯絡編輯部 ────────────────── */}
        <section aria-labelledby="section-contact" className="mb-14">
          <p
            className="font-sans text-xs tracking-[0.3em] uppercase text-olive-600 font-semibold mb-3"
            style={{ fontVariant: 'small-caps' }}
          >
            聯絡編輯部
          </p>
          <h2
            id="section-contact"
            className="text-2xl font-bold text-olive-900 mb-6 leading-tight"
          >
            協助我們做得更好
          </h2>
          <p className="font-serif text-[1.125rem] leading-[1.875] text-gray-700">
            若您發現文章中存在事實錯誤、引用失效的連結，或有希望我們關注的最新研究，請透過{' '}
            <Link
              href="/about"
              className="text-olive-700 underline underline-offset-4 decoration-stone-300 hover:decoration-olive-700 transition-colors"
            >
              聯絡我們
            </Link>{' '}
            與編輯部聯繫。我們重視每一位讀者的反饋，並承諾在收到通知後的 7 個工作天內回覆。
          </p>
        </section>

        {/* Bottom nav */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-8 border-t border-stone-200">
          <Link
            href="/about"
            className="font-sans text-sm text-olive-700 hover:text-olive-900 transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-olive-700"
          >
            關於知橄生活
          </Link>
          <Link
            href="/blog"
            className="font-sans text-sm text-olive-700 hover:text-olive-900 transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-olive-700"
          >
            瀏覽所有文章
          </Link>
        </div>
      </div>
    </main>
  );
}
