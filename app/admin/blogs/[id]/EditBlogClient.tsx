"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Tag, ImageIcon } from 'lucide-react';
import { updateBlog } from '../actions';

const CATEGORIES = ['Governance', 'Community', 'Policy', 'Veterinary', 'Health'];
const AVAILABLE_TAGS = ['Digital', 'Government', 'Technology', 'Nepal', 'Outreach', 'Inclusion', 'Planning', 'Future', 'Innovation', 'Livestock', 'Disease', 'Prevention', 'Zoonotic', 'Public Health', 'Rural', 'Empowerment'];

export default function EditBlogClient({ initialBlog }: { initialBlog: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialBlog.title || '');
  const [slug, setSlug] = useState(initialBlog.slug || '');
  const [category, setCategory] = useState(initialBlog.categoryName || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialBlog.tagNames || []);
  const [content, setContent] = useState(initialBlog.content || '');
  const [excerpt, setExcerpt] = useState(initialBlog.excerpt || '');
  const [published, setPublished] = useState(initialBlog.published || false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    try {
      if (!title || !content) {
        alert("Title and content are required.");
        return;
      }
      await updateBlog(initialBlog.id, {
        title,
        slug,
        content,
        excerpt,
        published,
        categoryName: category,
        tagNames: selectedTags
      });
      alert('Post updated successfully!');
      router.push('/admin/blogs');
    } catch (error: any) {
      alert(error.message || "Failed to update post");
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-200 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">Edit Blog Post</h1>
            <p className="text-sm text-dark-300 mt-0.5">Update your existing article</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/blog/${slug}`} target="_blank" className="btn-secondary text-sm inline-flex items-center gap-2">
            <Eye className="w-4 h-4" /> Preview
          </Link>
          <button onClick={handleSave} className="btn-primary text-sm inline-flex items-center gap-2">
            <Save className="w-4 h-4" /> {published ? 'Update & Publish' : 'Save Draft'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="admin-card rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">Post Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter your post title..."
                className="admin-input text-lg font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark-400">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-slug"
                  className="admin-input flex-1 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="admin-card rounded-xl p-6">
            <label className="block text-sm font-medium text-dark-100 mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Brief summary of your post..."
              className="admin-input resize-none text-sm"
            />
            <p className="text-xs text-dark-400 mt-2">This appears in blog listing cards and SEO descriptions.</p>
          </div>

          {/* Content */}
          <div className="admin-card rounded-xl p-6">
            <label className="block text-sm font-medium text-dark-100 mb-2">Content</label>
            <div className="glass rounded-lg p-2 mb-3 flex gap-1 flex-wrap">
              {['B', 'I', 'U', 'H1', 'H2', 'H3', '•', '1.', '"', '🔗', '📷'].map((btn) => (
                <button key={btn} className="w-8 h-8 rounded text-xs font-bold text-dark-200 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                  {btn}
                </button>
              ))}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              placeholder="Write your blog post content here... (Supports Markdown)"
              className="admin-input resize-none text-sm font-mono leading-relaxed"
            />
            <p className="text-xs text-dark-400 mt-2">Supports Markdown formatting.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="admin-card rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Publish</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-200">Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-600 peer-focus:ring-2 peer-focus:ring-accent-500/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
              </label>
            </div>
            <p className="text-xs text-dark-400">
              {published ? 'This post will be visible to everyone.' : 'This post will be saved as a draft.'}
            </p>
          </div>

          {/* Category */}
          <div className="admin-card rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Category</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="admin-input text-sm"
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Link href="/admin/categories" className="text-xs text-accent-400 hover:text-accent-300 transition-colors">
              + Manage categories
            </Link>
          </div>

          {/* Tags */}
          <div className="admin-card rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4" /> Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    selectedTags.includes(tag)
                      ? 'bg-accent-500 text-white shadow-sm'
                      : 'glass text-dark-300 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-xs text-dark-400">{selectedTags.length} tag(s) selected</p>
            )}
          </div>

          {/* Featured Image */}
          <div className="admin-card rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Featured Image</h3>
            <div className="glass rounded-xl p-8 border-dashed border-2 border-white/10 text-center hover:border-accent-500/30 transition-colors cursor-pointer">
              <ImageIcon className="w-8 h-8 text-dark-400 mx-auto mb-2" />
              <p className="text-xs text-dark-300">Click to upload image</p>
              <p className="text-[10px] text-dark-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
