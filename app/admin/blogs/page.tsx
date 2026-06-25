import BlogListClient from "./BlogListClient";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { blogs, categories, blogTags, tags } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata = {
  title: "Blogs Manager | Admin",
};

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  // Fetch blogs
  const allBlogs = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
  
  // Enhance with category and tags
  // Note: in a real big app, use a join or relations query, but we can do a relations query if configured
  // For now, let's fetch manually or use relations
  // Assuming relations are set up, we could do db.query.blogs.findMany, but we'll use standard queries.
  
  const allCategories = await db.select().from(categories);
  const allTags = await db.select().from(tags);
  const allBlogTags = await db.select().from(blogTags);

  const enhancedBlogs = allBlogs.map(b => {
    const cat = allCategories.find(c => c.id === b.categoryId);
    const bTags = allBlogTags.filter(bt => bt.blogId === b.id).map(bt => allTags.find(t => t.id === bt.tagId)?.name).filter(Boolean);
    
    return {
      ...b,
      categoryName: cat?.name || null,
      tagNames: bTags,
    };
  });

  return <BlogListClient initialBlogs={enhancedBlogs} />;
}
