import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// NOTE: this is the ONLY robots.txt — public/robots.txt was deleted
// (2026-11-22) because Next.js serves robots.ts and the public copy never
// took effect, so its CCBot / FacebookBot blocks were silently ignored.
// All crawler rules live here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
      // Allow major AI crawlers explicitly
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      // Mass training scrapers — block to protect original research value
      {
        userAgent: ['CCBot', 'Omgilibot', 'FacebookBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://olive-wisdom.com/sitemap.xml',
    host: 'https://olive-wisdom.com',
  };
}
