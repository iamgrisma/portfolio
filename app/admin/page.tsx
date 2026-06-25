"use client";

import Link from 'next/link';
import { FileText, MessageSquare, Share2, TrendingUp, Eye, Clock, ArrowRight, Plus } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const STATS = [
  { label: 'Blog Posts', value: '6', change: '+2 this month', icon: FileText, color: 'from-blue-500 to-indigo-500', href: '/admin/blogs' },
  { label: 'Messages', value: '12', change: '3 unread', icon: MessageSquare, color: 'from-accent-500 to-teal-500', href: '/admin/contacts' },
  { label: 'Social Links', value: '3', change: 'All active', icon: Share2, color: 'from-purple-500 to-pink-500', href: '/admin/socials' },
  { label: 'Page Views', value: '1.2K', change: '+15% this week', icon: Eye, color: 'from-amber-500 to-orange-500', href: '/admin' },
];

const RECENT_ACTIVITY = [
  { text: 'Published "Digital Governance in Local Municipalities"', time: '2 hours ago', type: 'blog' },
  { text: 'New message from Sita Sharma', time: '5 hours ago', type: 'message' },
  { text: 'Updated social media links', time: '1 day ago', type: 'social' },
  { text: 'Draft saved: "Livestock Disease Prevention"', time: '2 days ago', type: 'blog' },
  { text: 'New message from Ram Karki', time: '3 days ago', type: 'message' },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl space-y-8">
      {/* Welcome */}
      <AnimatedSection animation="fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white font-[var(--font-heading)]">
              Welcome Back, <span className="gradient-text">Kamal</span>
            </h1>
            <p className="text-dark-200 text-sm mt-1">Here&apos;s what&apos;s happening with your portfolio today.</p>
          </div>
          <Link href="/admin/blogs/new" className="btn-primary inline-flex items-center gap-2 text-sm shrink-0">
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>
      </AnimatedSection>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <AnimatedSection key={stat.label} animation="fade-up" delay={i * 80}>
            <Link href={stat.href} className="block group">
              <div className="admin-card p-6 rounded-xl group-hover:border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-dark-400 group-hover:text-accent-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <p className="text-3xl font-bold text-white font-[var(--font-heading)]">{stat.value}</p>
                <p className="text-sm text-dark-300 mt-1">{stat.label}</p>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-accent-400" />
                  <span className="text-xs text-accent-400">{stat.change}</span>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>

      {/* Content Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <AnimatedSection animation="slide-left" delay={200} className="lg:col-span-3">
          <div className="admin-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-[var(--font-heading)]">Recent Activity</h2>
              <Clock className="w-4 h-4 text-dark-300" />
            </div>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    activity.type === 'blog' ? 'bg-blue-400' :
                    activity.type === 'message' ? 'bg-accent-400' : 'bg-purple-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-100 truncate">{activity.text}</p>
                    <p className="text-xs text-dark-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection animation="slide-right" delay={300} className="lg:col-span-2">
          <div className="admin-card rounded-xl p-6">
            <h2 className="text-lg font-bold text-white font-[var(--font-heading)] mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/blogs/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Write a Post</p>
                  <p className="text-xs text-dark-400">Create new blog content</p>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/admin/contacts" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-accent-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">View Messages</p>
                  <p className="text-xs text-dark-400">3 unread messages</p>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Manage Categories</p>
                  <p className="text-xs text-dark-400">Organize your content</p>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
              <a href="/" target="_blank" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">View Site</p>
                  <p className="text-xs text-dark-400">See your live portfolio</p>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
