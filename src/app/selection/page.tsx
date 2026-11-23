import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '選品標準',
  description:
    '知橄生活 Olive Wisdom 的選品標準與評選流程：本站未來販售的每一支橄欖油，都要先通過公開標準與同批次 CoA 查驗——游離酸度、過氧化值、K232/K270、ΔK、總多酚逐項核對，通過才上架，不合格就下架。不收上架費，合作關係公開揭露。首批產品調研與篩選進行中。',
  alternates: { canonical: 'https://olive-wisdom.com/selection' },
  openGraph: {
    title: '選品標準｜知橄生活 Olive Wisdom',
    description:
      '先過查驗，才談上架：選品標準、CoA 逐批查驗規則、評選流程與公正原則，全部公開。',
    url: 'https://olive-wisdom.com/selection',
    type: 'website',
    siteName: '知橄生活 Olive Wisdom',
    locale: 'zh_TW',
  },
};

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

// 與 /evidence 的 SELECTION_CRITERIA 對齊；門檻出處以證據圖書館為準。
const STANDARDS = [
  { item: '法定品名', source: 'TFDA 新制（預計 2027-07-01 施行）＋ IOC／Codex', threshold: '品名須為 6 類法定品名之一；橄欖粕油不得稱為「橄欖油」' },
  { item: '游離酸度（CoA）', source: 'IOC Rev. 22、Codex CXS 33、EU 2568/91', threshold: '特級初榨 ≤0.8%（本站優選 <0.5%）' },
  { item: '過氧化值（CoA）', source: 'IOC 貿易標準／EU 法規', threshold: '≤20 meq O₂/kg' },
  { item: 'K232／K270／ΔK（CoA）', source: 'IOC 貿易標準／EU 法規', threshold: '≤2.50／≤0.22／≤0.01' },
  { item: '總多酚（CoA，HPLC 法）', source: 'EFSA 2011 意見＋ IOC COI/T.20/Doc. 29', threshold: '產品頁刊出的每個數字，須有同批次報告支持；引用 EFSA 健康聲稱門檻時 ≥250 mg/kg' },
  { item: '感官評鑑', source: 'IOC COI/T.20/Doc. 15', threshold: '缺陷中位數 0、果香中位數 >0' },
  { item: '新鮮度', source: '本站實務標準', threshold: '採收日期距上架不超過 12 個月；瓶身標示採收年份與批次' },
  { item: '溯源與文件', source: '本站實務標準＋食安法', threshold: '產地、品種可追溯；進口商完成食品業者登錄並投保產品責任險；能提供同批次 CoA 原件' },
  { item: '獎項與評鑑', source: 'NYIOOC／Flos Olei', threshold: '僅作參考資訊，須註明名稱＋年份＋確切產品；不表述為「認證」' },
];

const PROCESS = [
  {
    step: '步驟 1',
    title: '調研與送樣',
    body: '依公開標準做市場調研（不限台灣市場），候選產品須提供樣品與完整文件：同批次檢驗報告、採收與裝瓶資訊、產地與品種來源。文件不齊的候選，不進入下一階段。',
  },
  {
    step: '步驟 2',
    title: '同批次 CoA 查驗',
    body: '逐項核對「你會買到的那一批」的檢驗報告（CoA）——不是品牌宣傳用的通用數字，也不是上一批的報告。查驗六個數字：游離酸度、過氧化值、K232、K270、ΔK、總多酚。',
  },
  {
    step: '步驟 3',
    title: '標準比對與判定',
    body: '對照本站選品標準逐項判定，通過與不通過都留下紀錄。標準是先公布的，不因品牌大小或合作條件放寬——這是本站與一般賣場最不一樣的地方。',
  },
  {
    step: '步驟 4',
    title: '上架與揭露',
    body: '全數通過的產品才上架販售。產品頁會寫明：該批次的查驗數字、採收日期、合作進口商與出貨方式（本站不囤貨，由合作進口商出貨），以及本站與進口商的合作關係。',
  },
  {
    step: '步驟 5',
    title: '逐批複核與下架',
    body: '上架不是永久資格。每一批新貨都要重新查驗；新批次未附 CoA、任一數值超標、或標示與法規不符——先下架，複驗通過才恢復販售。',
  },
];

