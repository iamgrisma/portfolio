import EditBlogClient from "./EditBlogClient";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { blogs, categories, blogTags, tags } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Edit Blog | Admin",
};

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) return notFound();

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  const blog = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1).get();
  if (!blog) return notFound();

  // Get category
  let categoryName = null;
  if (blog.categoryId) {
    const cat = await db.select().from(categories).where(eq(categories.id, blog.categoryId)).limit(1).get();
    categoryName = cat?.name || null;
  }

  // Get tags
  const bTags = await db.select().from(blogTags).where(eq(blogTags.blogId, id));
  const tagNames = [];
  for (const bt of bTags) {
    const t = await db.select().from(tags).where(eq(tags.id, bt.tagId)).limit(1).get();
    if (t) tagNames.push(t.name);
  }

  const enhancedBlog = {
    ...blog,
    categoryName,
    tagNames,
  };

  return <EditBlogClient initialBlog={enhancedBlog} />;
}
