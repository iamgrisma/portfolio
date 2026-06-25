import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { socialProfiles } from '@/src/db/schema';
import SocialsClient from './SocialsClient';

export const runtime = 'edge';

export default async function AdminSocialsPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  const socials = await db.select().from(socialProfiles);
  
  return <SocialsClient initialSocials={socials} />;
}
