"use client";

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-dark-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="blob-green top-0 -left-32 opacity-20" />
      <div className="blob-teal bottom-0 right-0 opacity-15" />

      <div className="text-center relative z-10 animate-fade-in-up">
        <h1 className="text-8xl sm:text-9xl font-bold gradient-text font-[var(--font-heading)] mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-[var(--font-heading)] mb-4">
          Page Not Found
        </h2>
        <p className="text-dark-200 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <button
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="btn-secondary inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
