import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '../../../src/db/index';
import { contacts } from '../../../src/db/schema';
import { verifyTurnstile } from '../../../src/lib/turnstile';

export async function POST(req: Request) {
  try {
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
    const db = getDb(env.DB);

    const body = (await req.json()) as { name: string; email: string; message: string; turnstileToken: string };
    const { name, email, message, turnstileToken } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!turnstileToken) {
      return NextResponse.json({ error: 'Please complete the CAPTCHA' }, { status: 400 });
    }

    const secretKey = env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
    if (secretKey) {
      const isValid = await verifyTurnstile(turnstileToken, secretKey);
      if (!isValid) {
        return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 });
      }
    } else {
      console.warn("TURNSTILE_SECRET_KEY is missing. Skipping CAPTCHA verification.");
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
