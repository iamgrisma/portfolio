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

export async function sendEmailReply(to: string, name: string, subject: string, message: string) {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const brevoKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY;
  if (!brevoKey) throw new Error("Brevo API key is not configured.");

  const payload = {
    sender: { email: 'contact@kamalpb.com.np', name: 'Dr. Kamal Baral' },
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
}
