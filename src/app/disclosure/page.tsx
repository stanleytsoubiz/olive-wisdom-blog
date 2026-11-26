import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '揭露政策',
  description: '知橄生活的揭露政策：本站不接受付費邀稿與業配，任何文章的判定與結論都不出售；樣品與聯盟連結若涉及文章，一律揭露。',
  alternates: { canonical: 'https://olive-wisdom.com/disclosure' },
};

export default function DisclosurePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl font-bold text-olive-800 mb-2">揭露政策</h1>
      <p className="text-gray-400 text-sm mb-10">最後更新：2026 年 11 月 26 日</p>

      <div className="prose-custom space-y-8 text-gray-700 leading-relaxed">
        <p>
          知橄生活的價值只來自一件事：判定可信。這一頁是本站對讀者的公開承諾——
          哪些錢我們不收、哪些關係若存在必定揭露——讓每一篇文章的結論，都能被放在陽光下檢查。
        </p>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">1. 總原則：判定不賣</h2>
          <p>
            本站任何文章的結論、評比與推薦，都不能被購買。沒有任何付款、贈禮、合作關係或人情，
            能改變一篇文章的判定；證據支持什麼，我們就寫什麼，證據不支持的，再大的品牌也一樣。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">2. 付費邀稿與業配</h2>
          <p>
            本站不接受付費邀稿、業配文章、付費背書或以任何形式出售的「正面報導」。
            品牌方不能付費指定題目、結論、排名或刊登時間；本站文章中出現的任何產品評價，
            都是編輯團隊依公開標準與證據獨立作成，詳見<Link href="/methodology" className="text-olive-700 underline underline-offset-4 ml-1">實測方法論</Link>。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">3. 樣品</h2>
          <p>
            若本站收到廠商提供的樣品，樣品僅供研究與查證使用，不保證被報導、更不保證結論方向；
            產品是否被寫入文章、寫成什麼結論，完全由證據決定。若文章內容涉及曾收受樣品的產品，
            我們會在該篇文章中揭露樣品來源，讀者可以據此自行判斷。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">4. 聯盟行銷連結</h2>
          <p>
            目前本站文章不含聯盟行銷（affiliate）連結。若未來引入，含連結的文章會在開頭以明確文字揭露，
            並逐篇適用：連結的存在不影響評比與結論，讀者是否透過連結購買，不改變我們對產品的判定。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">5. 廣告與利益衝突</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>本站目前不刊登展示型廣告。</li>
            <li>若撰文者對文中提及的品牌或產品存在任何形式的利益關係（持股、顧問、親屬任職等），該利益衝突會在文章中主動揭露。</li>
            <li>贊助的處理原則另見<Link href="/sponsorship" className="text-olive-700 underline underline-offset-4">贊助政策</Link>：本站目前不接受任何贊助。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-olive-700 mb-3">6. 讀者查核</h2>
          <p>
            這份政策不是口號，是可以被檢驗的承諾。若讀者發現本站任何文章疑似未揭露的商業關係，
            歡迎透過<Link href="/contact" className="text-olive-700 underline underline-offset-4 ml-1">聯絡我們</Link>提出，
            我們會查證並公開回覆；若確有疏漏，將依更正原則修訂並標明。
          </p>
        </section>
      </div>
    </main>
  );
}
