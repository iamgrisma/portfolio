import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kamal Baral — Veterinary Technician & Public Servant',
  description: 'Portfolio of Kamal Baral — Veterinary Technician with 8+ years of experience at the Government of Nepal, Sindhuli. JTA, Diploma in Veterinary Science, Bachelor in Political Science.',
  keywords: ['Kamal Baral', 'Veterinary Technician', 'Nepal', 'Sindhuli', 'Government of Nepal', 'Portfolio'],
  authors: [{ name: 'Kamal Baral' }],
  openGraph: {
    title: 'Kamal Baral — Veterinary Technician & Public Servant',
    description: 'Portfolio of Kamal Baral — Veterinary Technician with 8+ years of experience serving communities in Sindhuli, Nepal.',
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
