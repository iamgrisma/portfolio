import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://raksha.com.np'),
  title: 'Raksha — IT Professional',
  description: 'Portfolio of Raksha — IT Professional with experience in building and supporting robust web applications and government systems.',
  keywords: ['Raksha', 'IT Professional', 'Nepal', 'Lalitpur', 'Tech Industry', 'Portfolio', 'EFT', 'Government Systems'],
  authors: [{ name: 'Raksha Mishra' }],
  openGraph: {
    title: 'Raksha — IT Professional',
    description: 'Portfolio of Raksha — IT Professional with experience in building and supporting robust web applications and government systems.',
    url: 'https://raksha.com.np',
    type: 'website',
    locale: 'en_US',
  },
};

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
