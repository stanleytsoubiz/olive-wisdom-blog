/**
 * /api/og — 動態 OG 社群圖卡生成器
 * Olive Wisdom 品牌化 Open Graph Image（1200×630）
 *
 * 使用方式：
 *   /api/og?title=文章標題&cat=science&rt=8&en=Article+Subtitle
 *
 * Params:
 *   title  — 文章標題（中文，顯示於卡片）
 *   cat    — 分類 slug: science | lifestyle | health | culture | guide
 *   rt     — 閱讀時間（分鐘）
 *   en     — 英文副標（可選，顯示 category label）
 *
 * Runtime: Cloudflare Pages（opennextjs-cloudflare 統一處理，無需 edge 標記）
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// ── 分類設定 ──────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { en: string; color: string; accent: string }> = {
  science:   { en: 'SCIENCE',   color: '#1A3A2A', accent: '#4ade80' },
  lifestyle: { en: 'LIFESTYLE', color: '#2A1A0A', accent: '#fbbf24' },
  health:    { en: 'SELECTION', color: '#1A2A3A', accent: '#60a5fa' },
  culture:   { en: 'HERITAGE',  color: '#2A1A2A', accent: '#c084fc' },
  guide:     { en: 'GUIDE',     color: '#1A2A1A', accent: '#34d399' },
};

// ── SVG 橄欖枝裝飾 ────────────────────────────────────────
const OliveBranch = () => (
  <svg
    width="180" height="180"
    viewBox="0 0 180 180"
    style={{ position: 'absolute', right: 48, bottom: 48, opacity: 0.12 }}
  >
    {/* Main stem */}
    <path d="M90 170 Q80 120 70 70 Q60 30 90 10" stroke="#A8894A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Leaves left */}
    <ellipse cx="65" cy="55" rx="18" ry="9" transform="rotate(-40 65 55)" fill="#4a7c3f" opacity="0.8"/>
    <ellipse cx="60" cy="85" rx="16" ry="8" transform="rotate(-30 60 85)" fill="#3d6b3f" opacity="0.8"/>
    <ellipse cx="68" cy="115" rx="15" ry="7" transform="rotate(-25 68 115)" fill="#4a7c3f" opacity="0.8"/>
    {/* Leaves right */}
    <ellipse cx="95" cy="45" rx="17" ry="8" transform="rotate(35 95 45)" fill="#3d6b3f" opacity="0.8"/>
    <ellipse cx="88" cy="75" rx="16" ry="7" transform="rotate(28 88 75)" fill="#4a7c3f" opacity="0.8"/>
    <ellipse cx="92" cy="105" rx="14" ry="7" transform="rotate(22 92 105)" fill="#3d6b3f" opacity="0.8"/>
    {/* Olives */}
    <ellipse cx="63" cy="60" rx="5" ry="6" fill="#A8894A" opacity="0.9"/>
    <ellipse cx="90" cy="50" rx="5" ry="6" fill="#c4a96a" opacity="0.9"/>
    <ellipse cx="66" cy="120" rx="4" ry="5.5" fill="#A8894A" opacity="0.9"/>
  </svg>
);

// ── 計算標題截斷（避免 OG 卡片溢出）────────────────────────
function truncateTitle(title: string, maxLen: number = 28): string {
  if (title.length <= maxLen) return title;
  return title.slice(0, maxLen - 1) + '…';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const rawTitle  = searchParams.get('title')  ?? '知橄生活 Olive Wisdom';
  const category  = searchParams.get('cat')    ?? 'science';
  const readTime  = searchParams.get('rt')     ?? '8';
  const subtitle  = searchParams.get('en')     ?? '';

  const cat = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.science;
  const title = truncateTitle(rawTitle, 30);

  // 判斷標題長度來調整字型大小
  const titleFontSize = title.length > 20 ? 44 : title.length > 14 ? 52 : 60;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          background: `linear-gradient(135deg, #0d1f0f 0%, #1A2A1C 40%, #2D4A30 100%)`,
          display: 'flex', flexDirection: 'column',
          padding: '60px 72px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background grid texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(168,137,74,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(61,107,63,0.12) 0%, transparent 50%)',
          display: 'flex',
        }} />

        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: 'linear-gradient(90deg, #A8894A, #c4a96a, #A8894A)',
          display: 'flex',
        }} />

        {/* Olive branch decoration */}
        <OliveBranch />

        {/* ── TOP ROW: Brand ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 'auto' }}>
          {/* Logo mark — SVG olive */}
          <div style={{
            width: 48, height: 48, borderRadius: 24,
            background: 'rgba(168,137,74,0.18)',
            border: '1.5px solid rgba(168,137,74,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
          }}>
            🫒
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#ffffff', fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
              知橄生活
            </span>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: 6 }}>
              OLIVE WISDOM
            </span>
          </div>

          {/* Category badge */}
          <div style={{
            marginLeft: 'auto',
            background: 'rgba(168,137,74,0.15)',
            border: `1px solid ${cat.accent}40`,
            borderRadius: 100,
            padding: '6px 20px',
            color: cat.accent,
            fontSize: 12, letterSpacing: 4, fontWeight: 600,
            display: 'flex',
          }}>
            {cat.en}
          </div>
        </div>

        {/* ── CENTER: Title ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', paddingTop: 40, paddingBottom: 20,
        }}>
          {/* Gold divider */}
          <div style={{
            width: 56, height: 3,
            background: 'linear-gradient(90deg, #A8894A, #c4a96a)',
            borderRadius: 2, marginBottom: 28,
            display: 'flex',
          }} />

          {/* Title */}
          <div style={{
            color: '#ffffff',
            fontSize: titleFontSize,
            fontWeight: 700,
            lineHeight: 1.35,
            letterSpacing: 1,
            maxWidth: 880,
            display: 'flex',
          }}>
            {title}
          </div>

          {/* Sub label */}
          {subtitle && (
            <div style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: 18,
              marginTop: 16,
              letterSpacing: 2,
              display: 'flex',
            }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* ── BOTTOM ROW ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid rgba(168,137,74,0.2)',
          paddingTop: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, letterSpacing: 2 }}>
              olive-wisdom.com
            </span>
            <div style={{
              width: 4, height: 4, borderRadius: 2,
              background: 'rgba(168,137,74,0.5)', display: 'flex',
            }} />
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: 1 }}>
              {readTime} MIN READ
            </span>
          </div>

          {/* Right: science/wisdom tag */}
          <div style={{
            color: 'rgba(168,137,74,0.6)',
            fontSize: 11, letterSpacing: 4,
            display: 'flex',
          }}>
            SCIENCE · CULTURE · WELLNESS
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
