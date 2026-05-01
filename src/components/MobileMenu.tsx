'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/blog?cat=culture',    label: '知性史詩', icon: '📜', desc: '橄欖油的文化傳承' },
  { href: '/blog?cat=science',    label: '科學萃取', icon: '🔬', desc: '多酚科學與健康研究' },
  { href: '/blog?cat=health',     label: '品味鑑賞', icon: '🫒', desc: 'EVOO 選購與品鑑' },
  { href: '/blog?cat=lifestyle',  label: '餐桌美學', icon: '🍽', desc: '地中海飲食生活' },
  { href: '/about',               label: '關於知橄', icon: 'ℹ️',  desc: '編輯團隊與使命' },
  { href: '/topics',              label: '所有主題', icon: '🏷️', desc: '依主題瀏覽知識庫' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  // 開啟時鎖定背景滾動
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* 漢堡按鈕 */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? '關閉選單' : '開啟選單'}
        aria-expanded={open}
        className="flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-olive-50 transition-colors"
      >
        <span className={`block w-5 h-0.5 bg-olive-800 transition-all duration-300 ${open ? 'rotate-45 translate-y-1' : ''}`} />
        <span className={`block w-5 h-0.5 bg-olive-800 my-1 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-olive-800 transition-all duration-300 ${open ? '-rotate-45 -translate-y-1' : ''}`} />
      </button>

      {/* 遮罩 */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 側邊抽屜 */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 抽屜 Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-olive-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">🫒</span>
            <span className="font-bold text-olive-800 text-sm">知橄生活</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="關閉選單"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-olive-50 text-olive-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 導覽連結 */}
        <nav className="px-4 py-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-olive-50 transition-colors group"
                >
                  <span className="text-xl mt-0.5">{link.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-olive-800 group-hover:text-olive-600">{link.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* 分隔線 */}
          <div className="border-t border-olive-100 my-4" />

          {/* 文章快速入口 */}
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-olive-50 transition-colors"
          >
            <span className="text-xl">📚</span>
            <div>
              <p className="text-sm font-semibold text-olive-800">所有文章</p>
              <p className="text-xs text-gray-400 mt-0.5">瀏覽完整知識庫</p>
            </div>
          </Link>
        </nav>

        {/* 底部 CTA */}
        <div className="px-5 py-5 border-t border-olive-100">
          <Link
            href="/#subscribe"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-olive-700 hover:bg-olive-800 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
          >
            ✉️ 訂閱知橄週報
          </Link>
          <p className="text-xs text-center text-gray-400 mt-2">每週橄欖油科學精選 · 免費</p>
        </div>
      </div>
    </div>
  );
}
