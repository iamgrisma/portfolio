"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { categories } from "@/src/db/schema";
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

export async function createCategory(data: { name: string, color: string }) {
  const { db } = await getDbInstance();
  
  await db.insert(categories).values({
    name: data.name,
    slug: generateSlug(data.name),
    color: data.color,
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/blogs/new");
}

export async function updateCategory(id: number, data: { name: string, color: string }) {
  const { db } = await getDbInstance();
  
  await db.update(categories).set({
    name: data.name,
    slug: generateSlug(data.name),
    color: data.color,
  }).where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/blogs/new");
}

export async function deleteCategory(id: number) {
  const { db } = await getDbInstance();
  
  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/blogs/new");
}
