"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col items-center overflow-hidden">
      <header className="w-full bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-800 rounded flex items-center justify-center text-white font-bold text-xl">KB</div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900">Kamal Baral</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Government of Nepal &bull; Sindhuli</p>
          </div>
        </div>
        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">&larr; Back to Home</Link>
      </header>

      <div className="flex-1 w-full overflow-auto flex flex-col items-center">
        <section className="w-full max-w-lg mt-16 px-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-16">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Get in Touch
            </h2>
            <p className="text-sm text-slate-500 mb-6">Send a message and I&apos;ll get back to you soon.</p>

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-md">
                <h3 className="text-sm font-bold mb-2">Message Sent!</h3>
                <p className="text-xs">Thank you for reaching out. Your message has been received.</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-[10px] font-bold uppercase tracking-widest text-green-700 hover:text-green-900">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input type="text" id="name" name="name" required placeholder="Full Name" className="w-full text-sm border border-slate-200 p-3 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors" />
                </div>
                <div>
                  <input type="email" id="email" name="email" required placeholder="Email Address" className="w-full text-sm border border-slate-200 p-3 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors" />
                </div>
                <div>
                  <textarea id="message" name="message" rows={5} required placeholder="Message content..." className="w-full text-sm border border-slate-200 p-3 rounded-lg bg-slate-50 h-32 resize-none focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"></textarea>
                </div>
                
                {status === 'error' && (
                  <p className="text-xs text-red-600">Failed to send message. Please try again later.</p>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-blue-800 text-white py-3 rounded-lg text-sm font-bold tracking-wide hover:bg-blue-900 disabled:opacity-50 transition-colors"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </section>

        <footer className="w-full bg-white border-t border-slate-200 px-8 py-6 mt-auto flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Kamal Baral. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
