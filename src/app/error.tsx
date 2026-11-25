'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for client-side diagnostics (no external
    // monitoring is wired up yet; keep this hook as the single place
    // to forward errors if one is added).
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-olive-50 px-6">
      <div className="max-w-lg text-center">
        <div className="mb-6 flex justify-center select-none" aria-hidden="true">
          <svg width="88" height="88" viewBox="0 0 28 28" fill="none">
            <ellipse cx="14" cy="14" rx="5" ry="8" fill="#4a5824" transform="rotate(-20 14 14)" />
            <path d="M14 6 Q18 10 16 16 Q14 20 12 18" stroke="#7a8f3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M14 8 Q9 6 8 12" stroke="#4a5824" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>

        <p className="text-gold-600 text-sm font-medium tracking-[0.3em] uppercase mb-3">
          發生錯誤
        </p>

        <h1 className="font-serif text-6xl font-bold text-olive-800 mb-4">500</h1>

        <p className="text-xl text-gray-600 mb-3 font-serif">
          橄欖園裡起了點小風波…
        </p>
        <p className="text-gray-500 mb-10 leading-relaxed">
          頁面載入時發生未預期的錯誤，請再試一次。<br />
          若問題持續，歡迎透過聯絡頁面告訴我們。
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-olive-600 hover:bg-olive-700 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-md"
          >
            重新嘗試
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white hover:bg-olive-50 text-olive-700 font-medium px-8 py-3 rounded-xl border border-olive-200 transition-all"
          >
            回到首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
