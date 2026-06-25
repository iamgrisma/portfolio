"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ExternalLink, Search, Filter, Tag } from 'lucide-react';
import { deleteBlog } from './actions';

export default function BlogListClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = initialBlogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    const blogStatus = blog.published ? 'Published' : 'Draft';
    const matchesStatus = statusFilter === 'All' || blogStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteBlog(id);
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">Blog Posts</h1>
          <p className="text-sm text-dark-300 mt-1">{initialBlogs.length} total posts</p>
        </div>
        <Link href="/admin/blogs/new" className="btn-primary inline-flex items-center gap-2 text-sm shrink-0">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Published', 'Draft'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                statusFilter === status
                  ? 'bg-accent-500 text-white'
                  : 'glass text-dark-200 hover:text-white'
              }`}
            >
              <Filter className="w-3 h-3 inline mr-1" />
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Tags</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((blog) => (
                <tr key={blog.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white max-w-xs truncate">{blog.title}</td>
                  <td className="px-6 py-4">
                    <span className="tag text-[10px]">{blog.categoryName || 'Uncategorized'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {blog.tagNames.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-dark-300 flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5" /> {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      blog.published
                        ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-dark-300 text-xs">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/blog/${blog.slug}`} target="_blank" className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-300 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="View">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/blogs/${blog.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-300 hover:text-accent-400 hover:bg-accent-500/10 transition-all" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(blog.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-300 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-dark-300 text-sm">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
