import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { media } from '@/src/db/schema';
import { desc, and, eq, like, count, sql } from 'drizzle-orm';
import { auth } from '@/auth';

export const runtime = 'edge';

export async function GET(req: Request) {
    try {
        const session = await auth();
        // @ts-expect-error
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = Math.min(parseInt(searchParams.get('per_page') || '24'), 100);
        const folder = searchParams.get('folder');
        const mimeFilter = searchParams.get('mime_type');
        const search = searchParams.get('search');
        
        const offset = (page - 1) * perPage;

        const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
        const db = getDb(env.DB);

        // Build where conditions
        const conditions = [];

        if (folder && folder !== 'all') {
            conditions.push(eq(media.folder, folder));
        }

        if (mimeFilter) {
            conditions.push(like(media.mimeType, `${mimeFilter}%`));
        }

        if (search) {
            const searchTerm = `%${search}%`;
            conditions.push(
                sql`(${media.filename} LIKE ${searchTerm} OR ${media.originalFilename} LIKE ${searchTerm} OR ${media.altText} LIKE ${searchTerm})`
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Count total
        const [countResult] = await db.select({ value: count() }).from(media).where(whereClause);
        const total = countResult.value;

        // Fetch items
        const items = await db.select()
            .from(media)
            .where(whereClause)
            .orderBy(desc(media.createdAt))
            .limit(perPage)
            .offset(offset);

        return NextResponse.json({
            success: true,
            data: {
                items,
                pagination: {
                    page,
                    per_page: perPage,
                    total,
                    total_pages: Math.ceil(total / perPage)
                }
            }
        });
    } catch (error) {
        console.error('Media list error:', error);
        return NextResponse.json({ success: false, error: 'Failed to list media' }, { status: 500 });
    }
}
