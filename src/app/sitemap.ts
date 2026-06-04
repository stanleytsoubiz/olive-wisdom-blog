import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPosts();
  const baseUrl = 'https://olive-wisdom.com';
  const canonicalUrl = (path = '') => `${baseUrl}${path}/`;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: canonicalUrl(),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: canonicalUrl('/blog'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: canonicalUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: canonicalUrl('/search'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: canonicalUrl('/topics'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: canonicalUrl('/authority'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: canonicalUrl('/editorial-standards'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: canonicalUrl('/privacy'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: canonicalUrl('/terms'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Article pages — priority weighted: recent articles get 0.9, older get 0.7
  const now = Date.now();
  const SIX_MONTHS = 1000 * 60 * 60 * 24 * 180;

  const articlePages: MetadataRoute.Sitemap = posts.map((post) => {
    const postDate = post.date ? new Date(post.date) : new Date();
    const age = now - postDate.getTime();
    const priority = age < SIX_MONTHS ? 0.9 : 0.75;
    return {
      url: canonicalUrl(`/blog/${post.slug}`),
      lastModified: postDate,
      changeFrequency: 'monthly' as const,
      priority,
    };
  });

  // Tag pages excluded from sitemap — thin content, noindexed, conserve crawl budget

  return [...staticPages, ...articlePages];
}
