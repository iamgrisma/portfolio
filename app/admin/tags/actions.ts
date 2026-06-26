"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { tags, blogTags } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

async function getDbInstance() {
  const user = await verifyAdmin();
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  return { db: getDb(env.DB), user };
}

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
}

export async function createTag(data: { name: string }) {
  const { db } = await getDbInstance();
  
  await db.insert(tags).values({
    name: data.name,
    slug: generateSlug(data.name),
  });

  revalidatePath("/admin/tags");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/blogs/new");
}

export async function updateTag(id: number, data: { name: string }) {
  const { db } = await getDbInstance();
  
  await db.update(tags).set({
    name: data.name,
    slug: generateSlug(data.name),
  }).where(eq(tags.id, id));

  revalidatePath("/admin/tags");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/blogs/new");
}

export async function deleteTag(id: number) {
  const { db } = await getDbInstance();
  
  // Delete associations first
  await db.delete(blogTags).where(eq(blogTags.tagId, id));
  // Delete the tag
  await db.delete(tags).where(eq(tags.id, id));

  revalidatePath("/admin/tags");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/blogs/new");
}
