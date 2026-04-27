import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  category: string;
  excerpt: string;
  coverImage: string;
  author: string;
  readTime: number;
  tags: string[];
  sources?: string[];
  coverAlt?: string;       // SEO-optimized alt text (falls back to title if absent)
  focusKeyword?: string;   // Primary SEO keyword for this article
}

export interface Post extends PostFrontmatter {
  content: string;
}

export function getAllPosts(): PostFrontmatter[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return data as PostFrontmatter;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDirectory)) return null;
  const fileNames = fs.readdirSync(postsDirectory);
  const fileName = fileNames.find((f) => {
    const fullPath = path.join(postsDirectory, f);
    const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
    return data.slug === slug;
  });
  if (!fileName) return null;
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return { ...(data as PostFrontmatter), content };
}

export function getAllSlugs(): string[] {
  const posts = getAllPosts();
  return posts.map((p) => p.slug);
}
