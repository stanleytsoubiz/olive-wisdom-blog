'use client';

import { useEffect, useState } from 'react';

interface TocItem { id: string; text: string; level: number; }

function extractToc(htmlContent: string): TocItem[] {
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  const items: TocItem[] = [];
  let m;
  while ((m = regex.exec(htmlContent)) !== null) {
    const text = m[3].replace(/<[^>]+>/g, '').trim();
    if (text) items.push({ id: m[2], text, level: parseInt(m[1]) });
  }
  return items;
}

export default function TableOfContents({ htmlContent }: { htmlContent: string }) {
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toc = extractToc(htmlContent);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);

      const headings = document.querySelectorAll('h2[id], h3[id]');
      let current = '';
      headings.forEach((h) => {
        const rect = h.getBoundingClientRect();
        if (rect.top <= 120) current = h.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (toc.length < 3) return null;

  const handleTocClick = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* ── Reading Progress Bar (all screens) ─────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-olive-100/50">
        <div
          className="h-full bg-gradient-to-r from-olive-600 to-gold-400 transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Desktop TOC — sidebar (lg+) ────────────────────────── */}
      <nav
        aria-label="文章目錄"
        className="hidden lg:block fixed top-24 right-6 xl:right-8 w-52 xl:w-56
                   bg-white/92 backdrop-blur-md border border-olive-100
                   rounded-2xl p-5 shadow-sm
                   max-h-[calc(100vh-120px)] overflow-y-auto
                   scrollbar-thin scrollbar-thumb-olive-200"
      >
        <p className="text-[10px] text-olive-500 font-sans font-semibold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
          <span className="w-4 h-px bg-olive-300 inline-block" />
          文章目錄
        </p>
        <ul className="space-y-1">
          {toc.map((item) => (
            <li key={item.id} style={{ paddingLeft: item.level === 3 ? '10px' : '0' }}>
              <button
                onClick={() => handleTocClick(item.id)}
                className={`w-full text-left text-[11px] leading-snug py-1 px-2 rounded-lg transition-all duration-150 cursor-pointer
                  ${active === item.id
                    ? 'text-olive-700 font-semibold bg-olive-50'
                    : 'text-gray-400 hover:text-olive-600 hover:bg-olive-50/50'
                  }`}
              >
                {item.level === 3 && <span className="text-olive-300 mr-1 text-[9px]">└</span>}
                {item.text.slice(0, 34)}{item.text.length > 34 ? '…' : ''}
              </button>
            </li>
          ))}
        </ul>
        {/* Mini progress indicator */}
        <div className="mt-4 pt-3 border-t border-olive-100">
          <div className="flex items-center justify-between text-[10px] text-olive-400 mb-1">
            <span>閱讀進度</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-olive-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-olive-500 to-gold-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </nav>

      {/* ── Mobile TOC — floating button + slide-up drawer ──────── */}
      <div className="lg:hidden">
        {/* Floating TOC button — appears after scrolling 5% */}
        {progress > 5 && (
          <button
            onClick={() => setMobileOpen(true)}
            className="fixed bottom-20 right-4 z-40
                       bg-olive-700 text-white rounded-full
                       w-12 h-12 flex items-center justify-center
                       shadow-lg shadow-olive-900/20
                       transition-all duration-200 hover:bg-olive-800 active:scale-95"
            aria-label="開啟文章目錄"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h10M4 18h7" />
            </svg>
          </button>
        )}

        {/* Slide-up drawer */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl
                            p-6 pb-10 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-olive-800">文章目錄</p>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="關閉目錄"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Progress in drawer */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>閱讀進度</span><span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-olive-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-olive-500 to-gold-400 transition-all"
                    style={{ width: `${progress}%` }} />
                </div>
              </div>
              <ul className="space-y-1">
                {toc.map((item) => (
                  <li key={item.id} style={{ paddingLeft: item.level === 3 ? '12px' : '0' }}>
                    <button
                      onClick={() => handleTocClick(item.id)}
                      className={`w-full text-left text-sm py-2.5 px-3 rounded-xl transition-colors
                        ${active === item.id
                          ? 'bg-olive-50 text-olive-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {item.level === 3 && <span className="text-olive-300 mr-2">└</span>}
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
}
