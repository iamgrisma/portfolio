import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { media } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';



function sanitizeFilename(filename: string): string {
    const parts = filename.split('.');
    const ext = parts.pop() || '';
    const base = parts.join('.');
    
    const safeBase = base
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_+|_+$/g, '');
        
    return `${safeBase || 'file'}.${ext}`;
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        // @ts-expect-error
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        let folder = formData.get('folder') as string;

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ success: false, error: 'No file uploaded or invalid file format' }, { status: 400 });
        }

        if (!folder) {
            folder = 'Other Media';
        }

        // Limit maximum upload size to 50MB
        const MAX_SIZE = 50 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ success: false, error: 'File size exceeds 50MB limit' }, { status: 400 });
        }

        const originalName = file.name || 'unnamed_file';
        const fileExtension = originalName.split('.').pop()?.toLowerCase() || '';
        const mimeType = file.type || 'application/octet-stream';
        
        const cleanName = sanitizeFilename(originalName);
        const nameParts = cleanName.split('.');
        const ext = nameParts.pop() || '';
        const baseName = nameParts.join('.');

        const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
        const db = getDb(env.DB);
        const r2 = env.R2_STORAGE;

        if (!r2) {
             return NextResponse.json({ success: false, error: 'R2 bucket not bound' }, { status: 500 });
        }

        // Try clean key first, only add _01/_02 suffix on collision
        const folderPath = folder.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        let uniqueKey = `${folderPath}/${baseName}.${ext}`;
        
        const existing = await db.select().from(media).where(eq(media.r2Key, uniqueKey)).get();

        if (existing) {
            // Find next available suffix
            let counter = 1;
            while (counter < 100) {
                const suffix = String(counter).padStart(2, '0');
                const candidateKey = `${folderPath}/${baseName}_${suffix}.${ext}`;
                const check = await db.select().from(media).where(eq(media.r2Key, candidateKey)).get();
                if (!check) {
                    uniqueKey = candidateKey;
                    break;
                }
                counter++;
            }
        }

        const arrayBuffer = await file.arrayBuffer();

        // Put the file into R2 bucket
        await r2.put(uniqueKey, arrayBuffer, {
            httpMetadata: {
                contentType: mimeType,
                cacheControl: 'public, max-age=31536000, immutable'
            }
        });

        // The public URL served via custom subdomain (with cache rule)
        const publicUrl = `https://storage.raksha.com.np/${uniqueKey}`;

        // Get the user ID from the session, if we have it in the users table by email
        // We need the internal integer ID for 'uploaded_by'
        const currentUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, session.user!.email!)
        });

        // Insert into media table
        const [insertedMedia] = await db.insert(media).values({
            filename: cleanName,
            originalFilename: originalName,
            r2Key: uniqueKey,
            url: publicUrl,
            mimeType,
            size: file.size,
            folder: folder,
            uploadedBy: currentUser?.id || null
        }).returning();

        return NextResponse.json({
            success: true,
            message: 'File uploaded successfully',
            data: insertedMedia
        });
    } catch (error) {
        console.error('Media upload error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown upload error'
        }, { status: 500 });
    }
}
