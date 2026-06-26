import { unstable_cache } from 'next/cache';
import { getDb } from '@/src/db';
import { profiles, educations, experiences, blogs, stats, socialProfiles, categories, tags, blogTags, interests, projects } from '@/src/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

// Caching duration (e.g. 1 year, essentially infinite until manually revalidated)
const CACHE_TTL = 31536000;

export const getCachedProfile = async (dbBinding: any) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      return await db.select().from(profiles).limit(1).get();
    },
    ['profile-data'],
    { tags: ['profile'], revalidate: CACHE_TTL }
  );
  return getFn();
};

export const getCachedEducations = async (dbBinding: any) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      return await db.select().from(educations);
    },
    ['educations-data'],
    { tags: ['profile'], revalidate: CACHE_TTL }
  );
  return getFn();
};

export const getCachedExperiences = async (dbBinding: any) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      return await db.select().from(experiences);
    },
    ['experiences-data'],
    { tags: ['profile'], revalidate: CACHE_TTL }
  );
  return getFn();
};

export const getCachedStats = async (dbBinding: any) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      return await db.select().from(stats).orderBy(asc(stats.order));
    },
    ['stats-data'],
    { tags: ['stats', 'profile'], revalidate: CACHE_TTL }
  );
  return getFn();
};

export const getCachedSocials = async (dbBinding: any) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      return await db.select().from(socialProfiles);
    },
    ['socials-data'],
    { tags: ['socials', 'profile'], revalidate: CACHE_TTL }
  );
  return getFn();
};

export const getCachedInterests = async (dbBinding: any) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      return await db.select().from(interests);
    },
    ['interests-data'],
    { tags: ['profile'], revalidate: CACHE_TTL }
  );
  return getFn();
};

export const getCachedProjects = async (dbBinding: any) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      return await db.select().from(projects).orderBy(asc(projects.order));
    },
    ['projects-data'],
    { tags: ['projects'], revalidate: CACHE_TTL }
  );
  return getFn();
};

export const getCachedLatestBlogs = async (dbBinding: any, limit: number = 3) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      return await db.select().from(blogs).where(eq(blogs.published, true)).orderBy(desc(blogs.createdAt)).limit(limit);
    },
    ['latest-blogs-data', limit.toString()],
    { tags: ['blogs'], revalidate: CACHE_TTL }
  );
  return getFn();
};

export const getCachedAllBlogs = async (dbBinding: any) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      return await db.query.blogs.findMany({
        where: eq(blogs.published, true),
        orderBy: [desc(blogs.createdAt)],
        with: {
          category: true,
          blogTags: {
            with: {
              tag: true
            }
          }
        }
      });
    },
    ['all-blogs-data'],
    { tags: ['blogs'], revalidate: CACHE_TTL }
  );
  return getFn();
};

export const getCachedBlogBySlug = async (dbBinding: any, slug: string) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      return await db.query.blogs.findFirst({
        where: eq(blogs.slug, slug),
        with: {
          category: true,
          blogTags: {
            with: {
              tag: true
            }
          },
          author: true
        }
      });
    },
    ['blog-data', slug],
    { tags: ['blogs'], revalidate: CACHE_TTL }
  );
  return getFn();
};

export const getCachedRelatedBlogs = async (dbBinding: any, currentPostId: number, categoryId?: number | null) => {
  const getFn = unstable_cache(
    async () => {
      const db = getDb(dbBinding);
      
      let relatedPosts: any[] = [];
      if (categoryId) {
        relatedPosts = await db.query.blogs.findMany({
          where: (blogs, { and, eq, not }) => and(
            eq(blogs.categoryId, categoryId),
            not(eq(blogs.id, currentPostId)),
            eq(blogs.published, true)
          ),
          limit: 2,
          with: { category: true },
          orderBy: [desc(blogs.createdAt)]
        });
      }

      if (relatedPosts.length === 0) {
        relatedPosts = await db.query.blogs.findMany({
          where: (blogs, { and, not, eq }) => and(
            not(eq(blogs.id, currentPostId)),
            eq(blogs.published, true)
          ),
          limit: 2,
          with: { category: true },
          orderBy: [desc(blogs.createdAt)]
        });
      }
      return relatedPosts;
    },
    ['related-blogs-data', currentPostId.toString()],
    { tags: ['blogs'], revalidate: CACHE_TTL }
  );
  return getFn();
};
