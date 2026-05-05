'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { trackSearch } from '@/components/GoogleAnalytics';

interface PagefindResult {
  id: string;
  data: () => Promise<{
    url: string;
    content: string;
    word_count: number;
    excerpt: string;
    meta: { title?: string; image?: string };
    anchors: Array<{ id: string; text: string; element: string; location: number }>;
  }>;
}

interface PagefindAPI {
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
  preload?: (query: string) => Promise<void>;
}

declare global {
  interface Window {
    pagefind: PagefindAPI;
  }
}

export default function SearchClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{
    url: string; title: string; excerpt: string; image?: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [searched, setSearched] = useState(false);
  const pagefindRef = useRef<PagefindAPI | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load Pagefind on mount via script injection (avoids compile-time resolution warning)
  useEffect(() => {
    const load = async () => {
      try {
        // pagefind.js is generated at build time into /pagefind/ — load dynamically
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const pf = await new Function('return import("/pagefind/pagefind.js")')() as PagefindAPI;
        pagefindRef.current = pf;
        setReady(true);
      } catch {
        // Pagefind not yet built (dev mode) — silently ignore
      }
    };
    load();
  }, []);

  const runSearch = async (q: string) => {
    if (!pagefindRef.current || !q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    if (q.trim().length >= 2) trackSearch(q.trim());
    try {
      const response = await pagefindRef.current.search(q);
      const data = await Promise.all(
        response.results.slice(0, 12).map(async (r) => {
          const d = await r.data();
          return {
            url: d.url,
            title: d.meta.title ?? '',
            excerpt: d.excerpt,
            image: d.meta.image,
          };
        })
      );
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (v: string) => {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(v), 300);
  };

  const SUGGESTIONS = ['多酚', '羥基酪醇', 'PREDIMED', '地中海飲食', '特級初榨', '橄欖油鑑別', '料理溫度'];

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="輸入關鍵字，例如：多酚、PREDIMED、地中海飲食…"
          autoFocus
          className="w-full border border-stone-300 rounded-2xl px-6 py-4 pr-14 text-base
                     focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-olive-500
                     bg-white shadow-sm font-sans transition"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-xl pointer-events-none">
          {loading ? (
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : '🔍'}
        </div>
      </div>

      {/* Suggestions (shown when no query) */}
      {!query && (
        <div className="mb-10">
          <p className="text-[10px] font-sans font-semibold text-stone-400 tracking-[0.25em] uppercase mb-4">
            熱門搜尋
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleChange(s)}
                className="text-sm font-sans bg-white border border-stone-200 hover:border-olive-300
                           text-stone-600 hover:text-olive-700 hover:bg-olive-50
                           px-4 py-2 rounded-full transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🫒</p>
          <p className="text-stone-500 font-sans">找不到「{query}」相關文章</p>
          <p className="text-stone-400 text-sm mt-2 font-sans">試試其他關鍵字，或瀏覽<Link href="/blog" className="text-olive-600 hover:underline mx-1">所有文章</Link></p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <p className="text-[11px] font-sans text-stone-400 tracking-widest uppercase">
            找到 {results.length} 篇文章
          </p>
          {results.map((r) => {
            // Convert /blog/slug/ → /blog/slug (remove trailing slash for Next.js Link)
            const href = r.url.replace(/\/$/, '');
            return (
              <article key={r.url} className="border-b border-stone-200 pb-6">
                <Link href={href} className="group">
                  <h2 className="text-lg font-bold text-olive-900 leading-snug mb-2
                                 group-hover:text-olive-700 transition-colors">
                    {r.title}
                  </h2>
                </Link>
                <p
                  className="text-sm text-stone-500 font-sans leading-relaxed mb-3"
                  dangerouslySetInnerHTML={{ __html: r.excerpt }}
                />
                <Link
                  href={href}
                  className="text-xs font-sans font-semibold text-olive-600 hover:text-olive-800 transition-colors"
                >
                  閱讀全文 →
                </Link>
              </article>
            );
          })}
        </div>
      )}

      {/* Dev-mode notice */}
      {!ready && (
        <div className="text-center py-12">
          <p className="text-stone-400 font-sans text-sm">
            搜尋功能需要先執行 <code className="bg-stone-100 px-2 py-0.5 rounded text-xs">npm run build</code> 建立索引
          </p>
        </div>
      )}
    </div>
  );
}
