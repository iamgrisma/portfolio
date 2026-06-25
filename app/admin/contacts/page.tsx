"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MOCK_MESSAGES = [
  { id: 1, name: 'Sita Sharma', email: 'sita.sharma@example.com', date: '2023-11-20', message: 'Hello Kamal, I would like to invite you as a guest speaker for our upcoming community program.' },
  { id: 2, name: 'Ram Karki', email: 'ram.karki@example.com', date: '2023-11-18', message: 'Dear Sir, please share more details regarding the recent policy update in the municipality.' }
];

export default function AdminContacts() {
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
          <Link href="/admin/blogs" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Manage Blogs</Link>
          <Link href="/admin/socials" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Social Profiles</Link>
          <Link href="/admin/contacts" className="block px-4 py-2 bg-blue-50 text-blue-800 text-sm font-medium rounded-md border border-blue-100">Messages</Link>
        </aside>
        
        <section className="flex-1 p-6 md:p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Messages</h2>
          
          <div className="flex flex-col gap-4 max-w-4xl">
            {MOCK_MESSAGES.map((msg) => (
              <div key={msg.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 hover:underline">{msg.email}</a>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{msg.date}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {msg.message}
                </p>
                <div className="mt-4 pt-4 flex justify-end">
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded hover:bg-red-50 transition-colors">
                    Delete Message
                  </button>
                </div>
              </div>
            ))}
            
            {MOCK_MESSAGES.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                No messages received yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
