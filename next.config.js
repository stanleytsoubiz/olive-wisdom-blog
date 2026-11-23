/**
 * Two build targets share this config, selected by OW_BUILD_TARGET:
 *
 *  - static (default; `npm run build`, live Cloudflare Pages deploy):
 *    pure static export. This branch is byte-for-byte the behaviour the
 *    live site has always used — do not change it casually.
 *  - cf (`OW_BUILD_TARGET=cf`; run by the OpenNext buildCommand,
 *    `node scripts/build.mjs server`): server build for Cloudflare
 *    Workers. Static export and server output are mutually exclusive
 *    in Next.js, so the cf branch drops `output: 'export'`, enables
 *    next/image optimisation, and carries the security headers in
 *    `headers()` — on Workers, `public/_headers` only applies to
 *    static assets, NOT to Worker-rendered HTML (verified in the
 *    OpenNext assessment, 2026-11-22). The header values below mirror
 *    the `/*` block of `public/_headers`; keep the two in sync.
 */
const isCf = process.env.OW_BUILD_TARGET === 'cf';

const CSP = [
  "default-src 'self'",
  // challenges.cloudflare.com reserved for Turnstile (assessment step 2-1)
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
  'frame-src https://challenges.cloudflare.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy', value: CSP },
];

// Next's default for prerendered HTML on a server build is
// `s-maxage=31536000`, which would let the edge serve a year-old
// homepage after every article publish (assessment §1 item 5).
// Keep HTML effectively fresh, like the live Pages behaviour
// (`no-cache` in public/_headers), with a short shared-cache window.
const HTML_CACHE_HEADERS = [
  { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=600' },
];

const PAGE_ROUTES = [
  '/',
  '/blog',
  '/blog/:path*',
  '/about',
  '/evidence',
  '/selection',
  '/topics',
  '/contact',
  '/search',
  '/privacy',
  '/terms',
];

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

  // ── Build checks ────────────────────────────────────────────────────────
  // TypeScript and ESLint run on every build (re-enabled 2026-11-22,
  // Batch 3). Do NOT set ignoreBuildErrors / ignoreDuringBuilds to
  // silence failures — fix the error instead.
};

if (isCf) {
  // Server build (Cloudflare Workers via OpenNext): no static export,
  // real image optimisation, headers carried by Next itself.
  nextConfig.images.unoptimized = false;
  nextConfig.headers = async () => [
    { source: '/:path*', headers: SECURITY_HEADERS },
    ...PAGE_ROUTES.map((source) => ({ source, headers: HTML_CACHE_HEADERS })),
  ];
} else {
  // Pure static HTML export — deployed to Cloudflare Pages as static files
  nextConfig.output = 'export';
  nextConfig.images.unoptimized = true;
}

module.exports = nextConfig;
