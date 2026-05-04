'use client';
import { useEffect, useState } from 'react';

export default function ScrollHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <header
      data-pagefind-ignore
      className={`sticky top-0 z-50 border-b border-olive-100 transition-shadow duration-200
      ${scrolled ? 'bg-white/98 shadow-md backdrop-blur-sm' : 'bg-white/95 shadow-none backdrop-blur-sm'}`}
    >
      {children}
    </header>
  );
}
