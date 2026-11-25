'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { CATEGORY_COLUMNS } from '@/lib/categories';

// Column links come from the shared category source of truth
// (src/lib/categories.ts). The '/blog/?cat=…' form (trailing slash
// before the query) is kept so the mobile menu links exactly what it
// linked before — only the labels' source changed, not the URLs.
const NAV_LINKS = [
  { href: '/search', label: '搜尋文章' },
  { href: '/blog', label: '所有文章' },
  ...CATEGORY_COLUMNS.map((c) => ({ href: c.href.replace('/blog?', '/blog/?'), label: c.label })),
  { href: '/topics', label: '所有主題' },
  { href: '/evidence', label: '證據圖書館' },
  { href: '/selection', label: '選品標準' },
  { href: '/about', label: '關於知橄' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return () => { document.body.style.overflow = ''; };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* Hamburger button — below lg (desktop nav takes over at lg) */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 text-olive-700"
        aria-label="開啟選單"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Fullscreen overlay — fully opaque on purpose: it must never let
          the page show through. Rendered through a portal to <body> so no
          ancestor (the sticky header's stacking context, or any future
          transform/filter/backdrop-filter on an ancestor, which would
          become the containing block for a fixed element) can confine or
          re-layer it — the 2026-11-25 recurrence of the see-through menu
          happened while the overlay lived inside the header. The opaque
          background is ALSO set inline so it does not depend on a
          generated utility class reaching the deployed CSS. */}
      {open && createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#FAF8F4] flex flex-col"
             style={{ animation: 'slideInRight 200ms ease-out', backgroundColor: '#FAF8F4', opacity: 1 }}>
          {/* Close button */}
          <div className="flex justify-end p-5">
            <button onClick={() => setOpen(false)} className="p-2 text-olive-700" aria-label="關閉選單">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Nav links */}
          <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="text-[20px] font-bold text-olive-900 py-3 border-b border-olive-100 min-h-[56px] flex items-center"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>,
        document.body
      )}

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
