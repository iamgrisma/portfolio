"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function updateUser(id: number, data: { name?: string, email?: string, image?: string }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  await db.update(users).set({
    name: data.name,
    email: data.email,
    image: data.image
  }).where(eq(users.id, id)).run();

  return { success: true };
}
