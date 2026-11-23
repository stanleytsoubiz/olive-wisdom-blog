/**
 * next.config.js — OpenNext on Cloudflare Workers (migrated 2026-11-22, PR #16).
 *
 * No `output: 'export'` here: OpenNext needs a server build
 * (`.next/standalone`); static export has no server bundle and the
 * OpenNext bundling step fails with
 * `ENOENT .next/standalone/.next/server/pages-manifest.json`.
 * The Cloudflare Pages static pipeline (`npm run build`, `pages deploy
 * out`) therefore NO LONGER WORKS from this config — this PR must stay
 * OPEN (unmerged) until the GitHub workflow is switched to
 * `npm run build:cf` + `opennextjs-cloudflare deploy` (owner step).
 *
 * `images.unoptimized` is also gone: next/image now optimises covers
 * (AVIF/WebP srcset) via the Workers `[images]` binding.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picture-search.skywork.ai' },
      { protocol: 'https', hostname: 'bnotescoffee.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },

  // ── Headers ───────────────────────────────────────────────────────────
  // Worker-rendered HTML never sees public/_headers (that file only
  // applies to static assets served from .open-next/assets), so the
  // security headers live here. They are also applied to asset responses
  // via _headers with identical values — harmless duplication.
  //
  // HTML cache: Next's default for pages is `s-maxage=31536000`, which
  // would let the edge cache a new article off the homepage for up to a
  // year. The override below (`s-maxage=60, stale-while-revalidate=600`)
  // is scoped to page routes only — never `/_next/*`, so next/image and
  // hashed static assets keep their own long TTLs. If a new top-level
  // page is added, add its route here too.
  async headers() {
    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      // CSP mirrors public/_headers. 'unsafe-inline' is required for
      // scripts and styles: Next.js injects inline scripts, and
      // styled-jsx / inline style props need inline styles.
      // challenges.cloudflare.com is pre-staged for Turnstile (not
      // installed yet — see public/_headers note); adding the allowlist
      // entry now costs nothing and avoids a CSP change later.
      {
        key: 'Content-Security-Policy',
        value:
          "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com; frame-src 'none' https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
      },
    ];
    const htmlCache = {
      key: 'Cache-Control',
      value: 'public, s-maxage=60, stale-while-revalidate=600',
    };
    const pageRoutes = [
      '/',
      '/blog/:path*',
      '/topics',
      '/topics/:path*',
      '/evidence',
      '/about',
      '/contact',
      '/search',
      '/privacy',
      '/terms',
      '/sitemap.xml',
      '/robots.txt',
      '/llms.txt',
    ];
    return [
      { source: '/:path*', headers: securityHeaders },
      ...pageRoutes.map((source) => ({ source, headers: [htmlCache] })),
    ];
  },

  // ── Build checks ────────────────────────────────────────────────────────
  // TypeScript and ESLint run on every build (re-enabled 2026-11-22,
  // Batch 3). Do NOT set ignoreBuildErrors / ignoreDuringBuilds to
  // silence failures — fix the error instead.
  // NOTE (Next 16): `next build` no longer runs ESLint; lint runs
  // separately via `npm run lint` (ESLint 9 flat config).
};

module.exports = nextConfig;
