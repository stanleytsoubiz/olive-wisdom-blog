'use client';

import { useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          message: form.message.trim(),
          submitted_at: new Date().toISOString(),
          read: false,
        }),
      });

      if (res.ok || res.status === 201 || res.status === 204) {
        setStatus('success');
        setMsg('感謝您的訊息！我們將在 2 個工作天內回覆您。');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setMsg('送出失敗，請稍後再試。');
      }
    } catch {
      setStatus('error');
      setMsg('網路錯誤，請稍後再試。');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-olive-50 border border-olive-200 text-olive-800 rounded-xl px-6 py-8 text-center">
        <span className="text-3xl">✅</span>
        <p className="font-medium mt-3 text-lg">{msg}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
        <input
          type="text" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="您的稱呼"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">電子信箱</label>
        <input
          type="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="your@email.com"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">訊息內容</label>
        <textarea
          required rows={5} value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="請輸入您想告訴我們的內容..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive-500 resize-none"
        />
      </div>
      {status === 'error' && <p className="text-sm text-red-500">{msg}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-olive-700 hover:bg-olive-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? '送出中...' : '送出訊息 →'}
      </button>
    </form>
  );
}
