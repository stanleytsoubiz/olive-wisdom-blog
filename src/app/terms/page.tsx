import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '使用條款｜知橄生活 Olive Wisdom',
  description: '知橄生活 Olive Wisdom 使用條款，使用本網站即表示您同意以下條款。',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://olive-wisdom.com/terms' },
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-olive-800 mb-2">使用條款</h1>
      <p className="text-gray-400 text-sm mb-10">最後更新：2026 年 4 月 10 日</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">1. 接受條款</h2>
          <p>歡迎使用知橄生活（Olive Wisdom）網站（以下簡稱「本站」）。使用本站即表示您同意受本使用條款約束。如不同意，請停止使用本站。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">2. 內容性質與免責聲明</h2>
          <p>本站提供之橄欖油相關資訊（包括科學研究摘要、健康建議、飲食指南）僅供教育與參考用途，不構成醫療、營養或專業健康建議。</p>
          <p className="mt-3 text-sm bg-amber-50 border border-amber-200 rounded-lg p-4">
            ⚠️ <strong>重要提醒</strong>：本站引用的學術研究僅為知識分享。如您有健康疑慮，請諮詢合格醫療專業人員。特殊疾病患者在改變飲食習慣前，務必先徵詢醫師意見。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">3. 智慧財產權</h2>
          <p>本站所有原創文字內容、圖表設計及品牌元素均受著作權法保護，歸知橄生活所有。</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>您可個人非商業目的分享文章連結</li>
            <li>未經書面授權，不得複製、改編或商業利用本站內容</li>
            <li>本站圖片來自 Unsplash，依 Unsplash 授權條款使用</li>
            <li>引用本站內容請標明出處「知橄生活 Olive Wisdom (olive-wisdom.com)」</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">4. 使用者行為規範</h2>
          <p>使用本站，您同意不得：</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>上傳或傳播惡意軟體、病毒或干擾程式</li>
            <li>企圖未授權存取本站系統或資料</li>
            <li>以自動化方式大量爬取本站內容</li>
            <li>從事任何違法或侵害他人權益之行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">5. 外部連結</h2>
          <p>本站文章中可能包含引用學術論文或外部資源之連結，僅供讀者參考。知橄生活不對外部網站之內容、準確性或可用性負責。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">6. 服務中斷與修改</h2>
          <p>知橄生活保留隨時修改、暫停或終止本站服務之權利，恕不另行通知。對於因服務中斷造成之損失，本站不承擔賠償責任。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">7. 準據法</h2>
          <p>本使用條款受中華民國法律管轄。如發生爭議，雙方同意以台灣台北地方法院為第一審管轄法院。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">8. 聯絡我們</h2>
          <p>如對本使用條款有疑問，請透過<Link href="/#contact" className="text-olive-600 underline">聯絡表單</Link>與我們聯繫。</p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 flex gap-6 text-sm">
        <Link href="/privacy" className="text-olive-600 hover:text-olive-800">隱私政策</Link>
        <Link href="/" className="text-olive-600 hover:text-olive-800">← 返回首頁</Link>
      </div>
    </main>
  );
}
