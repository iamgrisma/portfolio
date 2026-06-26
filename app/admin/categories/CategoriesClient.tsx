"use client";

import { useState, useTransition } from 'react';
import { Plus, Edit2, Trash2, FolderOpen, Hash } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from './actions';

type CategoryData = {
  id: number;
  name: string;
  slug: string;
  count: number;
  color: string;
};

export default function CategoriesClient({ initialCategories }: { initialCategories: CategoryData[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#10b981');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleAddCategory = () => {
    if (!newName.trim() || isPending) return;
    const name = newName.trim();
    const color = newColor;
    setNewName('');
    setNewColor('#10b981');
    
    // Optimistic update
    const tempId = Date.now();
    setCategories([...categories, { id: tempId, name, slug: name.toLowerCase().replace(/\s+/g, '-'), count: 0, color }]);
    
    startTransition(async () => {
      try {
        await createCategory({ name, color });
      } catch (err) {
        console.error(err);
        setCategories(categories); // Revert
      }
    });
  };

  const handleDeleteCategory = (id: number) => {
    if (isPending || !confirm("Are you sure you want to delete this category?")) return;
    const prev = [...categories];
    setCategories(categories.filter(c => c.id !== id));
    
    startTransition(async () => {
      try {
        await deleteCategory(id);
      } catch (err) {
        console.error(err);
        setCategories(prev); // Revert
      }
    });
  };

  const handleStartEdit = (cat: CategoryData) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = (id: number) => {
    if (!editName.trim() || isPending) {
      setEditId(null);
      return;
    }
    const name = editName.trim();
    const prev = [...categories];
    
    const targetCat = categories.find(c => c.id === id);
    if (!targetCat) return;
    const color = targetCat.color;

    setCategories(categories.map(c => c.id === id ? { ...c, name, slug: name.toLowerCase().replace(/\s+/g, '-') } : c));
    setEditId(null);
    setEditName('');
    
    startTransition(async () => {
      try {
        await updateCategory(id, { name, color });
      } catch (err) {
        console.error(err);
        setCategories(prev); // Revert
      }
    });
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
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            disabled={isPending}
          />
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-11 h-11 rounded-lg cursor-pointer bg-transparent border border-white/10"
                title="Category color"
                disabled={isPending}
              />
            </div>
            <button 
              onClick={handleAddCategory} 
              disabled={isPending || !newName.trim()}
              className="btn-primary text-sm inline-flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
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
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(cat.id)}
                        autoFocus
                        disabled={isPending}
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
                          onClick={() => handleSaveEdit(cat.id)}
                          disabled={isPending}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 transition-colors disabled:opacity-50"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(cat)}
                          disabled={isPending}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-300 hover:text-accent-400 hover:bg-accent-500/10 transition-all disabled:opacity-50"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={isPending}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-300 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
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
