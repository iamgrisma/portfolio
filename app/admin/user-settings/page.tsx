import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import UserSettingsClient from "./UserSettingsClient";

export const metadata = {
  title: "User Settings | Admin",
};

export const dynamic = 'force-dynamic';

export default async function UserSettingsPage() {
  const session = await auth();
  if (!session?.user?.email) {
    return <div>Unauthorized</div>;
  }

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  // Fetch the current user record
  const userRecord = await db.select().from(users).where(eq(users.email, session.user.email)).get();

  if (!userRecord) {
    return <div>User not found in database</div>;
  }

  return <UserSettingsClient initialUser={userRecord} />;
}
