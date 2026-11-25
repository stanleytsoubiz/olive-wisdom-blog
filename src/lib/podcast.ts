/**
 * Podcast 集數資料（world-class blueprint 2.4：文章↔集數一體頁）。
 *
 * 主策略：每篇文章與其 Podcast 集數同步生產、同一頁呈現。本檔是集數
 * 的單一資料出處——集數上線時在此登錄，文章頁與首頁的槽位元件會自動
 * 渲染；沒有任何集數資料時，所有槽位渲染為 null，頁面與現況完全一致
 * （不放假集數、不寫「即將推出」之類的公開承諾）。
 *
 * timestamps 的 heading 必須與文章 H2 標題文字完全一致，元件會比對
 * 文章實際的 H2 錨點 id 後才產生連結。
 */
export interface EpisodeTimestamp {
  /** 'mm:ss' 或 'hh:mm:ss' */
  time: string;
  /** 對應文章 H2 標題文字（須完全一致） */
  heading: string;
}

export interface Episode {
  articleSlug: string;
  episodeNo: number;
  title?: string;
  durationSec?: number;
  publishedAt?: string;
  audioUrl?: string;
  spotifyUrl?: string;
  applePodcastsUrl?: string;
  youtubeUrl?: string;
  timestamps: EpisodeTimestamp[];
}

/** 集數登錄表（key = 文章 slug）。目前尚無已發布集數——保持空白。 */
export const EPISODES: Record<string, Episode> = {};

export function getEpisode(articleSlug: string): Episode | undefined {
  return EPISODES[articleSlug];
}

export function getAllEpisodes(): Episode[] {
  return Object.values(EPISODES).sort((a, b) => a.episodeNo - b.episodeNo);
}

export function hasAnyEpisode(): boolean {
  return Object.keys(EPISODES).length > 0;
}
