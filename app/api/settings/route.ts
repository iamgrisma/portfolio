import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { siteSettings } from '@/src/db/schema';
import { auth } from '@/auth';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
        const db = getDb(env.DB);
        
        const settings = await db.select().from(siteSettings).all();
        
        // Convert to key-value object
        const settingsMap = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {} as Record<string, string>);
        
        return NextResponse.json({ success: true, data: settingsMap });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        // @ts-expect-error
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body: any = await req.json();
        
        const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
        const db = getDb(env.DB);

        // Update all provided settings
        const entries = Object.entries(body);
        
        for (const [key, value] of entries) {
            if (typeof value === 'string') {
                await db.insert(siteSettings)
                    .values({ key, value, updatedAt: new Date() })
                    .onConflictDoUpdate({
                        target: siteSettings.key,
                        set: { value, updatedAt: new Date() }
                    });
            }
        }

        return NextResponse.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
    }
}
