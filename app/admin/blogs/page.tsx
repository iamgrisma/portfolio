"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

const MOCK_BLOGS = [
  { id: 1, title: 'Digital Governance in Local Municipalities', status: 'Published', date: '2023-10-15' },
  { id: 2, title: 'Community Outreach Strategies for 2024', status: 'Draft', date: '2023-11-02' },
  { id: 3, title: 'The Future of Public Administration', status: 'Published', date: '2023-12-10' }
];

export default function AdminBlogs() {
  const router = useRouter();

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
          <Link href="/admin/blogs" className="block px-4 py-2 bg-blue-50 text-blue-800 text-sm font-medium rounded-md border border-blue-100">Manage Blogs</Link>
          <Link href="/admin/socials" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Social Profiles</Link>
          <Link href="/admin/contacts" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Messages</Link>
        </aside>
        
        <section className="flex-1 p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6 max-w-5xl">
            <h2 className="text-2xl font-bold text-slate-900">Manage Blogs</h2>
            <button className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors">
              <Plus className="w-4 h-4" /> New Post
            </button>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-5xl">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-medium text-slate-500">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {MOCK_BLOGS.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{blog.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${blog.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{blog.date}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors" title="View"><ExternalLink className="w-4 h-4" /></button>
                      <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
