import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { media } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

export const runtime = 'edge';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        // @ts-expect-error
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const id = parseInt((await params).id);
        if (isNaN(id)) return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });

        const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
        const db = getDb(env.DB);

        const item = await db.select().from(media).where(eq(media.id, id)).get();
        
        if (!item) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch media' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        // @ts-expect-error
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const id = parseInt((await params).id);
        if (isNaN(id)) return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });

        const body = await req.json();
        
        const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
        const db = getDb(env.DB);

        const [updated] = await db.update(media)
            .set({
                altText: body.alt_text,
                caption: body.caption,
                updatedAt: new Date()
            })
            .where(eq(media.id, id))
            .returning();

        if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update media' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        // @ts-expect-error
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const id = parseInt((await params).id);
        if (isNaN(id)) return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });

        const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
        const db = getDb(env.DB);
        const r2 = env.R2_STORAGE;

        const item = await db.select().from(media).where(eq(media.id, id)).get();
        if (!item) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

        // Delete from R2
        if (r2) {
            await r2.delete(item.r2Key);
        }

        // Delete from DB
        await db.delete(media).where(eq(media.id, id));

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 });
    }
}
