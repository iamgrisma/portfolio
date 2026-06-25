import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { contacts } from '@/src/db/schema';
import { desc } from 'drizzle-orm';
import ContactsClient from './ContactsClient';

export const runtime = 'edge';

export default async function AdminContactsPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  const contactsList = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  
  return <ContactsClient initialContacts={contactsList} />;
}
