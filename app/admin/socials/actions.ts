'use server';

import { revalidatePath } from 'next/cache';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { socialProfiles } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function addSocialProfile(platform: string, url: string, icon: string) {
  await verifyAdmin();
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  await db.insert(socialProfiles).values({
    platform,
    url,
    icon,
  });

  revalidatePath('/', 'layout'); // revalidates all pages using the footer
}

export async function deleteSocialProfile(id: number) {
  await verifyAdmin();
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  await db.delete(socialProfiles).where(eq(socialProfiles.id, id));

  revalidatePath('/', 'layout');
}

export async function updateSocialProfileUrl(id: number, url: string) {
  await verifyAdmin();
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  await db.update(socialProfiles).set({ url }).where(eq(socialProfiles.id, id));

  revalidatePath('/', 'layout');
}
