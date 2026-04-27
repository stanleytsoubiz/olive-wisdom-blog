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

  // ── Security & performance headers ───────────────────────────────────────
  // Note: static export ignores headers() in next.config.js. 
  // We rely on public/_headers and public/_redirects for Cloudflare.

  // ── Build tolerances ──────────────────────────────────────────────────────
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
icrophone=(), geolocation=()' },
        ],
      },
      {
        source: '/(.*)\.(png|jpg|jpeg|webp|avif|svg|ico|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // ── Build tolerances ──────────────────────────────────────────────────────
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