const PRINCIPLES = [
  {
    title: '不收上架費、不收業配費',
    body: '付費買不到上架資格，也買不到評選結果。本站的收入只來自產品通過標準後、實際銷售的分潤，並會在產品頁揭露。',
  },
  {
    title: '評選與商務分開',
    body: '先通過標準，才談合作條件；合作條件（分潤、出貨、退換貨）不影響評選判定。談不攏合作，產品就不上架，但評選紀錄不會因此改寫。',
  },
  {
    title: '每個數字都要有出處',
    body: '產品頁上出現的酸度、多酚等數字，必須能追溯到該批次的檢驗報告；標準本身的出處（IOC、Codex、EFSA）全部公開在證據圖書館，任何人都可以核對。',
  },
  {
    title: '不合格就下架，包括賣得好的',
    body: '複核未通過就下架，不因銷售量延後處理。下架原因會在本頁的更新紀錄中說明。',
  },
];

const FAQ = [
  {
    q: '為什麼不先公布「評選中」的產品名單？',
    a: '因為在篩選完成前公開點名，等於還沒查驗就先替產品背書。我們的順序是：查驗全數通過，才公布名單。公布前，本站不販售、不預購、不接受任何訂單。',
  },
  {
    q: '什麼是「同批次 CoA」？為什麼這麼重要？',
    a: 'CoA 是每一批產品的檢驗報告（Certificate of Analysis）。同一支油、不同批次，酸度與多酚都可能不同；用品牌通用數字或舊批次報告來賣新批次的油，是業界常見的模糊地帶。本站只認你買到的那一批的報告。',
  },
  {
    q: '本站會自己進貨、囤貨出貨嗎？',
    a: '不會。通過查驗的產品由合作進口商出貨，本站負責評選、查驗與內容說明。出貨、退換貨由進口商負責，細節會在產品上架時逐項寫明。',
  },
  {
    q: '品牌或進口商可以送產品來評選嗎？',
    a: '可以，請透過聯絡頁提供產品文件。送樣不保證上架、不收評選費；判定只看文件與數字是否通過本站標準。',
  },
];

