/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,

  // ── Image optimisation ───────────────────────────────────────────────────
  images: {
    unoptimized: true,          // required for static export
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picture-search.skywork.ai' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,     // 1 day cache
  },

  // ── Build tolerances ──────────────────────────────────────────────────────
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
