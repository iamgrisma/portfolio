"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

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
          <Link href="/admin" className="block px-4 py-2 bg-blue-50 text-blue-800 text-sm font-medium rounded-md border border-blue-100">Overview</Link>
          <Link href="/admin/blogs" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Manage Blogs</Link>
          <Link href="/admin/socials" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Social Profiles</Link>
          <Link href="/admin/contacts" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Messages</Link>
        </aside>
        
        <section className="flex-1 p-6 md:p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Overview</h2>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 max-w-4xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Welcome Back</h3>
            <p className="text-slate-600">
              This is your portfolio management dashboard. From here you can manage your blog posts, update your social links, and view messages sent through your contact form.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Blog Posts</h3>
              <p className="text-4xl font-bold text-slate-900">3</p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500">Published</span>
                <Link href="/admin/blogs" className="text-blue-600 font-medium hover:text-blue-800">Manage &rarr;</Link>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Messages</h3>
              <p className="text-4xl font-bold text-slate-900">2</p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Received</span>
                <Link href="/admin/contacts" className="text-blue-600 font-medium hover:text-blue-800">View &rarr;</Link>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Social Links</h3>
              <p className="text-4xl font-bold text-slate-900">3</p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500">Active</span>
                <Link href="/admin/socials" className="text-blue-600 font-medium hover:text-blue-800">Edit &rarr;</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
