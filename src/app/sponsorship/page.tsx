import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '贊助政策',
  description: '知橄生活目前不接受任何贊助。本頁說明若未來開放贊助，僅限清楚標示的欄位曝光，且永遠不觸及文章的判定與結論。',
  alternates: { canonical: 'https://olive-wisdom.com/sponsorship' },
};

export default function SponsorshipPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl font-bold text-olive-800 mb-2">贊助政策</h1>
      <p className="text-gray-400 text-sm mb-10">最後更新：2026 年 11 月 26 日</p>

      <div className="prose-custom space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">1. 目前狀態：不接受贊助</h2>
          <p>
            先說清楚現況：<strong>知橄生活目前不接受任何形式的贊助</strong>，本站沒有贊助商，
            沒有任何品牌以金錢或實物支持本站的內容製作。這一頁的其餘內容，
            是預先寫明的界線——若未來本站開放贊助，只會在這些界線之內進行，
            讀者今天就能先看清楚我們不會退讓的位置。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">2. 若未來開放：只賣欄位，不賣結論</h2>
          <p>未來若開放贊助，形式僅限於以下這一類「欄位曝光」，且每一處都必須清楚標示：</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>標示「贊助」字樣與贊助者名稱的固定欄位（例如 Podcast 節目的贊助播出欄位、頁面上的贊助標示區）。</li>
            <li>贊助欄位的內容由贊助者提供並負其責，與本站的編輯內容在版面上明確區隔。</li>
            <li>贊助不包含任何文章的撰寫、評比、排名或推薦——這些永遠不在贊助範圍內。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">3. 紅線：贊助買不到的東西</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li><strong>買不到結論</strong>：贊助不影響任何文章的判定、評比結果與選題方向。</li>
            <li><strong>買不到審稿權</strong>：贊助者無權預覽、審核或要求修改本站內容，也不得要求移除對其不利的內容。</li>
            <li><strong>買不到沉默</strong>：若贊助者的產品在證據上出現問題，本站照常報導，不因贊助關係延遲或淡化。</li>
            <li><strong>判定類內容永不接受贊助</strong>：涉及產品判定、評比與篩選結論的內容，不接受任何贊助支持。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">4. 與其他政策的關係</h2>
          <p>
            本政策與<Link href="/disclosure" className="text-olive-700 underline underline-offset-4 ml-1">揭露政策</Link>一體適用：
            判定不賣是本站的總原則，贊助只是其中一種商業關係的具體界線。
            若本站的贊助狀態有任何改變，我們會先更新本頁並標明日期，再開始執行。
          </p>
        </section>
      </div>
    </main>
  );
}
