import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { LEARNING_PATHS, POLYPHENOL_PATH, GUARDRAIL_QUESTIONS } from '@/lib/learning-paths';
import { CATEGORY_COLUMNS } from '@/lib/categories';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '關於知橄生活｜編輯團隊與專業資歷',
  description: '知橄生活 Olive Wisdom 由食品科學、分子生物學與地中海飲食研究背景的編輯團隊撰稿，引用 PREDIMED、哈佛醫學院、EFSA 等權威機構研究文獻，提供可追溯來源的橄欖油知識。',
  openGraph: {
    title: '關於知橄生活 Olive Wisdom — 研究團隊與專業資歷',
    description: '由科學審核委員會、歷史文化研究組、感官鑑賞認證組組成的專業編輯團隊，引用來源與證據等級見證據圖書館。',
    url: 'https://olive-wisdom.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  // Article count is computed from the content bundle so it never goes
  // stale again (was hard-coded "45 篇" while the site had 52).
  const articleCount = getAllPosts().length;
  return (
    <main className="min-h-screen bg-[#fafaf7]">
      {/* E-E-A-T Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['Organization', 'NewsMediaOrganization'],
            name: '知橄生活 Olive Wisdom',
            alternateName: ['Olive Wisdom', 'Olive Wisdom Blog', '知橄生活'],
            url: 'https://olive-wisdom.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://olive-wisdom.com/favicon.ico',
              caption: '知橄生活 Olive Wisdom — 橄欖油知識平台',
            },
            description: '由食品科學、分子生物學與地中海飲食研究背景的編輯團隊撰稿，引用 PREDIMED、哈佛醫學院、EFSA、IOC 等權威機構研究文獻的橄欖油知識平台。',
            knowsAbout: [
              '橄欖油', '特級初榨橄欖油 EVOO', '地中海飲食', '多酚 Polyphenols',
              '羥基酪醇 Hydroxytyrosol', 'PREDIMED 研究', '橄欖油感官評鑑 IOC', '抗老化科學',
              '食品科學', '分子生物學', '營養流行病學',
            ],
            sameAs: [
              'https://olive-wisdom.com',
              'https://olive-wisdom.com/about',
              'https://olive-wisdom.com/blog',
            ],
            foundingDate: '2026',
            inLanguage: 'zh-TW',
            publishingPrinciples: 'https://olive-wisdom.com/about',
            correctionsPolicy: 'https://olive-wisdom.com/about',
            ethicsPolicy: 'https://olive-wisdom.com/about',
            diversityPolicy: 'https://olive-wisdom.com/about',
            verificationFactCheckingPolicy: 'https://olive-wisdom.com/about',
            actionableFeedbackPolicy: 'https://olive-wisdom.com/about',
          }),
        }}
      />
      {/* Hero */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1600&auto=format&fit=crop&q=80"
          alt="知橄生活 — 關於我們"
          fill className="object-cover" priority unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        {/* Bottom-anchored */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-gold-400 text-[10px] font-sans font-semibold tracking-[0.35em] uppercase mb-3">About Us</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">關於知橄生活</h1>
            <p className="text-olive-200 text-base font-sans">真正的選擇，始於真正的理解。</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-olive-600 text-sm font-medium tracking-widest uppercase mb-3">Our Mission</p>
            <h2 className="text-3xl font-bold text-olive-800 mb-6">為什麼是知橄生活？</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                橄欖油的世界，充斥著行銷話術與知識斷層。我們的讀者——35 歲以上、重視健康品質、願意深入理解的知性人士——值得更好的資訊環境。
              </p>
              <p>
                知橄生活不是另一個「10 個橄欖油好處」的清單部落格。我們是一個知識深潛基地，帶您了解「羥基酪醇如何透過 Nrf2 通路在 DNA 層級建立抗老防護」這種層次的知識。
              </p>
              <p>
                每一篇文章，都錨定在可追溯的學術文獻上；每一個健康聲稱，都需要 PREDIMED、哈佛醫學院、EFSA 的研究數據支撐。
              </p>
            </div>
          </div>
          <div className="bg-white border border-stone-200 p-8">
            <h3 className="text-lg font-bold text-olive-800 mb-6">品牌三位一體</h3>
            <div className="space-y-5">
              {[
                { icon: '🔬', title: '科學嚴謹', desc: '每個主張必須可溯源至學術文獻（PREDIMED、哈佛、EFSA、IOC）' },
                { icon: '✍️', title: '知性優雅', desc: '語言如散文，不像說明書；如導師，不像廣告' },
                { icon: '🏡', title: '生活美學', desc: '將知識轉化為可實踐的生活儀式感' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-bold text-olive-700 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 四大欄目 */}
      <section className="bg-olive-800 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-gold-400 text-xs font-medium tracking-widest uppercase mb-3 text-center">知識體系</p>
          <h2 className="text-3xl font-bold text-center mb-10">四大知識欄目</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(['culture', 'science', 'health', 'lifestyle'] as const).map((key) => {
              const col = CATEGORY_COLUMNS.find((c) => c.key === key)!;
              const meta: Record<string, { icon: string; desc: string }> = {
                culture: { icon: '🏛️', desc: '橄欖油與文明的交織敘事；荷馬史詩、腓尼基貿易、考古新發現' },
                science: { icon: '🔬', desc: '分子醫學、多酚機制、學術研究解析；深度科普' },
                health: { icon: '🏆', desc: '感官鑑賞、IOC 評分標準、產地風土、辨別真偽' },
                lifestyle: { icon: '✨', desc: '晨間儀式、烹飪技法、護膚程序、藍區飲食' },
              };
              return (
                <Link key={col.key} href={col.href} className="block bg-olive-700/50 rounded-xl p-5 border border-olive-600 hover:bg-olive-700 transition-colors">
                  <span className="text-3xl">{meta[key].icon}</span>
                  <p className="text-xs text-olive-400 tracking-widest uppercase mt-2">{col.en}</p>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">{col.label}</h3>
                  <p className="text-sm text-olive-300 leading-relaxed">{meta[key].desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* ── E-E-A-T 編輯團隊與專業資歷 ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-olive-600 text-xs font-medium tracking-widest uppercase mb-3">Editorial Team</p>
          <h2 className="text-3xl font-bold text-olive-800 mb-4">知橄生活研究團隊</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            所有內容均由具備食品科學、分子生物學與地中海飲食研究背景的編輯團隊審核，
            並引用 PREDIMED、哈佛醫學院、EFSA、IOC 等國際權威機構研究文獻。
          </p>
        </div>

        <div className="space-y-10 mb-16">
          {[
            {
              emoji: '🔬',
              name: '科學審核委員會',
              role: 'Science Review Board',
              expertise: '食品化學 · 分子生物學 · 營養流行病學',
              credentials: ['PREDIMED 研究方法論', 'EFSA 健康聲稱評估框架', '橄欖油多酚分析標準 COI/T.20'],
              publications: '引用來源與證據等級，見證據圖書館',
              publicationsHref: '/evidence',
            },
            {
              emoji: '🏛️',
              name: '歷史與文化研究組',
              role: 'Heritage Research Group',
              expertise: '地中海考古 · 食物文化史 · 古典文獻學',
              credentials: ['荷馬史詩原典研讀', '克里特島考古文獻', '絲路貿易史料研究'],
              publications: '涵蓋 3,000 年橄欖油文明史脈絡',
            },
            {
              emoji: '🏆',
              name: '感官鑑賞認證組',
              role: 'Sensory Evaluation Unit',
              expertise: 'IOC 感官評鑑 · 產地風土分析 · 品質認證標準',
              credentials: ['IOC 橄欖油感官評鑑標準 COI/T.20/Doc.15', 'EU Regulation 2568/91', 'PDO/PGI 認證體系'],
              publications: '覆蓋 15+ 主要產油國風土數據',
            },
          ].map((member) => (
            <div key={member.role} className="border-b border-stone-200 pb-10 last:border-0">
              <div className="flex items-start gap-6">
                <div className="text-4xl shrink-0 mt-1">{member.emoji}</div>
                <div className="flex-1">
                  <p className="text-[10px] font-sans font-semibold text-stone-500 tracking-[0.25em] uppercase mb-1">{member.role}</p>
                  <h3 className="font-bold text-olive-900 text-xl mb-1">{member.name}</h3>
                  <p className="text-sm text-olive-600 font-sans mb-3">{member.expertise}</p>
                  <ul className="space-y-1 mb-3">
                    {member.credentials.map((c) => (
                      <li key={c} className="text-sm text-stone-500 flex gap-2">
                        <span className="text-olive-400 shrink-0">✓</span>{c}
                      </li>
                    ))}
                  </ul>
                  {(member as { publicationsHref?: string }).publicationsHref ? (
                    <Link href={(member as { publicationsHref: string }).publicationsHref} className="text-xs font-sans font-semibold text-olive-600 hover:text-olive-800 underline underline-offset-4">
                      {member.publications} →
                    </Link>
                  ) : (
                    <p className="text-xs font-sans font-semibold text-olive-600">{member.publications}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 引用機構信賴標章 */}
        <div className="border border-stone-200 bg-white px-8 py-6">
          <p className="text-center text-xs text-olive-600 tracking-widest uppercase mb-6">引用來源與合作機構</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['PREDIMED Study', 'Harvard T.H. Chan', 'EFSA', 'IOC', 'NEJM', 'JAMA Internal Medicine', 'Frontiers in Nutrition', 'Nature Medicine'].map((org) => (
              <span key={org} className="bg-white text-olive-700 text-sm font-medium px-4 py-2 rounded-full border border-olive-200 shadow-sm">
                {org}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 我們的承諾 */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-olive-800 mb-6 text-center">我們對讀者的承諾</h2>
        <div className="grid md:grid-cols-3 gap-0 border border-stone-200 divide-x divide-stone-200">
          {[
            { icon: '📖', title: '引用透明', desc: '每篇文章附完整參考文獻，數字可追溯' },
            { icon: '🚫', title: '不接業配', desc: '知橄生活不接受橄欖油品牌廣告，確保客觀立場' },
            { icon: '🎓', title: '持續深耕', desc: '深度研究文章，依新證據定期更新' },
          ].map((item) => (
            <div key={item.title} className="px-8 py-6">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-bold text-olive-900 mt-3 mb-2">{item.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 編輯標準：數字能追溯，才敢寫出來 ── */}
      <section id="editorial-standards" className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-olive-600 text-xs font-medium tracking-widest uppercase mb-3">Editorial Standards</p>
        <h2 className="text-3xl font-bold text-olive-800 mb-4">編輯標準：數字能追溯，才敢寫出來</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-2xl">
          以下四條是知橄生活的編輯運作方式——從選題、查核到更新——供讀者、研究者及引用者查閱。完整證據來源與評級標準見
          <Link href="/evidence" className="text-olive-700 underline underline-offset-4 ml-1">證據圖書館</Link>；本站販售產品的選品門檻與查驗流程見
          <Link href="/selection" className="text-olive-700 underline underline-offset-4 ml-1">選品標準</Link>；寫作語氣、標題與聲稱規則見
          <a href="https://github.com/stanleytsoubiz/olive-wisdom-blog/blob/main/docs/editorial-style-guide.md" className="text-olive-700 underline underline-offset-4 ml-1">編輯風格指南</a>。
        </p>
        <div className="space-y-10">
          {[
            {
              label: '選題原則',
              title: '只寫文獻夠多的主題',
              body: '我們只寫有足夠學術文獻支撐的主題。無論某個話題在社群媒體上多麼熱門，若缺乏同行評審研究的支持，我們不會將其呈現為已確立的事實；若找不到至少兩篇獨立的同行評審研究，該主題將被暫緩或重新定位。編輯團隊每月固定追蹤 PubMed、Frontiers in Nutrition 及《新英格蘭醫學期刊》（NEJM）的最新發表。我們不因商業利益或流行趨勢調整選題方向。',
            },
            {
              label: '引用標準',
              title: '每一個數字都要找得到出處',
              body: '文章中的所有數字、百分比及健康聲稱，必須可追溯至原始研究；我們不接受「據說」或「研究顯示」等無出處的表述。引用格式遵循學術慣例，包含第一作者姓名、期刊名稱、發表年份，以及 DOI 或公開連結。若引用的是媒體報導或二手資料，會明確標示「引自」，並同時附上原始一級文獻的連結。維基百科不作為最終資料來源。',
            },
            {
              label: '獨立性聲明',
              title: '不接業配，推薦只看標準與數據',
              body: '知橄生活不接受橄欖油品牌或相關產業的廣告委刊或業配合作。目前本站文章不含聯盟行銷連結；若未來引入任何聯盟行銷合作，會在文章開頭以明確文字揭露。產品推薦完全基於 IOC 官方感官評鑑標準，以及經科學認證的多酚含量數據，而非品牌贊助或廠商提供的樣品；若撰文者對某一品牌或產品存在任何形式的利益關係，該利益衝突將在文章中主動揭露。',
            },
            {
              label: '更新與更正',
              title: '寫錯了就公開改，不靜默修改',
              body: '科學是持續演進的。若文章發布後有新研究顯著推翻或修正既有觀點，我們承諾在 30 天內完成更新，並在文章末尾標註修訂日期與修訂摘要；若更正涉及實質性事實錯誤，會在文章頂部加上醒目的「更正說明」區塊。引用超過 3 年的研究數據會進入定期審查程序。若您發現事實錯誤或引用失效的連結，請透過聯絡頁面告訴我們，我們承諾在收到通知後的 7 個工作天內回覆。',
            },
          ].map((item) => (
            <div key={item.label} className="border-b border-stone-200 pb-8 last:border-0">
              <p className="text-[10px] font-sans font-semibold text-stone-500 tracking-[0.25em] uppercase mb-2">{item.label}</p>
              <h3 className="font-bold text-olive-900 text-xl mb-3">{item.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 學習路徑：先懂證據，再選油 ── */}
      <section id="learning-paths" className="bg-white border-y border-stone-200 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-olive-600 text-xs font-medium tracking-widest uppercase mb-3">Learning Paths</p>
          <h2 className="text-3xl font-bold text-olive-800 mb-4">學習路徑：先懂證據，再選油</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-2xl">
            本站 {articleCount} 篇文章全數編入五條路徑：每一條都從入門讀到研究級，讀完就能自己判斷一瓶油。健康知識最容易被誇大，所以我們先把證據分層——哪些結論來自大型人體研究，哪些只是機理或初步觀察，哪些不能被說成治療或預防疾病。
          </p>

          {/* 五條路徑 — 內容見 src/lib/learning-paths.ts */}
          <div className="grid md:grid-cols-5 gap-5 mb-14">
            {LEARNING_PATHS.map((path) => (
              <article key={path.id} className="border border-stone-200 p-5">
                <h3 className="font-bold text-olive-900 mb-4">{path.label}</h3>
                <div className="space-y-4">
                  {path.entries.map((entry) => (
                    <Link key={entry.slug} href={`/blog/${entry.slug}`} className="block group border-t border-stone-100 pt-3">
                      <p className="text-[11px] font-sans font-semibold text-stone-500 tracking-[0.2em] uppercase mb-1">{entry.stage}</p>
                      <p className="text-sm font-semibold text-stone-900 leading-snug group-hover:text-olive-700 transition-colors">{entry.title}</p>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* 多酚判讀學習路徑 */}
          <h3 className="font-bold text-olive-900 text-xl mb-3">多酚判讀：先看數字，再看標示，最後看時間</h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-6 max-w-2xl">
            多酚是理解 EVOO 品質、感官與部分健康聲稱條件的重要線索，但不能單獨代表一瓶油的全部。這三篇依序回答數字、標示與時間變化，讓讀者能把 CoA、採收年份、保存條件與感官狀態一起讀。
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-14">
            {POLYPHENOL_PATH.map((entry) => (
              <Link key={entry.slug} href={`/blog/${entry.slug}`} className="group border border-stone-200 p-5 hover:border-olive-300 transition-colors">
                <p className="text-[10px] font-sans font-semibold text-gold-500 tracking-[0.25em] uppercase mb-3">{entry.stage}</p>
                <h4 className="font-bold text-olive-950 leading-snug mb-3 group-hover:text-olive-700 transition-colors">{entry.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">{entry.note}</p>
              </Link>
            ))}
          </div>

          {/* AI 問答高風險題防線 */}
          <h3 className="font-bold text-olive-900 text-xl mb-3">三個最容易被一句話答錯的問題</h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-6 max-w-2xl">
            保存、炒菜與 CoA 多酚，是橄欖油內容最容易被簡化的三個問題。先看正確邊界，再讀主文。
          </p>
          <div className="space-y-4">
            {GUARDRAIL_QUESTIONS.map((entry) => (
              <Link key={entry.slug} href={`/blog/${entry.slug}`} className="block group border border-stone-200 p-5 hover:border-olive-300 transition-colors">
                <p className="text-[11px] font-sans font-semibold text-gold-500 tracking-[0.22em] uppercase mb-2">{entry.query}</p>
                <h4 className="font-bold text-olive-950 leading-snug mb-2 group-hover:text-olive-700 transition-colors">{entry.title}</h4>
                <p className="text-sm text-stone-600 leading-relaxed font-sans">{entry.guardrail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-olive-100 to-gold-50 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-olive-800 mb-4">開始您的知橄旅程</h2>
        <p className="text-gray-500 mb-8">從一篇文章開始，讓科學與美學重新定義您對橄欖油的認識。</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/blog"
            className="inline-block bg-olive-700 hover:bg-olive-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            探索知識庫 →
          </Link>
          <Link
            href="/#subscribe"
            className="inline-block border-2 border-olive-700 text-olive-700 hover:bg-olive-700 hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            追蹤知橄生活 🫒
          </Link>
        </div>
      </section>
    </main>
  );
}
