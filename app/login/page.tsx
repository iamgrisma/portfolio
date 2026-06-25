"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    alert('Authentication would be handled here.');
    router.push('/admin');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans overflow-hidden relative">
      <Link href="/" className="absolute top-8 left-8 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">&larr; Back to Home</Link>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-sm w-full relative z-10">
        <div className="w-12 h-12 bg-blue-800 rounded flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">KB</div>
        <h1 className="text-xl font-bold tracking-tight mb-2 text-slate-900">Admin Login</h1>
        <p className="text-slate-500 mb-8 text-sm">Sign in to access your dashboard</p>
        
        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-800 text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors"
        >
          Sign in with Google
        </button>
      </div>

      <footer className="absolute bottom-0 w-full bg-white border-t border-slate-200 px-8 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Kamal Baral. All rights reserved.</p>
      </footer>
    </main>
  );
}
