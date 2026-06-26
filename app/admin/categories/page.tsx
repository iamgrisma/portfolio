import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, CloudflareEnv } from "@/src/db";
import { categories, blogs } from "@/src/db/schema";
import CategoriesClient from "./CategoriesClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/login");
  }

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);

  const allCategories = await db.select().from(categories);
  const allBlogs = await db.select().from(blogs);

  const initialCategories = allCategories.map(cat => {
    const count = allBlogs.filter(b => b.categoryId === cat.id).length;
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      color: cat.color || '#10b981',
      count
    };
  });

  return <CategoriesClient initialCategories={initialCategories} />;
}
