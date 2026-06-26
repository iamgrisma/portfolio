import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { socialProfiles, blogs } from '@/src/db/schema';
import BlogListClient, { BlogPost } from './BlogListClient';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog | Raksha',
  description: 'Articles about IT Systems, tech trends, and web development.',
};

export default async function BlogPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  const socials = await db.select().from(socialProfiles);
  
  const fetchedBlogs = await db.query.blogs.findMany({
    where: eq(blogs.published, true),
    orderBy: [desc(blogs.createdAt)],
    with: {
      category: true,
      blogTags: {
        with: {
          tag: true
        }
      }
    }
  });

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

  return <BlogListClient socials={socials} initialBlogs={formattedBlogs} />;
}
