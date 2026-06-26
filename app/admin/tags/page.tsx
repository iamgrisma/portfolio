import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { tags, blogTags } from "@/src/db/schema";
import TagsClient from "./TagsClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminTagsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/login");
  }

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  const allTags = await db.select().from(tags);
  const allBlogTags = await db.select().from(blogTags);

  const initialTags = allTags.map(tag => {
    const count = allBlogTags.filter(bt => bt.tagId === tag.id).length;
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count
    };
  });

  return <TagsClient initialTags={initialTags} />;
}
