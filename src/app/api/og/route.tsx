/**
 * /api/og — 動態 OG 圖卡（暫時停用）
 *
 * @opennextjs/cloudflare v1.0.0 無法將 next/og 的 ImageResponse
 * 與 middleware bundle 共存（alias 衝突 next/dist/compiled/edge-runtime）。
 *
 * 暫時回傳 404，OG 圖改由靜態封面圖 /images/covers/[slug].jpg 提供。
 * 待升級 Next.js 15 + opennextjs-cloudflare 修復後可恢復。
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  return new NextResponse('OG image endpoint temporarily disabled', { status: 404 });
}
