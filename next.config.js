/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pure static HTML export — deployed to Cloudflare Pages as static files
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
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

module.exports = nextConfig;
