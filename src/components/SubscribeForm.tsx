'use client';

import { useState } from 'react';
import { trackSubscribe } from '@/components/GoogleAnalytics';
import { isHoneypotFilled, checkThrottle } from '@/lib/form-guard';

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
  // Honeypot — see src/lib/form-guard.ts. Humans never see or fill this.
  const [website, setWebsite] = useState('');

  const emailError = touched && !isValidEmail(email)
    ? '請輸入有效的電子信箱' : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail(email)) return;
    // Honeypot filled → bot. Fake success, write nothing.
    if (isHoneypotFilled(website)) {
      setStatus('success');
      setMessage('🎉 已加入讀者名單，謝謝你 🫒');
      setEmail('');
      return;
    }
    if (!checkThrottle('subscribe')) {
      setStatus('error');
      setMessage('送出太頻繁，請稍後再試。');
      return;
    }
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
        setMessage('🎉 已加入讀者名單，謝謝你 🫒');
        setEmail('');
        trackSubscribe('footer_form');
      } else if (res.status === 409) {
        setStatus('success');
        setMessage('這個信箱已經在讀者名單裡了，謝謝你的支持 🫒');
      } else {
        setStatus('error');
        setMessage('暫時無法處理，請稍後再試。');
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
        <p className="text-sm text-olive-600 mt-2">本站目前不寄送電子報。新文章會公布在網站與官方社群，歡迎常回來看看。</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        {/* Honeypot — hidden from humans (see src/lib/form-guard.ts) */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute opacity-0 pointer-events-none h-0 w-0"
        />
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setTouched(false); }}
            onBlur={() => setTouched(true)}
            required
            placeholder="你的電子信箱"
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
              加入中…
            </span>
          ) : '加入讀者名單 🫒'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-sm text-red-500 text-center mt-2">{message}</p>
      )}
      <p className="text-xs text-olive-500 text-center mt-3 font-sans">
        加入讀者名單 · 本站不寄送電子報 · 不寄廣告信
      </p>
    </div>
  );
}
