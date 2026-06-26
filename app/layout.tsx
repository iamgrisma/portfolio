import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Raksha — Software Developer',
  description: 'Portfolio of Raksha — Software Developer with experience in building web applications. Bachelor in Information Management.',
  keywords: ['Raksha', 'Software Developer', 'Nepal', 'Remote', 'Tech Industry', 'Portfolio'],
  authors: [{ name: 'Raksha' }],
  openGraph: {
    title: 'Raksha — Software Developer',
    description: 'Portfolio of Raksha — Software Developer with experience in building web applications.',
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