export default function SelectionPage() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 md:pt-20">
        <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.3em] uppercase mb-3">Selection Standards</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-stone-900 leading-tight mb-6">
          選品標準：先過查驗，才談上架
        </h1>
        <p className="text-base md:text-lg text-stone-600 leading-relaxed font-sans max-w-3xl">
          知橄生活未來販售的每一支橄欖油，都要先通過這一頁公布的標準與查驗流程。
          標準過不了，再有名的品牌也不上架；已經上架的，複核沒過就下架。
          目前，首批產品的調研與篩選正在進行中——通過全數查驗後，才會公布名單並開賣。
          在那之前，本站不販售任何橄欖油。
        </p>
      </section>

      {/* 1. Standards */}
      <section id="standards" className="bg-white border-y border-stone-200 px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            eyebrow="The Standards"
            title="選品標準：每一條都追溯到國際標準"
            intro="以下門檻與證據圖書館的選油標準完全一致，出處是國際橄欖理事會（IOC）、Codex 國際食品標準、歐盟法規與 EFSA，不是本站自創的數字。"
          />
          <DataTable
            headers={['查驗項目', '追溯來源', '門檻']}
            rows={STANDARDS.map((s) => [s.item, s.source, s.threshold])}
          />
          <p className="text-sm text-stone-500 leading-relaxed font-sans">
            標準的完整出處與判讀方式，見
            <Link href="/evidence#selection-criteria" className="text-olive-700 underline underline-offset-4 mx-1">證據圖書館・選油標準</Link>
            ；CoA（檢驗報告）怎麼讀，見
            <Link href="/blog/coa-complete-reading-guide-olive-oil" className="text-olive-700 underline underline-offset-4 mx-1">CoA 完整判讀指南</Link>
            。
          </p>
        </div>
      </section>

      {/* 2. Process */}
      <section id="process" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <SectionHead
          eyebrow="The Process"
          title="評選流程：五個步驟，缺一不可"
          intro="從調研到下架，每一步都有紀錄。這個流程同時適用於台灣市場與全球市場的候選產品。"
        />
        <div className="space-y-6">
          {PROCESS.map((p) => (
            <article key={p.step} className="bg-white border border-stone-200 p-6 md:p-8">
              <p className="text-[10px] font-sans font-semibold text-stone-500 tracking-[0.25em] uppercase mb-2">{p.step}</p>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-olive-950 mb-3">{p.title}</h3>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed font-sans">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Principles */}
      <section id="principles" className="bg-white border-y border-stone-200 px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            eyebrow="Fairness Principles"
            title="公正原則：評選不賣，揭露不藏"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            {PRINCIPLES.map((p) => (
              <article key={p.title} className="border border-stone-200 p-6">
                <h3 className="font-serif text-xl font-semibold text-olive-950 mb-3">{p.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed font-sans">{p.body}</p>
              </article>
            ))}
          </div>
          <p className="text-sm text-stone-500 leading-relaxed font-sans mt-6">
            本站的編輯獨立性聲明（不接業配、利益衝突主動揭露）見
            <Link href="/about#editorial-standards" className="text-olive-700 underline underline-offset-4 mx-1">關於知橄・編輯標準</Link>
            ，選品同受該標準約束。
          </p>
        </div>
      </section>

      {/* 4. Status */}
      <section id="status" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <SectionHead eyebrow="Current Status" title="目前進度" />
        <div className="border border-olive-200 bg-olive-50 p-6 md:p-8">
          <p className="text-sm md:text-base text-stone-700 leading-relaxed font-sans">
            首批產品的調研與篩選進行中（台灣市場與全球市場同步）。篩選完成、且通過全數查驗的產品名單，
            會在確認後於本頁公布並開放購買；公布前，本站不販售、不預購、不接受訂單，
            也不會以「評選中」名義公開任何候選產品——未查驗，不背書。
          </p>
          <p className="text-sm md:text-base text-stone-700 leading-relaxed font-sans mt-4">
            名單公布時，我們會同步公開每支產品的查驗數字與合作關係。
            想收到公布通知，請
            <Link href="/#subscribe" className="text-olive-700 underline underline-offset-4 mx-1">加入讀者名單</Link>
            。
          </p>
        </div>
      </section>

      {/* 5. FAQ */}
      <section id="faq" className="max-w-5xl mx-auto px-6 pb-16">
        <SectionHead eyebrow="FAQ" title="常見問題" />
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <details key={i} className="group border border-olive-200 rounded-xl overflow-hidden bg-white">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer bg-olive-50 hover:bg-olive-100 transition-colors list-none">
                <span className="font-semibold text-olive-800 text-sm leading-relaxed pr-4">{item.q}</span>
                <span className="text-olive-500 shrink-0 text-lg group-open:rotate-180 transition-transform duration-200">▾</span>
              </summary>
              <div className="px-5 py-4 text-gray-600 text-sm leading-relaxed bg-white">{item.a}</div>
            </details>
          ))}
        </div>
        <p className="text-sm font-sans text-stone-500 mt-10">
          <Link href="/evidence" className="text-olive-600 hover:text-olive-800 font-medium hover:underline">← 證據圖書館</Link>
          <span className="mx-3 text-stone-300">|</span>
          <Link href="/about" className="text-olive-600 hover:text-olive-800 font-medium hover:underline">關於知橄 →</Link>
        </p>
      </section>
    </main>
  );
}
