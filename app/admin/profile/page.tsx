import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { profiles, educations, experiences, interests } from "@/src/db/schema";
import ProfileManagerClient from "./ProfileManagerClient";

export const metadata = {
  title: "Profile Manager | Admin",
};

export default async function ProfilePage() {
  const { env } = (await getCloudflareContext()) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  // Fetch all data
  const profileRecord = await db.select().from(profiles).limit(1).get();
  const educationsList = await db.select().from(educations).orderBy(educations.order);
  const experiencesList = await db.select().from(experiences).orderBy(experiences.order);
  const interestsList = await db.select().from(interests);

  const data = {
    profile: profileRecord || null,
    educations: educationsList || [],
    experiences: experiencesList || [],
    interests: interestsList || [],
  };

  return <ProfileManagerClient data={data} />;
}
