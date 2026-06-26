"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { blogs, categories, tags, blogTags, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

async function getDbInstance() {
  const user = await verifyAdmin();
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  return { db: getDb(env.DB), user };
}

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
}

export async function createBlog(data: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  categoryName: string;
  tagNames: string[];
  featuredImage?: string;
}) {
  const { db, user } = await getDbInstance();
  
  // Find author
  const author = await db.select().from(users).where(eq(users.email, user.email!)).limit(1).get();
  if (!author) throw new Error("Author not found");

  // Handle Category
  let categoryId: number | null = null;
  if (data.categoryName) {
    let cat = await db.select().from(categories).where(eq(categories.name, data.categoryName)).limit(1).get();
    if (!cat) {
      const inserted = await db.insert(categories).values({
        name: data.categoryName,
        slug: generateSlug(data.categoryName),
      }).returning().get();
      categoryId = inserted.id;
    } else {
      categoryId = cat.id;
    }
  }

  // Insert Blog
  const newBlog = await db.insert(blogs).values({
    title: data.title,
    slug: data.slug || generateSlug(data.title),
    content: data.content,
    excerpt: data.excerpt,
    published: data.published,
    featuredImage: data.featuredImage,
    authorId: author.id,
    categoryId: categoryId,
    readingTime: `${Math.ceil(data.content.length / 1000)} min read`, // rough estimate
  }).returning().get();

  // Handle Tags
  if (data.tagNames && data.tagNames.length > 0) {
    for (const tagName of data.tagNames) {
      let t = await db.select().from(tags).where(eq(tags.name, tagName)).limit(1).get();
      if (!t) {
        t = await db.insert(tags).values({
          name: tagName,
          slug: generateSlug(tagName),
        }).returning().get();
      }
      await db.insert(blogTags).values({
        blogId: newBlog.id,
        tagId: t.id,
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
}

export async function updateBlog(id: number, data: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  categoryName: string;
  tagNames: string[];
  featuredImage?: string;
}) {
  const { db } = await getDbInstance();

  // Handle Category
  let categoryId: number | null = null;
  if (data.categoryName) {
    let cat = await db.select().from(categories).where(eq(categories.name, data.categoryName)).limit(1).get();
    if (!cat) {
      const inserted = await db.insert(categories).values({
        name: data.categoryName,
        slug: generateSlug(data.categoryName),
      }).returning().get();
      categoryId = inserted.id;
    } else {
      categoryId = cat.id;
    }
  }

  await db.update(blogs).set({
    title: data.title,
    slug: data.slug || generateSlug(data.title),
    content: data.content,
    excerpt: data.excerpt,
    published: data.published,
    featuredImage: data.featuredImage,
    categoryId: categoryId,
    readingTime: `${Math.ceil(data.content.length / 1000)} min read`,
    updatedAt: new Date(),
  }).where(eq(blogs.id, id));

  // Handle Tags - reset and recreate for simplicity
  await db.delete(blogTags).where(eq(blogTags.blogId, id));
  if (data.tagNames && data.tagNames.length > 0) {
    for (const tagName of data.tagNames) {
      let t = await db.select().from(tags).where(eq(tags.name, tagName)).limit(1).get();
      if (!t) {
        t = await db.insert(tags).values({
          name: tagName,
          slug: generateSlug(tagName),
        }).returning().get();
      }
      await db.insert(blogTags).values({
        blogId: id,
        tagId: t.id,
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/admin/blogs");
}

export async function deleteBlog(id: number) {
  const { db } = await getDbInstance();
  
  // Delete relations first
  await db.delete(blogTags).where(eq(blogTags.blogId, id));
  // Delete blog
  await db.delete(blogs).where(eq(blogs.id, id));

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
}
