'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/blog', label: '所有文章' },
  { href: '/blog/?cat=science', label: '科學萃取' },
  { href: '/blog/?cat=lifestyle', label: '餐桌美學' },
  { href: '/blog/?cat=health', label: '品味鑑賞' },
  { href: '/blog/?cat=culture', label: '知性史詩' },
  { href: '/about', label: '關於知橄' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-olive-700"
        aria-label="開啟選單"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Fullscreen overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-[#FAF8F4] flex flex-col"
             style={{ animation: 'slideInRight 200ms ease-out' }}>
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
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
