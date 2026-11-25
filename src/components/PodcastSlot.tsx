import type { Episode } from '@/lib/podcast';

/**
 * 文章頁 Podcast 槽位（blueprint 2.4-1／2.4-3）：判讀卡下方、本文章節。
 * 沒有集數資料時渲染 null——不顯示佔位、不作公開承諾；集數在
 * src/lib/podcast.ts 登錄後自動出現播放器與平台連結。
 */
export default function PodcastSlot({ episode }: { episode?: Episode }) {
  if (!episode) return null;
  const platforms = [
    { label: 'Spotify', href: episode.spotifyUrl },
    { label: 'Apple Podcasts', href: episode.applePodcastsUrl },
    { label: 'YouTube', href: episode.youtubeUrl },
  ].filter((p): p is { label: string; href: string } => Boolean(p.href));
  return (
    <section
      aria-label="本集 Podcast"
      className="mt-6 border border-olive-200 bg-white px-5 py-5 sm:px-6"
    >
      <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.25em] uppercase">
        本集 Podcast
      </p>
      <p className="font-serif text-lg font-bold text-stone-900 mt-1.5">
        第 {episode.episodeNo} 集{episode.title ? `：${episode.title}` : ''}
      </p>
      {episode.audioUrl && (
        <audio controls preload="none" src={episode.audioUrl} className="w-full mt-4">
          您的瀏覽器不支援音訊播放。
        </audio>
      )}
      {platforms.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {platforms.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans font-medium text-olive-700 border border-olive-200 px-3 py-1.5 rounded-full hover:bg-olive-50 transition-colors"
            >
              在 {p.label} 收聽 ↗
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
