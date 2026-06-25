"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, FileText, FolderOpen, MessageSquare,
  Share2, LogOut, ChevronRight, User
} from 'lucide-react';

const SIDEBAR_LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/blogs', label: 'Blog Posts', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/contacts', label: 'Messages', icon: MessageSquare },
  { href: '/admin/socials', label: 'Social Links', icon: Share2 },
];

export default function AdminLayoutClient({ children, unreadCount }: { children: ReactNode, unreadCount: number }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Admin Header */}
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm transition-transform duration-300 group-hover:scale-110">
              KB
            </div>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Link href="/" className="text-dark-300 hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-dark-400" />
            <span className="text-white font-medium">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-dark-200 hidden sm:inline">Admin</span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm text-dark-200 hover:text-white glass hover:border-red-500/30 transition-all duration-300 cursor-pointer relative z-20"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-16 lg:w-64 shrink-0 border-r border-white/5 bg-dark-800/50 flex flex-col py-6 overflow-y-auto">
          <nav className="space-y-1 px-3">
            {SIDEBAR_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group relative ${
                    isActive
                      ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                      : 'text-dark-200 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <link.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-accent-400' : 'text-dark-300 group-hover:text-white'} transition-colors`} />
                  <span className="hidden lg:inline flex-1">{link.label}</span>
                  {link.label === 'Messages' && unreadCount > 0 && (
                    <span className="absolute lg:relative right-2 lg:right-auto top-2 lg:top-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-red-500/20">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto px-3 hidden lg:block">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-[10px] text-dark-300 uppercase tracking-widest mb-1">Portfolio CMS</p>
              <p className="text-xs text-dark-200">v1.0.0</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
