'use client';
import { useEffect } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug || !SUPABASE_URL || !SUPABASE_ANON) return;

    // 防重複計數：同一 session 同一篇不重計
    const key = `ow_viewed_${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

    const trackView = async () => {
      try {
        // 先嘗試取得現有記錄
        const getRes = await fetch(
          `${SUPABASE_URL}/rest/v1/article_views?slug=eq.${encodeURIComponent(slug)}&select=slug,views`,
          {
            headers: {
              'apikey': SUPABASE_ANON,
              'Authorization': `Bearer ${SUPABASE_ANON}`,
            },
          }
        );
        const existing = getRes.ok ? await getRes.json() : [];

        if (existing.length > 0) {
          // 更新：views + 1
          await fetch(
            `${SUPABASE_URL}/rest/v1/article_views?slug=eq.${encodeURIComponent(slug)}`,
            {
              method: 'PATCH',
              headers: {
                'apikey': SUPABASE_ANON,
                'Authorization': `Bearer ${SUPABASE_ANON}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ views: (existing[0].views || 0) + 1 }),
            }
          );
        } else {
          // 新建記錄
          await fetch(`${SUPABASE_URL}/rest/v1/article_views`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON,
              'Authorization': `Bearer ${SUPABASE_ANON}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slug, views: 1 }),
          });
        }
      } catch {
        // 靜默失敗，不影響使用者體驗
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(trackView, { timeout: 3000 });
    } else {
      setTimeout(trackView, 1500);
    }
  }, [slug]);

  return null;
}
