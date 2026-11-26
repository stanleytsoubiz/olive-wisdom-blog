import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-static';

// Last content-change dates for pages that don't change with article
// publishing. Update the date here when the page itself is edited — do NOT
// stamp "today" on every build, or search engines can't tell what changed.
// (Dates verified from git history, 2026-11-22.)
const STATIC_PAGE_DATES: Record<string, string> = {
  '/about': '2026-11-22',
  '/selection': '2026-11-22',
  '/privacy': '2026-11-22',
  '/terms': '2026-11-22',
  '/contact': '2026-06-04',
  '/methodology': '2026-11-26',
  '/disclosure': '2026-11-26',
  '/sponsorship': '2026-11-26',
  '/screening': '2026-11-26',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPosts();
  const baseUrl = 'https://olive-wisdom.com';
  const canonicalUrl = (path = '') => `${baseUrl}${path}/`;

  // Pages that list content change whenever an article is published or
  // updated, so their lastModified is the newest article date.
  const latestPostDate = posts.reduce((latest: Date, post) => {
    const d = new Date(post.updated || post.date);
    return d > latest ? d : latest;
  }, new Date(0));

  // Static pages — /search is intentionally excluded (thin search page,
  // should not consume crawl budget); /contact is included.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: canonicalUrl(),
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: canonicalUrl('/blog'),
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: canonicalUrl('/about'),
      lastModified: new Date(STATIC_PAGE_DATES['/about']),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: canonicalUrl('/topics'),
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: canonicalUrl('/evidence'),
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: canonicalUrl('/selection'),
      lastModified: new Date(STATIC_PAGE_DATES['/selection']),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: canonicalUrl('/contact'),
      lastModified: new Date(STATIC_PAGE_DATES['/contact']),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: canonicalUrl('/privacy'),
      lastModified: new Date(STATIC_PAGE_DATES['/privacy']),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: canonicalUrl('/terms'),
      lastModified: new Date(STATIC_PAGE_DATES['/terms']),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: canonicalUrl('/methodology'),
      lastModified: new Date(STATIC_PAGE_DATES['/methodology']),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: canonicalUrl('/disclosure'),
      lastModified: new Date(STATIC_PAGE_DATES['/disclosure']),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: canonicalUrl('/sponsorship'),
      lastModified: new Date(STATIC_PAGE_DATES['/sponsorship']),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: canonicalUrl('/screening'),
      lastModified: new Date(STATIC_PAGE_DATES['/screening']),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Article pages — priority weighted: recent articles get 0.9, older get 0.7
  const now = Date.now();
  const SIX_MONTHS = 1000 * 60 * 60 * 24 * 180;

  const articlePages: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModifiedDate = post.updated || post.date;
    const postDate = post.date ? new Date(post.date) : new Date();
    const lastModified = lastModifiedDate ? new Date(lastModifiedDate) : new Date();
    const age = now - postDate.getTime();
    const priority = age < SIX_MONTHS ? 0.9 : 0.75;
    return {
      url: canonicalUrl(`/blog/${post.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
    };
  });

  // Tag pages excluded from sitemap — thin content, noindexed, conserve crawl budget

  return [...staticPages, ...articlePages];
}
