'use client';

import { useEffect, useState } from 'react';
import { trackSubscribe } from '@/components/GoogleAnalytics';

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || '';
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SESSION_KEY   = 'olive_subscribe_popup_shown';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export default function SubscribePopup() {
  const [visible,  setVisible]  = useState(false);
  const [email,    setEmail]    = useState('');
  const [touched,  setTouched]  = useState(false);
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message,  setMessage]  = useState('');

  // Scroll trigger: show once per session when scroll depth >= 60%
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total    = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= 0.6) {
        setVisible(true);
        sessionStorage.setItem(SESSION_KEY, '1');
        window.removeEventListener('scroll', onScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setVisible(false);

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
          source: 'popup',
          active: true,
        }),
      });
      if (res.ok || res.status === 201 || res.status === 204) {
        setStatus('success');
        setMessage('訂閱成功！下期週報見 🫒');
        trackSubscribe('popup');
      } else if (res.status === 409) {
        setStatus('success');
        setMessage('您已是知橄週報訂閱者 🫒');
      } else {
        setStatus('error');
        setMessage('暫時無法處理，請稍後再試。');
      }
    } catch {
      setStatus('error');
      setMessage('網路錯誤，請稍後再試。');
    }
  };

  const emailError = touched && !isValidEmail(email) ? '請輸入有效的電子信箱' : '';

  if (!visible) return null;

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div
        className="fixed inset-0 z-40"
        onClick={close}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="訂閱知橄週報"
        className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1) both' }}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl px-6 pt-5 pb-8 max-w-lg mx-auto">
          {/* Handle bar */}
          <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-4" />

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-5 text-stone-400 hover:text-stone-600 transition-colors p-1"
            aria-label="關閉"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {status === 'success' ? (
            <div className="text-center py-3">
              <p className="text-2xl mb-2">🫒</p>
              <p className="font-semibold text-olive-800">{message}</p>
              <p className="text-xs text-stone-400 font-sans mt-1">《橄欖油品飲師口袋手冊》PDF 即將寄出</p>
            </div>
          ) : (
            <>
              {/* Copy */}
              <p className="text-[0.95rem] font-semibold text-olive-900 leading-snug mb-1">
                喜歡這篇文章嗎？
              </p>
              <p className="text-sm text-stone-500 font-sans mb-4 leading-relaxed">
                每週一封橄欖油知識信，直送信箱
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setTouched(false); }}
                    onBlur={() => setTouched(true)}
                    placeholder="您的電子信箱"
                    disabled={status === 'loading'}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive-500 disabled:opacity-60 transition ${
                      emailError ? 'border-red-400' : 'border-olive-300'
                    }`}
                  />
                  {emailError && (
                    <p className="text-xs text-red-500 mt-1 pl-1">{emailError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-olive-700 hover:bg-olive-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors disabled:opacity-60"
                >
                  {status === 'loading' ? '…' : '免費訂閱'}
                </button>
              </form>

              {status === 'error' && (
                <p className="text-xs text-red-500 mt-2">{message}</p>
              )}

              <p className="text-[11px] text-stone-400 font-sans mt-3 text-center">
                贈《橄欖油品飲師口袋手冊》PDF · 隨時可取消
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
