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
  const toc = extractToc(htmlContent);

  useEffect(() => {
    const handleScroll = () => {
      // Reading progress
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);

      // Active heading
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

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-olive-100">
        <div
          className="h-full bg-gradient-to-r from-olive-500 to-gold-400 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* TOC — visible on large screens */}
      <nav
        aria-label="文章目錄"
        className="hidden xl:block fixed top-24 right-6 w-56 bg-white/90 backdrop-blur-sm border border-olive-100 rounded-2xl p-5 shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto"
      >
        <p className="text-xs text-olive-600 font-semibold tracking-wider uppercase mb-4">文章目錄</p>
        <ul className="space-y-1.5">
          {toc.map((item) => (
            <li key={item.id} style={{ paddingLeft: item.level === 3 ? '12px' : '0' }}>
              <a
                href={`#${item.id}`}
                className={`block text-xs leading-snug py-0.5 transition-colors rounded ${
                  active === item.id
                    ? 'text-olive-700 font-semibold'
                    : 'text-gray-400 hover:text-olive-600'
                }`}
              >
                {item.level === 3 && <span className="text-olive-300 mr-1">└</span>}
                {item.text.slice(0, 36)}{item.text.length > 36 ? '…' : ''}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
