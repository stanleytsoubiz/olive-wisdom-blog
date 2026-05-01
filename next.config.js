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

  // ── Build tolerances ──────────────────────────────────────────────────────
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
