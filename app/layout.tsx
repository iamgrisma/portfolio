import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { CloudflareEnv } from '@/src/db';
import { getCachedSiteSettings } from '@/src/db/queries';

export async function generateMetadata(): Promise<Metadata> {
  let env: CloudflareEnv | undefined;
  try {
    const ctx = await getCloudflareContext({ async: true }) as any;
    env = ctx.env;
  } catch (e) {
    // build time fallback
  }

  let settings: Record<string, string> = {};
  if (env && env.DB) {
    try {
      settings = await getCachedSiteSettings(env.DB);
    } catch (e) {
      console.warn("Could not fetch settings for layout:", e);
    }
  }

  const title = settings.seoTitle || settings.siteName || 'Raksha — IT Professional';
  const description = settings.seoDescription || 'Portfolio of Raksha — IT Professional with experience in building and supporting robust web applications and government systems.';
  
  return {
    metadataBase: new URL('https://raksha.com.np'),
    title: {
      template: `%s | ${settings.siteName || 'Raksha'}`,
      default: title,
    },
    description,
    keywords: settings.seoKeywords ? settings.seoKeywords.split(',') : ['Raksha', 'IT Professional', 'Nepal', 'Lalitpur', 'Tech Industry', 'Portfolio', 'EFT', 'Government Systems'],
    authors: [{ name: settings.siteName || 'Raksha Mishra' }],
    openGraph: {
      title,
      description,
      url: 'https://raksha.com.np',
      type: 'website',
      locale: 'en_US',
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : [],
    },
    icons: {
      icon: settings.faviconUrl || '/favicon.ico',
    },
  };
}

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="antialiased">
        <NextTopLoader color="#4f46e5" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
