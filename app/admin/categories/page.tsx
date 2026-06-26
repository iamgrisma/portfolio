"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2, FolderOpen, Hash } from 'lucide-react';

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Governance', slug: 'governance', count: 1, color: '#3b82f6' },
  { id: 2, name: 'Community', slug: 'community', count: 2, color: '#10b981' },
  { id: 3, name: 'Policy', slug: 'policy', count: 1, color: '#8b5cf6' },
  { id: 4, name: 'IT Systems', slug: 'IT Systems', count: 1, color: '#f59e0b' },
  { id: 5, name: 'Health', slug: 'health', count: 1, color: '#ef4444' },
];

export default function AdminCategories() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#10b981');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const addCategory = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/\s+/g, '-');
    setCategories([...categories, { id: Date.now(), name: newName, slug, count: 0, color: newColor }]);
    setNewName('');
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const startEdit = (cat: typeof INITIAL_CATEGORIES[0]) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = (id: number) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, name: editName, slug: editName.toLowerCase().replace(/\s+/g, '-') } : c)));
    setEditId(null);
    setEditName('');
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">Categories</h1>
        <p className="text-sm text-dark-300 mt-1">Organize your blog posts into categories</p>
      </div>

      {/* Add Category */}
      <div className="admin-card rounded-xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Add New Category</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name..."
            className="admin-input flex-1"
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          />
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-11 h-11 rounded-lg cursor-pointer bg-transparent border border-white/10"
                title="Category color"
              />
            </div>
            <button onClick={addCategory} className="btn-primary text-sm inline-flex items-center gap-2 shrink-0">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="admin-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Color</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Slug</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Posts</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: cat.color }} />
                  </td>
                  <td className="px-6 py-4">
                    {editId === cat.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="admin-input text-sm py-1 px-2"
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(cat.id)}
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium text-white flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-dark-300" />
                        {cat.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-dark-300 text-xs font-mono">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs text-dark-200">
                      <Hash className="w-3 h-3" /> {cat.count}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editId === cat.id ? (
                        <button
                          onClick={() => saveEdit(cat.id)}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 transition-colors"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(cat)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-300 hover:text-accent-400 hover:bg-accent-500/10 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length === 0 && (
          <div className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-dark-400 mx-auto mb-4" />
            <p className="text-dark-300 text-sm">No categories yet. Create your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
