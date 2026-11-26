import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '實測方法論',
  description: '知橄生活如何研究與查核橄欖油知識：來源層級（IOC、Codex、EFSA、同儕審查文獻）、證據分級標示方式，以及 CoA 檢驗報告的判讀與查驗流程。',
  alternates: { canonical: 'https://olive-wisdom.com/methodology' },
};

export default function MethodologyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl font-bold text-olive-800 mb-2">實測方法論</h1>
      <p className="text-gray-400 text-sm mb-10">最後更新：2026 年 11 月 26 日</p>

      <div className="prose-custom space-y-8 text-gray-700 leading-relaxed">
        <p>
          這一頁說明知橄生活的每一篇文章是怎麼做出來的：資料從哪裡來、證據怎麼分級、檢驗報告（CoA）怎麼判讀與查驗。
          我們把方法公開，是因為判定要能被檢驗——讀者不需要相信我們，只需要能沿著出處自己查證。
        </p>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">1. 選題：只寫文獻夠多的主題</h2>
          <p>
            我們只寫有足夠學術文獻支撐的主題。無論某個話題在社群媒體上多麼熱門，若缺乏同儕審查研究的支持，
            我們不會將它呈現為已確立的事實；若找不到至少兩篇獨立的同儕審查研究，該主題將被暫緩或重新定位。
            編輯團隊每月固定追蹤 PubMed、Frontiers in Nutrition 及《新英格蘭醫學期刊》（NEJM）等來源的最新發表，
            不因商業利益或流行趨勢調整選題方向。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">2. 來源層級：誰說的，決定能信幾分</h2>
          <p>本站引用資料時，依以下層級決定權重，文章中的數字與聲稱必須能回溯到第一、二層：</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li><strong>第一層——國際標準與監管機構</strong>：國際橄欖理事會（IOC）標準與感官評鑑方法、食品法典委員會（Codex Alimentarius）規格、歐洲食品安全局（EFSA）健康聲稱意見、歐盟法規，以及台灣食品藥物管理署（TFDA）的標示規範。</li>
            <li><strong>第二層——同儕審查研究</strong>：發表於學術期刊、經同儕審查的原始研究。引用時標明第一作者、期刊、年份與 DOI 或公開連結。</li>
            <li><strong>第三層——產業資料與媒體報導</strong>：僅作背景脈絡使用；引用時明確標示「引自」，並同時附上可得的原始文獻連結。維基百科不作為最終資料來源。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">3. 證據分級：人體試驗和細胞實驗，不是一回事</h2>
          <p>
            同一句「研究顯示」，背後的證據強度可能天差地遠。本站文章在引用研究時，會標明證據所屬層級，並守住以下原則：
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li><strong>分級標示</strong>：依序為人體隨機對照試驗（RCT）、人體觀察性研究、動物實驗、細胞（體外）實驗。層級越往後，能推論到「人吃了有效」的程度越低。</li>
            <li><strong>劑量不偷換</strong>：細胞與動物實驗使用的劑量，經常遠高於日常飲食能攝取的量；文章若引用這類研究，會明說它只是機制線索，不是療效證明。</li>
            <li><strong>結果照實寫</strong>：主要結果未達統計顯著，就寫未達顯著（例如 MIND 飲食試驗的組間差異）。觀察性研究的相關性，不寫成因果。</li>
            <li><strong>聲稱照原文</strong>：引用 EFSA 等機構的健康聲稱時，連同適用條件一起寫明。例如橄欖油多酚的許可聲稱，條件是每日 20 克油中羥基酪醇及其衍生物合計至少 5 毫克，聲稱內容是「保護血脂免受氧化壓力」——不是腦健康，也不是任何疾病的預防。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">4. CoA 怎麼讀、怎麼驗</h2>
          <p>
            CoA（Certificate of Analysis，檢驗報告）是單一生產批次的實驗室檢測文件，是判斷一瓶油品質時最接近一手證據的資料。
            我們判讀 CoA 時，固定檢查以下欄位：
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li><strong>等級指標</strong>：游離酸度、過氧化價、紫外線吸收值（K232、K270、ΔK），對照 IOC 與 Codex 的特級初榨（Extra Virgin）門檻。</li>
            <li><strong>多酚數據</strong>：總多酚含量（mg/kg）與檢測方法；判讀時對照 EFSA 聲稱條件（約 ≥250 mg/kg）與本站的分級判讀。</li>
            <li><strong>批次對應</strong>：報告上的批次編號必須與瓶身標示一致；對不上的 CoA，對這瓶油不具證明力。</li>
            <li><strong>日期合理性</strong>：採收日期、榨油日期與檢驗日期的先後關係必須合理；多酚會隨時間衰減，過舊的報告不能代表現在的油況。</li>
            <li><strong>實驗室可查</strong>：出具報告的實驗室應可識別、可追溯；無從查證的文件，我們視為未提供。</li>
          </ul>
          <p className="mt-3">
            要強調的是：一份 CoA 只證明「那個批次、在檢驗當下」的狀態，不是品牌永久有效的品質保證。
            這也是本站在引用任何檢驗數據時，必定標明批次與日期的原因。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">5. 更新與更正</h2>
          <p>
            新證據出現、或我們發現錯誤時，文章會修訂並留下紀錄；涉及結論的更正會在文中標明。
            本站的編輯運作原則另見<Link href="/about#editorial-standards" className="text-olive-700 underline underline-offset-4 ml-1">編輯標準</Link>，
            完整的證據來源整理見<Link href="/evidence" className="text-olive-700 underline underline-offset-4 ml-1">證據圖書館</Link>。
          </p>
        </section>
      </div>
    </main>
  );
}
