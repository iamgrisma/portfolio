import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { socialProfiles } from '@/src/db/schema';
import BlogListClient from './BlogListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog | Raksha',
  description: 'Articles about Software Engineering science, governance, and community development.',
};

export default async function BlogPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  const socials = await db.select().from(socialProfiles);

  return <BlogListClient socials={socials} />;
}
