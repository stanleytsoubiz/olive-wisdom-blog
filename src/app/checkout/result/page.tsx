import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '訂單結果',
  description: '知橄生活訂單付款結果。',
  robots: { index: false, follow: false },
};

// ECPay OrderResultURL landing page. The authoritative payment state comes
// from the server-to-server webhook (/api/webhooks/ecpay), not from this
// page — the browser return only tells the buyer "we are confirming".
export default function CheckoutResultPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-6">謝謝你的訂購</h1>
      <p className="text-base text-stone-600 leading-relaxed font-sans mb-4">
        付款結果正在與金流商確認中。確認完成後，訂單狀態與出貨資訊會寄到你結帳時填寫的電子郵件。
        若 30 分鐘內未收到通知，請透過聯絡頁與我們聯繫，並附上訂單編號。
      </p>
      <p className="text-sm font-sans">
        <Link href="/selection" className="text-olive-700 underline underline-offset-4">
          查看選品標準
        </Link>
      </p>
    </main>
  );
}
