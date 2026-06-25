import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '../../../src/db/index';
import { contacts } from '../../../src/db/schema';

export async function POST(req: Request) {
  try {
    const { env } = (await getCloudflareContext()) as unknown as { env: CloudflareEnv };
    const db = getDb(env.DB);

    const body = (await req.json()) as { name: string; email: string; message: string };
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.insert(contacts).values({
      name,
      email,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
