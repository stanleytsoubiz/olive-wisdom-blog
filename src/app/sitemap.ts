import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPosts();
  const baseUrl = 'https://olive-wisdom.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
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
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: postDate,
      changeFrequency: 'monthly' as const,
      priority,
    };
  });

  // Tag pages — collect all unique tags
  const tagSet = new Set<string>();
  posts.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));
  const tagPages: MetadataRoute.Sitemap = Array.from(tagSet).map((tag) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.65,
  }));

  return [...staticPages, ...articlePages, ...tagPages];
}
