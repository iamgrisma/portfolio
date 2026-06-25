import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { contacts } from '@/src/db/schema';
import { desc } from 'drizzle-orm';
import ContactsClient from './ContactsClient';

export const dynamic = 'force-dynamic';

export default async function AdminContactsPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  const contactsList = await db.query.contacts.findMany({
    with: {
      replies: true,
    },
    orderBy: [desc(contacts.createdAt)],
  });
  
  return <ContactsClient initialContacts={contactsList as any} />;
}
