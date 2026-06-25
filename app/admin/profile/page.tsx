import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { profiles, educations, experiences, interests, stats } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import ProfileManagerClient from "./ProfileManagerClient";

export const metadata = {
  title: "Profile Manager | Admin",
};

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  const profile = await db.select().from(profiles).limit(1).get() || null;
  const educationsList = await db.select().from(educations).orderBy(educations.order);
  const experiencesList = await db.select().from(experiences).orderBy(experiences.order);
  const interestsList = await db.select().from(interests);
  const statsList = await db.select().from(stats).orderBy(stats.order);

  const data = {
    profile,
    educations: educationsList,
    experiences: experiencesList,
    interests: interestsList,
    stats: statsList,
  };

  return <ProfileManagerClient data={data} />;
}
