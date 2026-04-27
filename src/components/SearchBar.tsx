'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  initialValue?: string;
  placeholder?: string;
}

export default function SearchBar({ initialValue = '', placeholder = '搜尋橄欖油知識…' }: Props) {
  const [value, setValue] = useState(initialValue);
  const router   = useRouter();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      router.push(`/blog?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/blog');
    }
  }, [value, router]);

  const handleClear = () => {
    setValue('');
    router.push('/blog');
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="relative max-w-lg mx-auto">
      {/* Search icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-olive-400 pointer-events-none">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="搜尋文章"
        className="w-full pl-10 pr-12 py-3 border border-olive-200 rounded-2xl bg-white/90 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-transparent placeholder-gray-400 transition"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          aria-label="清除搜尋"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      )}

      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-olive-600 hover:bg-olive-700 text-white p-1.5 rounded-lg transition"
        aria-label="送出搜尋"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
        </svg>
      </button>
    </form>
  );
}
