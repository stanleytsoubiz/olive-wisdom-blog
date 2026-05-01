import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '關於知橄生活｜編輯團隊與專業資歷',
  description: '知橄生活 Olive Wisdom 由食品科學、分子生物學與地中海飲食研究背景的編輯團隊撰稿，引用 PREDIMED、哈佛醫學院、EFSA 等 150+ 篇學術文獻，為您提供最嚴謹的橄欖油知識。',
  openGraph: {
    title: '關於知橄生活 Olive Wisdom — 研究團隊與專業資歷',
    description: '由科學審核委員會、歷史文化研究組、感官鑑賞認證組組成的專業編輯團隊，引用 150+ 篇同行評審文獻。',
    url: 'https://olive-wisdom.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
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
            description: '由食品科學、分子生物學與地中海飲食研究背景的編輯團隊撰稿，引用 PREDIMED、哈佛醫學院、EFSA、IOC 等 150+ 篇學術文獻，為 35+ 知性追求者打造的橄欖油科學與美學空間。',
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
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1600&auto=format&fit=crop&q=80"
          alt="知橄生活 — 關於我們"
          fill className="object-cover" priority unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-olive-900/60 to-olive-800/80" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
          <div>
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-3">About Us</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">關於知橄生活</h1>
            <p className="text-olive-200 text-lg">真正的選擇，始於真正的理解。</p>
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
          <div className="bg-olive-50 rounded-2xl p-8 border border-olive-100">
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
            {[
              { icon: '🏛️', label: '知性史詩', en: 'Heritage', desc: '橄欖油與文明的交織敘事；荷馬史詩、腓尼基貿易、考古新發現' },
              { icon: '🔬', label: '科學萃取', en: 'Science', desc: '分子醫學、多酚機制、學術研究解析；深度科普' },
              { icon: '🏆', label: '品味鑑賞', en: 'Selection', desc: '感官鑑賞、IOC 評分標準、產地風土、辨別真偽' },
              { icon: '✨', label: '餐桌美學', en: 'Lifestyle', desc: '晨間儀式、烹飪技法、護膚程序、藍區飲食' },
            ].map((col) => (
              <div key={col.en} className="bg-olive-700/50 rounded-xl p-5 border border-olive-600">
                <span className="text-3xl">{col.icon}</span>
                <p className="text-xs text-olive-400 tracking-widest uppercase mt-2">{col.en}</p>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">{col.label}</h3>
                <p className="text-sm text-olive-300 leading-relaxed">{col.desc}</p>
              </div>
            ))}
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

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              emoji: '🔬',
              name: '科學審核委員會',
              role: 'Science Review Board',
              expertise: '食品化學 · 分子生物學 · 營養流行病學',
              credentials: ['PREDIMED 研究方法論', 'EFSA 健康聲稱評估框架', '橄欖油多酚分析標準 COI/T.20'],
              publications: '審核並引用 150+ 篇同行評審文獻',
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
            <div key={member.role} className="bg-white rounded-2xl shadow-sm border border-olive-100 p-7 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{member.emoji}</div>
              <h3 className="font-bold text-olive-800 text-lg mb-1">{member.name}</h3>
              <p className="text-xs text-olive-500 tracking-wider uppercase mb-3">{member.role}</p>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{member.expertise}</p>
              <ul className="space-y-1 mb-4">
                {member.credentials.map((c) => (
                  <li key={c} className="text-xs text-gray-500 flex items-start gap-2">
                    <span className="text-olive-400 mt-0.5">✓</span>{c}
                  </li>
                ))}
              </ul>
              <p className="text-xs font-medium text-olive-600 bg-olive-50 px-3 py-1.5 rounded-lg">{member.publications}</p>
            </div>
          ))}
        </div>

        {/* 引用機構信賴標章 */}
        <div className="bg-gradient-to-r from-olive-50 to-gold-50 rounded-2xl p-8 border border-olive-100">
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
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-olive-800 mb-6">我們對讀者的承諾</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '📖', title: '引用透明', desc: '每篇文章附完整參考文獻，數字可追溯' },
            { icon: '🚫', title: '不接業配', desc: '知橄生活不接受橄欖油品牌廣告，確保客觀立場' },
            { icon: '🎓', title: '持續深耕', desc: '每週發布經過深度研究的知識庫文章' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl shadow-sm p-6 text-center">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold text-olive-800 mt-3 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
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
            訂閱週報 🫒
          </Link>
        </div>
      </section>
    </main>
  );
}
