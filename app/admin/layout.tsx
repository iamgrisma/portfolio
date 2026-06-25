import { ReactNode } from 'react';
import AdminLayoutClient from './AdminLayoutClient';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { contacts } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  // Count unread contacts and pending bookings
  const unreadRecords = await db.select().from(contacts).where(eq(contacts.read, false));
  const pendingBookings = await db.select().from(contacts).where(and(eq(contacts.type, 'booking'), eq(contacts.status, 'pending')));
  
  const uniqueIds = new Set([...unreadRecords.map(r => r.id), ...pendingBookings.map(b => b.id)]);
  const unreadCount = uniqueIds.size;

  return (
    <AdminLayoutClient unreadCount={unreadCount}>
      {children}
    </AdminLayoutClient>
  );
}
