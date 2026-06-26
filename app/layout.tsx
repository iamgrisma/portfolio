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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  );
}
