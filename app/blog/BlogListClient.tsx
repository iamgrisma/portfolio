"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock, Search, BookOpen, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';

export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  category: string;
  tags: string[];
  readingTime: string;
  featured: boolean;
};

type SocialLink = {
  id: number;
  platform: string;
  url: string;
  icon: string;
};

export default function BlogListClient({ socials, initialBlogs }: { socials: SocialLink[], initialBlogs: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = initialBlogs.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = initialBlogs.find((p) => p.featured);

  const categories = ['All', ...Array.from(new Set(initialBlogs.map(b => b.category)))];

  return (
    <main className="min-h-screen bg-dark-900 overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 lg:px-8 hero-bg">
        <div className="blob-purple -top-20 right-0 opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto">
            <span className="tag-purple tag mb-6 inline-flex">
              <BookOpen className="w-3 h-3 mr-2" /> Blog
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white font-[var(--font-heading)]">
              Latest <span className="gradient-text-blue">Insights</span>
            </h1>
            <p className="text-dark-200 mt-4">
              Thoughts on IT Systems, tech trends, architecture, and web development.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="px-6 lg:px-8 -mt-4 mb-8">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection animation="fade-up">
              <Link href={`/blog/${featuredPost.slug}`} className="block">
                <article className="glass-card rounded-2xl p-8 sm:p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-500/5 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-500/20 text-accent-400 uppercase tracking-wider">
                        Featured
                      </span>
                      <span className="tag text-[10px]">{featuredPost.category}</span>
                      <span className="text-xs text-dark-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {featuredPost.readingTime}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-[var(--font-heading)] mb-3 group-hover:text-accent-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-dark-200 leading-relaxed max-w-2xl mb-4">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-dark-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-sm text-accent-400 flex items-center gap-1 font-medium group-hover:gap-2 transition-all">
                        Read Article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25'
                        : 'glass text-dark-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-input pl-10 text-sm"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <BookOpen className="w-12 h-12 text-dark-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white font-[var(--font-heading)] mb-2">No posts found</h3>
              <p className="text-dark-300 text-sm">Try a different category or search term.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, i) => (
                <AnimatedSection key={post.id} animation="fade-up" delay={i * 100}>
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <article className="glass-card rounded-2xl p-6 h-full flex flex-col group">
                      <div className="flex items-center justify-between mb-4">
                        <span className="tag text-[10px]">{post.category}</span>
                        <span className="text-xs text-dark-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readingTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white font-[var(--font-heading)] mb-3 group-hover:text-accent-400 transition-colors duration-300 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-dark-200 leading-relaxed flex-1">{post.excerpt}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-dark-300 flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs text-dark-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-sm text-accent-400 flex items-center gap-1 group-hover:gap-2 transition-all font-medium">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </article>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer socials={socials} />
    </main>
  );
}
