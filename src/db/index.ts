import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// CloudFlare env type for D1
export interface CloudflareEnv {
  DB: D1Database;
  R2_STORAGE: R2Bucket;
  APP_ENV?: string;
  TURNSTILE_SECRET_KEY?: string;
  BREVO_API_KEY?: string;
}

/**
 * Get a Drizzle database instance from a D1 binding.
 * Use this in API routes and server components:
 *
 * ```ts
 * import { getCloudflareContext } from '@opennextjs/cloudflare';
 * import { getDb } from '@/src/db';
 *
 * const { env } = await getCloudflareContext();
 * const db = getDb(env.DB);
 * ```
 */
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema });
}
