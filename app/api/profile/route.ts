import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export const runtime = 'edge';

export async function GET() {
    try {
        const session = await auth();
        // @ts-expect-error
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
        const db = getDb(env.DB);
        
        const user = await db.select({
            id: users.id,
            email: users.email,
            name: users.name,
            image: users.image,
            hasPassword: users.password
        }).from(users).where(eq(users.email, session.user!.email!)).get();
        
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            data: {
                email: user.email,
                name: user.name,
                image: user.image,
                hasPassword: !!user.hasPassword
            } 
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        // @ts-expect-error
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body: any = await req.json();
        const { name, email, image, password } = body;
        
        const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
        const db = getDb(env.DB);

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (image !== undefined) updateData.image = image;
        
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(updateData).length > 0) {
            await db.update(users)
                .set(updateData)
                .where(eq(users.email, session.user!.email!));
        }

        return NextResponse.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
    }
}
