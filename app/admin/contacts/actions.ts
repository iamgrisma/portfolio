'use server';

import { revalidatePath } from 'next/cache';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { contacts, contactReplies } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function deleteContact(id: number) {
  await verifyAdmin();
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  await db.delete(contacts).where(eq(contacts.id, id));
  revalidatePath('/admin/contacts');
}

export async function toggleContactRead(id: number, currentReadStatus: boolean) {
  await verifyAdmin();
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  await db.update(contacts).set({ read: !currentReadStatus }).where(eq(contacts.id, id));
  revalidatePath('/admin/contacts');
}

export async function updateBookingStatus(id: number, status: string) {
  await verifyAdmin();
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  await db.update(contacts).set({ status }).where(eq(contacts.id, id));
  revalidatePath('/admin/contacts');
}

export async function sendEmailReply(contactId: number, to: string, name: string, subject: string, message: string) {
  await verifyAdmin();
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const brevoKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY;
  if (!brevoKey) throw new Error("Brevo API key is not configured.");

  const payload = {
    sender: { email: 'contact@raksha.com.np', name: 'Raksha Mishra' },
    to: [{ email: to, name: name }],
    subject,
    htmlContent: `<div style="font-family:sans-serif; white-space: pre-wrap; font-size: 15px; color: #333;">${message}</div>`
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': brevoKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send email: ${errorText}`);
  }

  const db = getDb(env.DB);
  await db.insert(contactReplies).values({
    contactId,
    subject,
    message,
  });

  await db.update(contacts).set({ read: true }).where(eq(contacts.id, contactId));

  revalidatePath('/admin/contacts');
}
