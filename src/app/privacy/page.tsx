import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '隱私政策｜知橄生活 Olive Wisdom',
  description: '知橄生活 Olive Wisdom 隱私政策，說明我們如何收集、使用及保護您的個人資料。',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://olive-wisdom.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-olive-800 mb-2">隱私政策</h1>
      <p className="text-gray-400 text-sm mb-10">最後更新：2026 年 4 月 10 日</p>

      <div className="prose-custom space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">1. 資料收集</h2>
          <p>知橄生活（Olive Wisdom，以下簡稱「本站」）僅在您主動提供時收集以下個人資料：</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>電子郵件地址（訂閱電子報時）</li>
            <li>姓名及聯絡資訊（透過聯絡表單時）</li>
            <li>網站使用數據（透過 Google Analytics，匿名化處理）</li>
            <li>Cloudflare 自動收集的技術性日誌（IP 位址、瀏覽器類型，用於安全防護）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">2. 資料使用目的</h2>
          <p>我們收集的資料僅用於：</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>發送您訂閱的知橄週報</li>
            <li>回覆您的聯絡訊息</li>
            <li>改善網站內容與使用者體驗</li>
            <li>防範惡意行為及網路攻擊</li>
          </ul>
          <p className="mt-3">本站不會將您的個人資料出售、租用或以任何商業目的轉讓給第三方。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">3. 資料儲存與安全</h2>
          <p>訂閱資料儲存於 Supabase（PostgreSQL 資料庫，位於歐洲地區伺服器），並採用 SSL/TLS 加密傳輸。我們依據 GDPR 及台灣個人資料保護法相關規定處理您的資料。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">4. Cookie 使用</h2>
          <p>本站使用以下 Cookie：</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li><strong>必要性 Cookie</strong>：確保網站正常運作</li>
            <li><strong>分析性 Cookie</strong>（Google Analytics）：匿名統計訪客行為，您可透過瀏覽器設定拒絕</li>
            <li><strong>Cloudflare Cookie</strong>：安全性與效能最佳化</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">5. 您的權利</h2>
          <p>您可隨時：</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>透過電子報底部連結取消訂閱</li>
            <li>要求查閱、更正或刪除您的個人資料</li>
            <li>反對特定資料處理行為</li>
          </ul>
          <p className="mt-3">如有相關需求，請透過<Link href="/#contact" className="text-olive-600 underline">聯絡表單</Link>與我們聯繫。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">6. 第三方服務</h2>
          <p>本站整合以下第三方服務，其各自有獨立的隱私政策：</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>Google Analytics（流量分析）</li>
            <li>Cloudflare（CDN 與安全防護）</li>
            <li>Supabase（資料庫服務）</li>
            <li>Unsplash（圖片授權）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-olive-700 mb-3">7. 聯絡我們</h2>
          <p>
            如對本隱私政策有任何疑問，請透過網站<Link href="/#contact" className="text-olive-600 underline">聯絡表單</Link>與我們聯繫。
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100">
        <Link href="/" className="text-olive-600 hover:text-olive-800 text-sm">← 返回首頁</Link>
      </div>
    </main>
  );
}
