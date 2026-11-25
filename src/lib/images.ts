/**
 * images.ts — 知橄生活 圖片資源管理
 *
 * 負責動態載入 /data/images.json（位於 public/data/images.json）
 * 支援 Server Component（靜態載入）與 Client Component（動態 fetch）
 * 
 * Admin 後台可直接修改 images.json 並推送 GitHub；
 * getImages() 在 build 時把 images.json 靜態打包進 server bundle
 * （OpenNext Worker 沒有 repo 檔案系統，runtime fs 讀檔永遠失敗），
 * 因此 images.json 改版需重新 build 才會生效。
 */

import imagesJson from '../../public/data/images.json';

export interface HeroImage {
  url: string;
  alt: string;
  credit?: string;
}

export interface PostImage {
  url: string;
  alt: string;
  credit?: string;
  /** 圖片來源代碼（google_imagen4／unsplash／custom／pollinations_ai_local…），
      供封面圖說標示使用，見 src/lib/covers.ts */
  source?: string;
}

export interface ImagesData {
  _meta: {
    version: string;
    lastUpdated: string;
    description: string;
    adminEditable: boolean;
  };
  hero: Record<string, HeroImage>;
  posts: Record<string, PostImage>;
  fallback: {
    post: string;
    hero: string;
  };
}

// ── Fallback（當 images.json 無法取得時使用）──────────
const FALLBACK_IMAGES: ImagesData = {
  _meta: {
    version: '1.0.0',
    lastUpdated: '2026-04-14',
    description: 'Fallback images',
    adminEditable: false,
  },
  hero: {
    homepage: {
      url: '/hero-grove.webp',
      alt: '知橄生活 — 地中海橄欖園晨光，以科學與美學精煉健康時光',
    },
    blog: {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&auto=format&fit=crop&q=80',
      alt: '橄欖油知識庫',
    },
    about: {
      url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1920&auto=format&fit=crop&q=80',
      alt: '關於知橄生活',
    },
  },
  posts: {},
  fallback: {
    post: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1920&auto=format&fit=crop&q=80',
  },
};

// ── Server-side loader（用於 SSG/SSR Page）─────────────
// images.json 在 build 時靜態打包進 server bundle（見檔頭 import）。
// 舊作法 runtime 用 fs 讀 public/data/images.json，在 OpenNext Worker
// 裡讀不到檔案、靜默退回 FALLBACK_IMAGES，導致列表縮圖、內文封面
// 與 hero 全面退回 fallback 圖 — 2026-11-24 改為靜態 import 修復。
export async function getImages(): Promise<ImagesData> {
  return imagesJson as ImagesData;
}

// ── Helpers ──────────────────────────────────────────
/** 取得指定文章的封面圖 URL */
export function getPostImageUrl(imagesData: ImagesData, slug: string): string {
  return (
    imagesData.posts[slug]?.url ||
    imagesData.fallback.post
  );
}

/** 取得 Hero 圖片 */
export function getHeroImage(imagesData: ImagesData, page: 'homepage' | 'blog' | 'about'): HeroImage {
  return (
    imagesData.hero[page] ||
    imagesData.hero['homepage'] || {
      url: imagesData.fallback.hero,
      alt: '知橄生活',
    }
  );
}
