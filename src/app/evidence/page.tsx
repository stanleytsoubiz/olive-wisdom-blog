import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '證據圖書館',
  description:
    '知橄生活 Olive Wisdom 的證據圖書館：本站所有主張的來源與評級標準。國際橄欖理事會（IOC）貿易標準、歐盟法規、Codex 國際食品標準、EFSA 唯一核准的多酚健康聲稱、PREDIMED 等標誌性研究，以及 CoA 判讀指南——每一項主張都可追溯到原始來源。',
  alternates: { canonical: 'https://olive-wisdom.com/evidence' },
  openGraph: {
    title: '證據圖書館｜知橄生活 Olive Wisdom',
    description:
      '本站所有主張的來源與評級標準：IOC 標準、歐盟法規、Codex、EFSA 健康聲稱、PREDIMED 研究與 CoA 判讀指南。',
    url: 'https://olive-wisdom.com/evidence',
    type: 'website',
    siteName: '知橄生活 Olive Wisdom',
    locale: 'zh_TW',
    images: [
      {
        url: 'https://olive-wisdom.com/hero-grove.webp',
        width: 1200,
        height: 630,
        alt: '知橄生活證據圖書館',
      },
    ],
  },
};

import {
  EVIDENCE_FAQ,
  HIERARCHY,
  ACIDITY_ROWS,
  COA_ROWS,
  GRADES,
  STUDIES,
  TFDA_ROWS,
  SELECTION_CRITERIA,
  EVIDENCE_LAST_CHECKED,
  EVIDENCE_CHECK_CADENCE,
} from '@/lib/evidence';

function SectionHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mb-8">
      <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.3em] uppercase mb-3">{eyebrow}</p>
      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-stone-900 leading-tight mb-4">{title}</h2>
      {intro && <p className="text-sm md:text-base text-stone-600 leading-relaxed font-sans max-w-3xl">{intro}</p>}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm bg-white">
        <thead>
          <tr className="bg-olive-800 text-white">
            {headers.map((h) => (
              <th key={h} className="border border-olive-300 px-4 py-2 font-semibold text-sm text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-olive-50">
              {row.map((cell, j) => (
                <td key={j} className={`border border-olive-200 px-4 py-2 text-sm ${j === 0 ? 'font-semibold bg-olive-50' : ''}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EvidencePage() {
  return (
    <main className="min-h-screen bg-[#fafaf7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '證據圖書館｜知橄生活 Olive Wisdom',
            description:
              '本站所有主張的來源與評級標準：IOC 標準、歐盟法規、Codex、EFSA 健康聲稱、PREDIMED 研究與 CoA 判讀指南。',
            url: 'https://olive-wisdom.com/evidence',
            inLanguage: 'zh-TW',
            isPartOf: { '@type': 'WebSite', name: '知橄生活 Olive Wisdom', url: 'https://olive-wisdom.com' },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: EVIDENCE_FAQ.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white border-b border-stone-200 px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-gold-500 text-[10px] font-sans font-semibold tracking-[0.35em] uppercase mb-4">
            Evidence Library
          </p>
          <h1 className="font-serif text-4xl md:text-[2.5rem] font-bold text-stone-900 leading-tight mb-5">證據圖書館</h1>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-2xl font-sans">
            本站所有主張的來源與評級標準。我們不找個人背書——權威來自可查證的原始來源：
            國際標準、歐盟法規、學術研究與檢驗報告。每一項主張都能在這裡找到出處與證據等級。
          </p>
          <p className="text-sm text-stone-500 leading-relaxed max-w-2xl font-sans mt-4">
            關鍵原則：<strong className="text-stone-700">等級由 IOC／Codex／EU 定義；健康聲稱由 EFSA／法規決定；效果證據由研究決定；品質數據由 CoA 決定。</strong>
            四者不可互相替代。
          </p>
          <p className="text-xs text-stone-500 font-sans mt-5">
            最後查核：{EVIDENCE_LAST_CHECKED}・查核節奏：{EVIDENCE_CHECK_CADENCE}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/blog" className="bg-olive-800 hover:bg-olive-900 text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors">
              回知識庫
            </Link>
            <Link href="/about#editorial-standards" className="bg-white hover:bg-stone-50 text-olive-800 text-sm font-medium px-5 py-3 rounded-xl border border-olive-200 transition-colors">
              查看編輯標準
            </Link>
          </div>
        </div>
      </section>

      {/* 1. Hierarchy */}
      <section id="hierarchy" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <SectionHead
          eyebrow="Standards Hierarchy"
          title="權威層級：誰說了算"
          intro="國際橄欖理事會（IOC）制定全球貿易標準，歐盟將其變成具約束力的法律，Codex 是 FAO／WHO 的國際食品標準，USDA 是自願性美國等級標準，各國協會只負責執行與推廣，不制定等級。EFSA 與歐盟健康聲稱法規決定「能合法說什麼」，學術研究提供證據強度，IOC 認可實驗室提供 CoA 檢驗數據。"
        />
        <div className="space-y-4">
          {HIERARCHY.map((item) => (
            <article key={item.name} className="bg-white border border-stone-200 p-6">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="text-[11px] font-sans font-semibold text-gold-600 tracking-[0.2em] uppercase">{item.level}</span>
                <h3 className="font-serif text-xl font-semibold text-olive-950">{item.name}</h3>
                <span className="text-sm text-stone-500 font-sans">— {item.role}</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-sans">{item.doc}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-olive-600 hover:text-olive-800 underline underline-offset-4 mt-3">
                {item.linkLabel} ↗
              </a>
            </article>
          ))}
        </div>
        <p className="text-sm text-stone-500 leading-relaxed font-sans mt-6">
          IOC 不認證個別產品；它發布標準並認可化學／感官實驗室。IOC 成立於 1959 年，總部馬德里，為聯合國體系下的政府間組織，成員覆蓋全球 95% 以上產量。
        </p>
      </section>

      {/* 2. Acidity */}
      <section id="acidity" className="bg-white border-y border-stone-200 px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            eyebrow="Acidity Limits"
            title="等級限值：游離酸度"
            intro="特級初榨的游離酸度上限為 0.8%（以油酸計），IOC、Codex、歐盟與 USDA 四方一致。但酸度 alone 不能證明是特級初榨——CoA 還須有過氧化值、K232／K270、ΔK、脂肪酸／固醇純度、FAEE 與感官小組結果（缺陷中位數 0、果香 >0）。"
          />
          <DataTable
            headers={['等級', 'IOC Rev. 22 / Codex CXS 33', 'EU 2568/91', 'USDA']}
            rows={ACIDITY_ROWS.map((r) => [r.grade, r.ioc, r.eu, r.usda])}
          />
          <p className="text-sm text-stone-500 leading-relaxed font-sans">
            來源：IOC 貿易標準 COI/T.15/NC No. 3/Rev. 22（2026-06）、Codex CXS 33-1981（2024 修訂）、Reg. (EEC) No 2568/91、USDA 橄欖油等級標準。
          </p>
        </div>
      </section>

      {/* 3. CoA */}
      <section id="coa" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <SectionHead
          eyebrow="Certificate of Analysis"
          title="CoA 判讀：數據怎麼來、怎麼判讀"
          intro="一份特級初榨 CoA 應有的核心內容，對照 IOC 貿易標準與 EU 法規。純度與真偽常需另行要求：脂肪酸組成（油酸 55–83%、棕櫚酸 7.5–20%）、FAEE ≤35 mg/kg、固醇、蠟與 2-甘油單棕櫚酸酯等。"
        />
        <DataTable
          headers={['參數', '特級初榨限值', '說明']}
          rows={COA_ROWS.map((r) => [r.param, r.limit, r.note])}
        />
        <div className="bg-white border border-stone-200 p-6">
          <h3 className="font-semibold text-olive-950 mb-3">多酚數字：方法決定可比性</h3>
          <p className="text-sm text-stone-600 leading-relaxed font-sans">
            多酚是法律上 CoA 不要求的項目，但為健康與穩定性的關鍵指標。一般超市特級初榨約 120–210 mg/kg，早摘可超過 800 mg/kg。
            唯一具 IOC 認可的多酚測定方法是 HPLC（COI/T.20/Doc. 29）；Folin-Ciocalteu 與 NMR 總量皆非 IOC 認可方法，數字不可直接比較，
            也不可用來主張歐盟健康聲稱。主張健康聲稱時，須用 HPLC 方法、註明日期的 CoA，並引用「每 20 g 的羥基酪醇＋衍生物」，不只是「總多酚 mg/kg」。
          </p>
          <h3 className="font-semibold text-olive-950 mt-6 mb-3">新鮮度標誌</h3>
          <p className="text-sm text-stone-600 leading-relaxed font-sans">
            1,2-DAGs 高於 90%、PPP（焦脫鎂葉綠素 a）低，可確認新鮮／未混精製油。DAGs 隨存放／受熱下降，PPP 上升。
          </p>
        </div>
      </section>

      {/* 4. Labs */}
      <section id="labs" className="bg-white border-y border-stone-200 px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            eyebrow="Accredited Laboratories"
            title="IOC 認可實驗室"
            intro="IOC 認可為年度制，須具國家認可（通常 ISO/IEC 17025）並通過 IOC 能力測試，採 IOC 建議方法。化學與感官認可分開。現行名單：化學 T.21/Doc. No 13/Rev. 28、感官 T.28/Doc. No 3/Rev. 28，效期 2025-12-01 至 2026-11-30，每年更新。"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <article className="border border-stone-200 p-6">
              <h3 className="font-serif text-xl font-semibold text-olive-950 mb-3">Eurofins</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-sans">
                美國紐奧良中央分析實驗室，ISO 17025 認可；2019 年成為首間獲 IOC 化學認可的美國獨立實驗室。
                提供 IOC 品質檢驗（游離酸、紫外線、DAG、PPP、生物酚）與純度檢驗（固醇、豆甾二烯、蠟、FAMEs、FAEEs、ECN42、生育酚）。
                雅典 Eurofins 亦具 IOC 殘留／污染物檢驗認可。
              </p>
              <a href="https://cdnmedia.eurofins.com/eurofins-us/media/1708209/olive-oil-testing-flyer_pa.pdf" target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-olive-600 hover:text-olive-800 underline underline-offset-4 mt-3">
                Eurofins 橄欖油檢驗 ↗
              </a>
            </article>
            <article className="border border-stone-200 p-6">
              <h3 className="font-serif text-xl font-semibold text-olive-950 mb-3">SGS</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-sans">
                SGS Española de Control（塞維亞）列於 IOC 化學名單；SGS Institut Fresenius（德國漢堡）提供酸／過氧化值、PPP、甘油二酯、紫外線光譜、甘油三酯譜、固醇、FAEE、多酚（健康聲稱驗證）與污染物檢驗，採 IOC 方法；漢堡感官小組為 IOC 認可、ISO 17025 認證。
              </p>
              <a href="https://sgs-institut-fresenius.de/en/health-nutrition/food-industry/your-products/olive-oil" target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-olive-600 hover:text-olive-800 underline underline-offset-4 mt-3">
                SGS Institut Fresenius 橄欖油 ↗
              </a>
            </article>
          </div>
          <p className="text-sm text-stone-500 leading-relaxed font-sans mt-6">
            本站實務：向任何實驗室索取報告時，要求（a）報告日期所屬期間的現行 IOC 名單登載與檢驗類型，（b）ISO 17025 認可範圍涵蓋該特定方法。去年的名單不夠。
          </p>
          <p className="text-sm text-stone-500 leading-relaxed font-sans mt-3 border-l-2 border-olive-300 pl-4">
            時效註記：現行名單（Rev. 28）效期至 2026-11-30。下一年度名單由 IOC 於 11 月會議後發布；新名單一發布，本頁即同步更新。在新名單發布前引用本頁名單時，請留意上述效期。
          </p>
        </div>
      </section>

      {/* 5. EFSA claim */}
      <section id="efsa-claim" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <SectionHead
          eyebrow="EFSA Health Claim"
          title="EFSA 唯一核准的多酚健康聲稱"
          intro="EFSA 意見（2011，EFSA Journal 2011;9(4):2033）認定橄欖多酚（以羥基酪醇及其衍生物標準化）與「保護低密度脂蛋白免於氧化損傷」之間存在因果關係。以下是歐盟唯一核准的多酚聲稱措辭與使用條件。"
        />
        <div className="bg-white border border-stone-200 p-6 md:p-8 mb-6">
          <p className="text-[11px] font-sans font-semibold text-olive-600 tracking-[0.25em] uppercase mb-3">
            核准措辭 · Commission Regulation (EU) No 432/2012
          </p>
          <p className="font-serif text-xl md:text-2xl text-olive-950 leading-relaxed mb-3">
            “Olive oil polyphenols contribute to the protection of blood lipids from oxidative stress.”
          </p>
          <p className="text-base text-stone-700 leading-relaxed font-sans">
            橄欖油多酚有助於保護血脂免於氧化壓力。
          </p>
        </div>
        <div className="bg-white border border-stone-200 p-6">
          <h3 className="font-semibold text-olive-950 mb-3">使用條件（缺一不可）</h3>
          <ul className="list-none space-y-2 text-sm text-stone-600 leading-relaxed font-sans">
            <li className="flex gap-2"><span className="text-olive-400 shrink-0">·</span><span>僅適用於每 20 g 含至少 <strong className="text-stone-800">5 mg 羥基酪醇及其衍生物</strong>（即至少 <strong className="text-stone-800">250 mg/kg</strong>）的橄欖油。許多市售特級初榨低於 250 mg/kg。</span></li>
            <li className="flex gap-2"><span className="text-olive-400 shrink-0">·</span><span>標籤須註明每日攝取 20 g 方可獲得此效益。</span></li>
            <li className="flex gap-2"><span className="text-olive-400 shrink-0">·</span><span>多酚數字須以 HPLC（COI/T.20/Doc. 29）測定並註明 CoA 日期；Folin／NMR 總量不可主張此聲稱。</span></li>
          </ul>
          <h3 className="font-semibold text-olive-950 mt-6 mb-3">EFSA 已拒絕的聲稱</h3>
          <p className="text-sm text-stone-600 leading-relaxed font-sans">
            維持正常 HDL 膽固醇、維持正常血壓、「抗發炎特性」、上呼吸道健康、腸胃功能、身體防禦——證據不足，皆不得使用。
            另有兩項非多酚專屬的核准聲稱：以不飽和脂肪取代飽和脂肪有助維持正常血膽固醇；維生素 E 有助保護細胞免於氧化壓力。
          </p>
          <a href="https://doi.org/10.2903/j.efsa.2011.2033" target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-olive-600 hover:text-olive-800 underline underline-offset-4 mt-4">
            EFSA 意見 2011 · doi:10.2903/j.efsa.2011.2033 ↗
          </a>
        </div>
      </section>

      {/* 6. Evidence grades */}
      <section id="grades" className="bg-white border-y border-stone-200 px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            eyebrow="Evidence Grades"
            title="證據分級：本站統一採用"
            intro="隨機對照試驗、世代研究、機制研究與法規聲稱分開標示，不混為一談。讀到本站文章時，證據等級告訴你這句話能信到什麼程度。"
          />
          <DataTable
            headers={['等級', '類型', '代表', '可寫的說法']}
            rows={GRADES.map((g) => [g.grade, g.type, g.example, g.canSay])}
          />
          <div className="mt-6 space-y-2">
            {GRADES.filter((g) => g.articles && g.articles.length > 0).map((g) => (
              <p key={g.grade} className="text-sm text-stone-500 leading-relaxed font-sans">
                <span className="font-semibold text-olive-700">{g.grade} 級代表文章：</span>
                {g.articles!.map((a, i) => (
                  <span key={a.slug}>
                    {i > 0 && '、'}
                    <Link href={`/blog/${a.slug}`} className="text-olive-600 hover:text-olive-800 underline underline-offset-4">
                      {a.title}
                    </Link>
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Studies */}
      <section id="studies" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <SectionHead
          eyebrow="Landmark Studies"
          title="標誌性研究"
          intro="每一項研究都附設計、樣本數、追蹤期、關鍵結果、限制與證據等級，並連結原始文獻。限制與結果同等重要——不寫限制的引用，不是嚴謹的引用。"
        />
        <div className="space-y-4">
          {STUDIES.map((s) => (
            <article key={s.name} id={`study-${s.grade}`} className="bg-white border border-stone-200 p-6">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="text-[11px] font-sans font-semibold text-white bg-olive-700 px-2 py-0.5 rounded">證據等級 {s.grade}</span>
                <h3 className="font-serif text-xl font-semibold text-olive-950">{s.name}</h3>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-sans mb-2"><strong className="text-stone-800">設計：</strong>{s.design}</p>
              <p className="text-sm text-stone-600 leading-relaxed font-sans mb-2"><strong className="text-stone-800">結果：</strong>{s.result}</p>
              <p className="text-sm text-stone-600 leading-relaxed font-sans mb-3"><strong className="text-stone-800">限制：</strong>{s.limit}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {s.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-olive-600 hover:text-olive-800 underline underline-offset-4">
                    {l.label} ↗
                  </a>
                ))}
              </div>
              {s.articles && s.articles.length > 0 && (
                <p className="text-sm text-stone-500 leading-relaxed font-sans mt-3">
                  本站代表文章：
                  {s.articles.map((a, i) => (
                    <span key={a.slug}>
                      {i > 0 && '、'}
                      <Link href={`/blog/${a.slug}`} className="text-olive-600 hover:text-olive-800 underline underline-offset-4">
                        {a.title}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </article>
          ))}
        </div>
        <p className="text-sm text-stone-500 leading-relaxed font-sans mt-6">
          台灣法規提醒：一般食品不得宣稱醫療效能（如降血脂、降血糖、預防／治療疾病），違者依《食品安全衛生管理法》處 NT$60 萬–500 萬；
          不實／誇張／易生誤解處 NT$4 萬–400 萬。本站介紹健康研究時一律用「研究顯示／可能有助於」等附出處的表述，並附免責聲明。
        </p>
      </section>

      {/* 8. TFDA */}
      <section id="tfda" className="bg-white border-y border-stone-200 px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            eyebrow="Taiwan TFDA — Draft"
            title="台灣 TFDA 橄欖油品名新制（草案）"
            intro="衛福部食藥署 2026-06-12 預告《食用橄欖油及橄欖粕油品名及標示規定》草案，60 天意見期至 2026-08-11，共收到 29 則意見，預計二次預告。以下內容仍為草案，最終以正式公告為準；預計施行日期 2027-07-01。"
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
            <p className="text-sm text-amber-800 leading-relaxed font-sans">
              草案狀態提醒：本節內容為尚未生效的草案。正式公告後，本站將再確認最終文本並更新選油相關寫法。
            </p>
          </div>
          <DataTable
            headers={['法定品名', '游離酸度', 'Delta K', '製程']}
            rows={TFDA_ROWS.map((r) => [r.name, r.acid, r.deltaK, r.process])}
          />
          <p className="text-sm text-stone-600 leading-relaxed font-sans">
            橄欖粕油不得標示為「橄欖油」，品名字體大小須一致；僅 <em>Olea europaea</em> 果實製成的油可用這些品名。
            背景為 2015 年大統長基葉綠素案與 2026 年摻假案（芥花油混入橄欖油；「日本一番頂級橄欖油」實為粕油）。
          </p>
          <p className="text-sm text-stone-600 leading-relaxed font-sans mt-3">
            罰則（《食品安全衛生管理法》）：未依規定標示品名 NT$3 萬–300 萬；標示不實 NT$4 萬–400 萬＋限期回收改正；故意摻偽假冒最重 7 年徒刑＋罰金最高 NT$8,000 萬。
          </p>
          <a href="https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032107/ch08/type3/gov70/num34/images/Eg01.pdf" target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-olive-600 hover:text-olive-800 underline underline-offset-4 mt-4">
            TFDA 草案公報（PDF）↗
          </a>
        </div>
      </section>

      {/* 9. Quality marks */}
      <section id="quality-marks" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <SectionHead
          eyebrow="Quality Benchmarks"
          title="品質基準：競賽與指南不是認證"
          intro="NYIOOC 與 Flos Olei 是品質基準，不是認證。兩者皆不授予法定等級、不授權使用「特級初榨」稱號、非持續認證——在標籤或網站上不可將其表述為認證；引用時一律註明名稱＋年份＋確切產品。"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <article className="bg-white border border-stone-200 p-6">
            <h3 className="font-serif text-xl font-semibold text-olive-950 mb-3">NYIOOC 紐約國際橄欖油競賽</h3>
            <p className="text-sm text-stone-600 leading-relaxed font-sans">
              全球最大橄欖油競賽，國際小組盲測；金獎與銀獎授予每一件達標的參賽油——無固定名額，金獎是品質基準，不是第一名。僅適用於特定收穫／屆次的特定油品。
            </p>
          </article>
          <article className="bg-white border border-stone-200 p-6">
            <h3 className="font-serif text-xl font-semibold text-olive-950 mb-3">Flos Olei 年度指南</h3>
            <p className="text-sm text-stone-600 leading-relaxed font-sans">
              義大利年度指南（2008 年起），不是競賽／認證；編輯小組從 1,500+ 樣品中選出全球約 500 支頂級特級初榨，滿分 100 分評分（如 98/100、名人堂 100/100），亦評估農場／生產者。
            </p>
          </article>
        </div>
      </section>

      {/* 10. Selection criteria */}
      <section id="selection-criteria" className="bg-white border-y border-stone-200 px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            eyebrow="Selection Criteria"
            title="選油標準：每一條都追溯到標準"
            intro="未來本站推薦的每一支油，都要通過以下標準。標準的每一條都追溯到本頁的 IOC／Codex／EFSA 來源，而不是「我們覺得好」。完整選品標準、評選流程與公正原則，見「選品標準」頁：https://olive-wisdom.com/selection"
          />
          <DataTable
            headers={['選油標準', '追溯來源', '門檻']}
            rows={SELECTION_CRITERIA.map((c) => [c.criterion, c.source, c.threshold])}
          />
        </div>
      </section>

      {/* 11. FAQ */}
      <section id="faq" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <SectionHead eyebrow="FAQ" title="常見問題" />
        <div className="space-y-3">
          {EVIDENCE_FAQ.map((item, i) => (
            <details key={i} className="group border border-olive-200 rounded-xl overflow-hidden bg-white">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer bg-olive-50 hover:bg-olive-100 transition-colors list-none">
                <span className="font-semibold text-olive-800 text-sm leading-relaxed pr-4">{item.q}</span>
                <span className="text-olive-500 shrink-0 text-lg group-open:rotate-180 transition-transform duration-200">▾</span>
              </summary>
              <div className="px-5 py-4 text-gray-600 text-sm leading-relaxed bg-white">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* 12. Update log + disclaimer */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border-t border-stone-200 pt-8">
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">更新紀錄</h2>
          <ul className="text-sm text-stone-600 leading-relaxed font-sans space-y-2">
            <li><strong className="text-stone-800">2026-11-22</strong> — 證據圖書館建立：IOC 貿易標準 Rev. 22（2026-06）、Codex CXS 33（2024 修訂）、EFSA 多酚聲稱、PREDIMED／EPIC／哈佛世代／EUROLIVE／油橄欖苦素研究、TFDA 品名新制草案。</li>
            <li><strong className="text-stone-800">年度覆核</strong> — IOC 標準與認可實驗室名單每年更新（現行實驗室名單效期至 2026-11-30）；TFDA 新制待二次預告與正式公告後再確認。本頁每年至少覆核一次。</li>
          </ul>
          <p className="text-xs text-stone-500 leading-relaxed font-sans mt-6">
            免責聲明：本站內容為知識分享，非醫療建議；如有健康問題請諮詢醫師。標準與法規以官方最新公告為準；TFDA 新制目前仍為草案。
          </p>
          <p className="text-sm font-sans text-stone-500 mt-6">
            <Link href="/blog" className="text-olive-600 hover:text-olive-800 font-medium hover:underline">← 返回知識庫</Link>
            <span className="mx-3 text-stone-300">|</span>
            <Link href="/about#learning-paths" className="text-olive-600 hover:text-olive-800 font-medium hover:underline">學習路徑 →</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
