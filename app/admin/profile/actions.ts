"use server";

import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { profiles, educations, experiences, interests } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

async function getDbInstance() {
  await verifyAdmin();
  const { env } = (await getCloudflareContext()) as unknown as { env: CloudflareEnv };
  return getDb(env.DB);
}

// === PROFILE ===
export async function updateProfile(id: number, data: { name: string; nickname?: string; tagline?: string; bio?: string }) {
  const db = await getDbInstance();
  if (id) {
    await db.update(profiles).set({ ...data, updatedAt: new Date() }).where(eq(profiles.id, id));
  } else {
    await db.insert(profiles).values(data);
  }
  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidatePath("/");
}

// === EDUCATION ===
export async function addEducation(data: { degree: string; institution: string; year: string; order: number }) {
  const db = await getDbInstance();
  await db.insert(educations).values(data);
  revalidatePath("/admin/profile");
  revalidatePath("/about");
}

export async function deleteEducation(id: number) {
  const db = await getDbInstance();
  await db.delete(educations).where(eq(educations.id, id));
  revalidatePath("/admin/profile");
  revalidatePath("/about");
}

// === EXPERIENCE ===
export async function addExperience(data: { role: string; organization: string; duration: string; description?: string; order: number }) {
  const db = await getDbInstance();
  await db.insert(experiences).values(data);
  revalidatePath("/admin/profile");
  revalidatePath("/about");
}

export async function deleteExperience(id: number) {
  const db = await getDbInstance();
  await db.delete(experiences).where(eq(experiences.id, id));
  revalidatePath("/admin/profile");
  revalidatePath("/about");
}

// === INTERESTS ===
export async function addInterest(data: { name: string; category?: string }) {
  const db = await getDbInstance();
  await db.insert(interests).values(data);
  revalidatePath("/admin/profile");
  revalidatePath("/about");
}

export async function deleteInterest(id: number) {
  const db = await getDbInstance();
  await db.delete(interests).where(eq(interests.id, id));
  revalidatePath("/admin/profile");
  revalidatePath("/about");
}
