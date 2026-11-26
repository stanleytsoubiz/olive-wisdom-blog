import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '篩選框架',
  description: '知橄生活評判一瓶橄欖油的篩選框架：IOC／Codex 等級門檻、CoA 檢驗指標、多酚與 EFSA 聲稱條件、新鮮度與包裝標準。只公開標準與流程，不列任何產品。',
  alternates: { canonical: 'https://olive-wisdom.com/screening' },
};

export default function ScreeningPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl font-bold text-olive-800 mb-2">篩選框架</h1>
      <p className="text-gray-400 text-sm mb-10">最後更新：2026 年 11 月 26 日</p>

      <div className="prose-custom space-y-8 text-gray-700 leading-relaxed">
        <p>
          這一頁是知橄生活評判一瓶橄欖油時使用的完整門檻：每一項標準、數字與查驗方式都公開，
          任何人都可以拿同一把尺去量任何一瓶油。本頁只談標準與流程，不列出、也不暗示任何通過篩選的產品；
          查驗與判定的執行方式見<Link href="/methodology" className="text-olive-700 underline underline-offset-4 ml-1">實測方法論</Link>，
          選品流程與承諾見<Link href="/selection" className="text-olive-700 underline underline-offset-4 ml-1">選品標準</Link>。
        </p>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">1. 等級門檻：先確認它真的是特級初榨</h2>
          <p>第一關是身分。一瓶油要進入評判，必須先符合 IOC 與 Codex 對特級初榨（Extra Virgin）的化學門檻，包括：</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li><strong>游離酸度</strong> ≤ 0.8%（以油酸計）。</li>
            <li><strong>過氧化價</strong> ≤ 20 meq O₂/kg。</li>
            <li><strong>紫外線吸收值</strong>：K270 ≤ 0.22、K232 ≤ 2.50、ΔK ≤ 0.01。</li>
            <li><strong>感官評鑑</strong>：果香中位數 &gt; 0，且缺陷中位數 = 0（依 IOC 感官評鑑方法）。</li>
          </ul>
          <p className="mt-3">任一項不符，就不是特級初榨——後面的分數再高，也不進入下一關。</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">2. 多酚門檻：用 EFSA 的條件當地板</h2>
          <p>
            多酚是本站評判健康相關價值的核心指標。我們的地板，是歐洲食品安全局（EFSA）許可健康聲稱的條件：
            每日 20 克油中，羥基酪醇及其衍生物合計至少 5 毫克——換算下來，總多酚約需 ≥250 mg/kg 才可能達標。
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>總多酚 &lt; 250 mg/kg：不具備引用多酚健康聲稱的基礎，只作一般烹調油看待。</li>
            <li>總多酚 ≥ 250 mg/kg：達到 EFSA 聲稱條件的門檻範圍，進入風味與新鮮度的進階評判。</li>
            <li>數據必須來自與瓶身同批次的 CoA（檢驗報告），並註明檢測方法；廠商宣傳數字不算證據。</li>
          </ul>
          <p className="mt-3">
            要提醒的是：EFSA 的聲稱內容是「保護血脂免受氧化壓力」，不是治療或預防任何疾病；
            多酚高低是品質與潛在效益的指標，不是藥效保證。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">3. 新鮮度：採收日期比什麼都誠實</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li><strong>採收日期必須標示</strong>：只有「保存期限」而沒有採收或榨油日期的油，無法評估新鮮度，評判時直接扣分。</li>
            <li><strong>油齡</strong>：多酚會隨時間與保存條件衰減；評判以「現在喝到的狀態」為準，過舊的檢驗數據不代表現況。</li>
            <li><strong>開封後窗口</strong>：依本站保存建議，開封後 2–3 個月內用完，是維持風味與多酚的基本線。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">4. 包裝與標示</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li><strong>遮光容器</strong>：深色玻璃瓶或馬口鐵罐；透明瓶裝在光照下加速氧化，不符合高品質油的保存要求。</li>
            <li><strong>標示完整</strong>：產地、品種、採收期、等級標示須符合 IOC 與台灣 TFDA 的標示規範；用語含糊（例如以「認證」暗示不存在的官方背書）是警訊。</li>
            <li><strong>批次可追溯</strong>：瓶身批次能與 CoA 及產地資訊對應，才算完成查驗閉環。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">5. 判定方式</h2>
          <p>
            四個面向依序把關：等級是入場券、多酚決定健康相關價值的層級、新鮮度決定「現在」還剩多少、
            包裝與標示決定資訊是否可信。任何一關的證據缺失，都會在評判中被標明為「未驗證」，
            而不是用品牌聲量或價格補上。這套框架會隨國際標準與新證據修訂，修訂時更新本頁日期並保留紀錄。
          </p>
        </section>
      </div>
    </main>
  );
}
