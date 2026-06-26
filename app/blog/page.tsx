import { getCloudflareContext } from '@opennextjs/cloudflare';
import { CloudflareEnv } from '@/src/db';
import { getCachedSocials, getCachedAllBlogs, getCachedSiteSettings } from '@/src/db/queries';
import BlogListClient, { BlogPost } from './BlogListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog',
  description: 'Articles about IT Systems, tech trends, and web development.',
};

export default async function BlogPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const socials = await getCachedSocials(env.DB);
  const settings = await getCachedSiteSettings(env.DB);
  
  const fetchedBlogs = await getCachedAllBlogs(env.DB);

  const formattedBlogs: BlogPost[] = fetchedBlogs.map((b, index) => ({
    id: b.id,
    title: b.title,
    excerpt: b.excerpt || '',
    date: b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString(),
    slug: b.slug,
    category: b.category?.name || 'Uncategorized',
    tags: b.blogTags.map(bt => bt.tag.name),
    readingTime: b.readingTime || '5 min read',
    featured: index === 0, // Make the most recent post featured
  }));

  return <BlogListClient initialBlogs={formattedBlogs} socials={socials} settings={settings} />;
}
