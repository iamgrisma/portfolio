"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { profiles, educations, experiences, interests, stats, socialProfiles } from "@/src/db/schema";
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
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  return getDb(env.DB);
}

// === PROFILE ===
export async function updateProfile(id: number, data: { 
  name: string; 
  nickname?: string; 
  tagline?: string; 
  bio?: string;
  currentAddress?: string;
  permanentAddress?: string;
  phone?: string;
  publicEmail?: string;
}) {
  const db = await getDbInstance();
  if (id) {
    await db.update(profiles).set({ ...data, updatedAt: new Date() }).where(eq(profiles.id, id));
  } else {
    await db.insert(profiles).values(data);
  }
  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidatePath("/");
  revalidateTag("profile");
}

// === STATS ===
export async function addStat(data: { label: string; value: string; icon: string; order: number }) {
  const db = await getDbInstance();
  await db.insert(stats).values(data);
  revalidatePath("/admin/profile");
  revalidatePath("/");
  revalidateTag("stats");
}

export async function updateStat(id: number, data: { label: string; value: string; icon: string; order: number }) {
  const db = await getDbInstance();
  await db.update(stats).set(data).where(eq(stats.id, id));
  revalidatePath("/admin/profile");
  revalidatePath("/");
  revalidateTag("stats");
}

export async function deleteStat(id: number) {
  const db = await getDbInstance();
  await db.delete(stats).where(eq(stats.id, id));
  revalidatePath("/admin/profile");
  revalidatePath("/");
  revalidateTag("stats");
}

// === EDUCATION ===
export async function addEducation(data: { degree: string; institution: string; year: string; order: number }) {
  const db = await getDbInstance();
  await db.insert(educations).values(data);
  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidateTag("profile");
}

export async function deleteEducation(id: number) {
  const db = await getDbInstance();
  await db.delete(educations).where(eq(educations.id, id));
  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidateTag("profile");
}

export async function updateEducation(id: number, data: { degree: string; institution: string; year: string; order: number }) {
  const db = await getDbInstance();
  await db.update(educations).set(data).where(eq(educations.id, id));
  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidateTag("profile");
}

// === EXPERIENCE ===
export async function addExperience(data: { role: string; organization: string; duration: string; description?: string; order: number }) {
  const db = await getDbInstance();
  await db.insert(experiences).values(data);
  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidateTag("profile");
}

export async function deleteExperience(id: number) {
  const db = await getDbInstance();
  await db.delete(experiences).where(eq(experiences.id, id));
  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidateTag("profile");
}

export async function updateExperience(id: number, data: { role: string; organization: string; duration: string; description?: string; order: number }) {
  const db = await getDbInstance();
  await db.update(experiences).set(data).where(eq(experiences.id, id));
  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidateTag("profile");
}

// === INTERESTS ===
export async function addInterest(data: { name: string; category?: string }) {
  const db = await getDbInstance();
  await db.insert(interests).values(data);
  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidateTag("profile");
}

export async function deleteInterest(id: number) {
  const db = await getDbInstance();
  await db.delete(interests).where(eq(interests.id, id));
  revalidatePath("/admin/profile");
  revalidatePath("/about");
  revalidatePath("/");
  revalidateTag("profile");
}

// === SOCIAL PROFILES ===
export async function addSocialProfile(platform: string, url: string, icon: string) {
  const db = await getDbInstance();
  await db.insert(socialProfiles).values({ platform, url, icon });
  revalidatePath('/', 'layout');
  revalidateTag('socials');
}

export async function deleteSocialProfile(id: number) {
  const db = await getDbInstance();
  await db.delete(socialProfiles).where(eq(socialProfiles.id, id));
  revalidatePath('/', 'layout');
  revalidateTag('socials');
}

export async function updateSocialProfileUrl(id: number, url: string) {
  const db = await getDbInstance();
  await db.update(socialProfiles).set({ url }).where(eq(socialProfiles.id, id));
  revalidatePath('/', 'layout');
  revalidateTag('socials');
}
