import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '../../../src/db/index';
import { contacts } from '../../../src/db/schema';
import { verifyTurnstile } from '../../../src/lib/turnstile';

export async function POST(req: Request) {
  try {
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
    const db = getDb(env.DB);

    const body = (await req.json()) as { 
      type?: string;
      name: string; 
      email: string; 
      phone?: string;
      service?: string;
      projectType?: string;
      date?: string;
      time?: string;
      message?: string; 
      turnstileToken: string;
    };
    const { type = 'contact', name, email, phone, service, projectType, date, time, message, turnstileToken } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (type === 'booking' && !phone) {
      return NextResponse.json({ error: 'Phone number is required for bookings' }, { status: 400 });
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
      type,
      name,
      email,
      phone,
      service,
      projectType,
      date,
      time,
      message,
    });

    // Send email via Brevo
    const brevoKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY;
    if (brevoKey) {
      try {
        const subject = type === 'booking' ? `New Booking Request from ${name}` : `New Contact Message from ${name}`;
        
        let htmlContent = `<h2>${subject}</h2>`;
        htmlContent += `<p><strong>Name:</strong> ${name}</p>`;
        htmlContent += `<p><strong>Email:</strong> ${email}</p>`;
        if (phone) htmlContent += `<p><strong>Phone:</strong> ${phone}</p>`;
        if (service) htmlContent += `<p><strong>Service:</strong> ${service}</p>`;
        if (projectType) htmlContent += `<p><strong>Project Type:</strong> ${projectType}</p>`;
        if (date) htmlContent += `<p><strong>Date:</strong> ${date}</p>`;
        if (time) htmlContent += `<p><strong>Time:</strong> ${time}</p>`;
        if (message) htmlContent += `<br /><p><strong>Message:</strong></p><p>${message}</p>`;

        const payload = {
          sender: { email: 'contact@raksha.com.np', name: 'Raksha Portfolio' },
          to: [{ email: 'contact@raksha.com.np', name: 'Raksha' }],
          replyTo: { email, name },
          subject,
          htmlContent
        };

        const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': brevoKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!emailRes.ok) {
          console.error('Brevo API error:', await emailRes.text());
        }
      } catch (err) {
        console.error('Failed to send email:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
