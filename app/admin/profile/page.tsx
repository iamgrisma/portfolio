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
  const extractYear = (str: string) => {
    const match = str.match(/(\d{4})\s*(AD|BS)/i);
    if (match) {
      let year = parseInt(match[1]);
      if (match[2].toUpperCase() === 'BS') year -= 57;
      return year;
    }
    const genericMatch = str.match(/\d{4}/);
    if (genericMatch) {
      let year = parseInt(genericMatch[0]);
      if (year > 2040) year -= 57;
      return year;
    }
    return 0;
  };

  const educationsRaw = await db.select().from(educations);
  const educationsList = educationsRaw.sort((a, b) => extractYear(b.year) - extractYear(a.year));
  
  const experiencesRaw = await db.select().from(experiences);
  const experiencesList = experiencesRaw.sort((a, b) => {
    // If one is present and other is not, present comes first
    const aPres = a.duration.toLowerCase().includes('present');
    const bPres = b.duration.toLowerCase().includes('present');
    if (aPres && !bPres) return -1;
    if (!aPres && bPres) return 1;
    return extractYear(b.duration) - extractYear(a.duration);
  });
  
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
