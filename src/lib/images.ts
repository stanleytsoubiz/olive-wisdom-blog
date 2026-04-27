/**
 * images.ts — 知橄生活 圖片資源管理
 *
 * 負責動態載入 /data/images.json（位於 public/data/images.json）
 * 支援 Server Component（靜態載入）與 Client Component（動態 fetch）
 * 
 * Admin 後台可直接修改 images.json 並推送 GitHub，
 * 前端次次請求都會取得最新版本，無需重新 Build。
 */

export interface HeroImage {
  url: string;
  alt: string;
  credit?: string;
}

export interface PostImage {
  url: string;
  alt: string;
  credit?: string;
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
// 在 build time 會靜態載入；runtime 動態請求由 getImagesClient 處理
export async function getImages(): Promise<ImagesData> {
  try {
    // 優先嘗試本地 filesystem（build time）
    if (typeof window === 'undefined') {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public', 'data', 'images.json');
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(raw) as ImagesData;
        }
      } catch {
        // fall through
      }
    }
    return FALLBACK_IMAGES;
  } catch {
    return FALLBACK_IMAGES;
  }
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
