import Link from 'next/link';
import { getAllEpisodes } from '@/lib/podcast';

/**
 * 首頁 Podcast 區塊（blueprint 2.4-4）：集數上線後自動列出最新集數
 * 並連回對應文章（一體頁）。目前沒有任何集數資料 → 渲染 null，
 * 首頁不出現 Podcast 區塊，也不作「即將推出」承諾。
 */
export default function PodcastHomeSection() {
  const episodes = getAllEpisodes();
  if (episodes.length === 0) return null;
  const latest = episodes.slice(-3).reverse();
  return (
    <section className="py-14 md:py-20 border-t border-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-[11px] font-sans font-semibold text-olive-600 tracking-[0.25em] uppercase mb-2">
          Podcast
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-olive-950 mb-8">用聽的讀完一篇判讀</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {latest.map((ep) => (
            <Link
              key={ep.articleSlug}
              href={`/blog/${ep.articleSlug}`}
              className="block border border-olive-200 bg-olive-50/50 px-5 py-5 hover:bg-olive-50 transition-colors"
            >
              <p className="text-xs font-sans font-semibold text-olive-600">第 {ep.episodeNo} 集</p>
              <p className="font-serif text-base font-bold text-stone-900 mt-1.5 leading-snug">
                {ep.title ?? '本集節目'}
              </p>
              <p className="text-xs text-stone-500 font-sans mt-3">前往文章頁收聽 →</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
