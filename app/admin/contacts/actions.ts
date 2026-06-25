'use server';

import { revalidatePath } from 'next/cache';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { contacts } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function deleteContact(id: number) {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  await db.delete(contacts).where(eq(contacts.id, id));
  revalidatePath('/admin/contacts');
}

export async function toggleContactRead(id: number, currentReadStatus: boolean) {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  await db.update(contacts).set({ read: !currentReadStatus }).where(eq(contacts.id, id));
  revalidatePath('/admin/contacts');
}

export async function updateBookingStatus(id: number, status: string) {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  await db.update(contacts).set({ status }).where(eq(contacts.id, id));
  revalidatePath('/admin/contacts');
}
