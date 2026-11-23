'use client';

// Buy Now (single product, no cart — Phase 1 design).
// Collects email + qty, asks /api/checkout for signed ECPay parameters, then
// auto-posts a form to ECPay's hosted checkout page. Card data never touches
// this site. Only functional in the server (OpenNext) build with the ECPay
// sandbox; on the static site the API route does not exist and the button
// reports that checkout is not open yet.
import { useState } from 'react';

export default function BuyNowButton({ slug, price }: { slug: string; price: number }) {
  const [email, setEmail] = useState('');
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onBuy() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, qty, email }),
      });
      if (!res.ok) throw new Error('checkout-unavailable');
      const { checkoutUrl, params } = (await res.json()) as {
        checkoutUrl: string;
        params: Record<string, string>;
      };
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = checkoutUrl;
      for (const [key, value] of Object.entries(params)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch {
      setBusy(false);
      setError('結帳功能尚未開放（目前為沙箱建置階段）。本站目前未販售任何產品。');
    }
  }

  return (
    <div className="border border-stone-200 bg-white p-6">
      <label className="block text-sm font-sans text-stone-700 mb-2" htmlFor="buy-email">
        電子郵件（訂單通知用）
      </label>
      <input
        id="buy-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-stone-300 px-3 py-2 text-sm mb-4"
        placeholder="you@example.com"
      />
      <label className="block text-sm font-sans text-stone-700 mb-2" htmlFor="buy-qty">
        數量
      </label>
      <input
        id="buy-qty"
        type="number"
        min={1}
        max={99}
        value={qty}
        onChange={(e) => setQty(Number(e.target.value) || 1)}
        className="w-24 border border-stone-300 px-3 py-2 text-sm mb-4"
      />
      <p className="text-sm font-sans text-stone-600 mb-4">
        小計：NT$ {(price * qty).toLocaleString()}（測試價格）
      </p>
      <button
        type="button"
        onClick={onBuy}
        disabled={busy || !email}
        className="bg-olive-800 text-white font-sans text-sm font-semibold px-6 py-3 disabled:opacity-50"
      >
        {busy ? '前往綠界結帳…' : '立即購買（Buy Now）'}
      </button>
      {error && <p className="text-sm text-red-700 font-sans mt-3">{error}</p>}
      <p className="text-xs text-stone-500 font-sans mt-3">
        付款由綠界 ECPay 託管頁面處理，本站不經手、不儲存卡號。
      </p>
    </div>
  );
}
