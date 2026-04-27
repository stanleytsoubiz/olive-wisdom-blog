'use client';

import { useState } from 'react';

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || '';
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export default function SubscribeForm() {
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState(false);

  const emailError = touched && !isValidEmail(email)
    ? '請輸入有效的電子信箱' : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail(email)) return;
    setStatus('loading');
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Prefer': 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          subscribed_at: new Date().toISOString(),
          source: 'website', active: true,
        }),
      });
      if (res.ok || res.status === 201 || res.status === 204) {
        setStatus('success');
        setMessage('🎉 訂閱成功！歡迎加入知橄生活家族，下期週報見 🫒');
        setEmail('');
      } else if (res.status === 409) {
        setStatus('success');
        setMessage('您已是知橄週報訂閱者 🫒 感謝您的持續支持！');
      } else {
        setStatus('error');
        setMessage('訂閱暫時無法處理，請稍後再試。');
      }
    } catch {
      setStatus('error');
      setMessage('網路錯誤，請稍後再試。');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-olive-50 border border-olive-300 text-olive-800 rounded-2xl px-6 py-5 max-w-md mx-auto text-center">
        <p className="font-semibold text-lg">{message}</p>
        <p className="text-sm text-olive-600 mt-2">📄 《橄欖油品飲師口袋手冊》PDF 即將寄出</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setTouched(false); }}
            onBlur={() => setTouched(true)}
            required
            placeholder="您的電子信箱"
            disabled={status === 'loading'}
            className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive-500 disabled:opacity-60 transition ${
              emailError ? 'border-red-400 focus:ring-red-400' : 'border-olive-300'
            }`}
          />
          {emailError && <p className="text-xs text-red-500 mt-1 pl-1">{emailError}</p>}
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-gold-400 hover:bg-gold-500 text-olive-900 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all hover:shadow-md disabled:opacity-60"
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              訂閱中…
            </span>
          ) : '免費訂閱 🫒'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-sm text-red-500 text-center mt-2">{message}</p>
      )}
      <p className="text-xs text-olive-500 text-center mt-3 font-sans">
        訂閱即贈《橄欖油品飲師口袋手冊》PDF · 隨時可取消
      </p>
    </div>
  );
}
