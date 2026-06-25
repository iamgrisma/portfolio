"use client";

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save } from 'lucide-react';

export default function AdminSocials() {
  const router = useRouter();

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    alert('Social links saved successfully.');
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
      <header className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-800 rounded flex items-center justify-center text-white font-bold text-xl">KB</div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900">Admin Dashboard</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Management Console</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-600 hidden sm:inline">Admin User</span>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200 hover:bg-slate-200 transition-colors text-sm font-medium text-slate-600"
          >
            Logout
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row w-full overflow-auto">
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2 p-4 md:p-8 bg-white border-r border-slate-200">
          <Link href="/admin" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Overview</Link>
          <Link href="/admin/blogs" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Manage Blogs</Link>
          <Link href="/admin/socials" className="block px-4 py-2 bg-blue-50 text-blue-800 text-sm font-medium rounded-md border border-blue-100">Social Profiles</Link>
          <Link href="/admin/contacts" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Messages</Link>
        </aside>
        
        <section className="flex-1 p-6 md:p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Social Profiles</h2>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-3xl">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
                <input type="url" defaultValue="https://linkedin.com/in/kamalbaral" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Twitter / X URL</label>
                <input type="url" defaultValue="https://twitter.com/kamalbaral" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Facebook URL</label>
                <input type="url" defaultValue="https://facebook.com/kamalbaral" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-600" />
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button type="submit" className="flex items-center gap-2 bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
