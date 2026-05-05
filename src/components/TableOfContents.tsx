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

      {/* ── Desktop TOC sidebar removed — Kinfolk editorial style ── */}
      {/* 桌機不顯示固定側邊欄，避免遮蓋正文。改用全螢幕浮動按鈕模式。 */}

      {/* ── Floating TOC button + slide-up drawer (all screens) ── */}
      <div>
        {/* Floating TOC button — appears after scrolling 20%, all screens */}
        {progress > 20 && (
          <button
            onClick={() => setMobileOpen(true)}
            style={{ bottom: 'max(24px, env(safe-area-inset-bottom, 24px))' }}
            className="fixed right-4 md:right-6 z-40
                       bg-olive-700 text-white rounded-full
                       w-11 h-11 flex items-center justify-center
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
