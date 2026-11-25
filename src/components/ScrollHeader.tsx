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
      className={`sticky top-0 z-50 bg-white border-b transition-shadow duration-200
      ${scrolled ? 'border-olive-200 shadow-md' : 'border-olive-100 shadow-none'}`}
    >
      {children}
    </header>
  );
}
