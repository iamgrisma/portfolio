import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { profiles, socialProfiles } from '@/src/db/schema';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact | Kamal Baral',
  description: 'Get in touch with Kamal Baral.',
};

export default async function ContactPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  const profileRecord = await db.select().from(profiles).limit(1).get();
  const socials = await db.select().from(socialProfiles);

  return (
    <ContactClient
      currentAddress={profileRecord?.currentAddress || ''}
      phone={profileRecord?.phone || ''}
      publicEmail={profileRecord?.publicEmail || ''}
      socials={socials}
    />
  );
}
