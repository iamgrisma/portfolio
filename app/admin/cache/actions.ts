'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { auth } from '@/auth';

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function clearCacheByTag(tag: string) {
  await verifyAdmin();
  revalidateTag(tag);
  return { success: true, message: `Cache for '${tag}' cleared successfully.` };
}

export async function clearAllCaches() {
  await verifyAdmin();
  revalidatePath('/', 'layout');
  return { success: true, message: 'All caches cleared successfully.' };
}
