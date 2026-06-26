"use client";

import { useState, useTransition } from 'react';
import { Plus, Edit2, Trash2, Tag, Hash } from 'lucide-react';
import { createTag, updateTag, deleteTag } from './actions';

type TagData = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export default function TagsClient({ initialTags }: { initialTags: TagData[] }) {
  const [tags, setTags] = useState(initialTags);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleAddTag = () => {
    if (!newName.trim() || isPending) return;
    const name = newName.trim();
    setNewName('');
    
    // Optimistic update
    const tempId = Date.now();
    setTags([...tags, { id: tempId, name, slug: name.toLowerCase().replace(/\s+/g, '-'), count: 0 }]);
    
    startTransition(async () => {
      try {
        await createTag({ name });
        // Page revalidates, but we could also refresh if we used router.refresh()
      } catch (err) {
        console.error(err);
        setTags(tags); // Revert
      }
    });
  };

  const handleDeleteTag = (id: number) => {
    if (isPending || !confirm("Are you sure you want to delete this tag?")) return;
    const prev = [...tags];
    setTags(tags.filter(t => t.id !== id));
    
    startTransition(async () => {
      try {
        await deleteTag(id);
      } catch (err) {
        console.error(err);
        setTags(prev); // Revert
      }
    });
  };

  const handleStartEdit = (tag: TagData) => {
    setEditId(tag.id);
    setEditName(tag.name);
  };

  const handleSaveEdit = (id: number) => {
    if (!editName.trim() || isPending) {
      setEditId(null);
      return;
    }
    const name = editName.trim();
    const prev = [...tags];
    
    setTags(tags.map(t => t.id === id ? { ...t, name, slug: name.toLowerCase().replace(/\s+/g, '-') } : t));
    setEditId(null);
    setEditName('');
    
    startTransition(async () => {
      try {
        await updateTag(id, { name });
      } catch (err) {
        console.error(err);
        setTags(prev); // Revert
      }
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">Tags</h1>
        <p className="text-sm text-dark-300 mt-1">Manage tags for your blog posts</p>
      </div>

      {/* Add Tag */}
      <div className="admin-card rounded-xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Add New Tag</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tag name..."
            className="admin-input flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            disabled={isPending}
          />
          <button 
            onClick={handleAddTag} 
            disabled={isPending || !newName.trim()}
            className="btn-primary text-sm inline-flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Tags List */}
      <div className="admin-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Slug</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider">Posts</th>
                <th className="px-6 py-4 text-xs uppercase text-dark-300 font-medium tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    {editId === tag.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="admin-input text-sm py-1 px-2"
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(tag.id)}
                        autoFocus
                        disabled={isPending}
                      />
                    ) : (
                      <span className="font-medium text-white flex items-center gap-2">
                        <Tag className="w-4 h-4 text-dark-300" />
                        {tag.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-dark-300 text-xs font-mono">{tag.slug}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs text-dark-200">
                      <Hash className="w-3 h-3" /> {tag.count}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editId === tag.id ? (
                        <button
                          onClick={() => handleSaveEdit(tag.id)}
                          disabled={isPending}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 transition-colors disabled:opacity-50"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(tag)}
                          disabled={isPending}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-300 hover:text-accent-400 hover:bg-accent-500/10 transition-all disabled:opacity-50"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
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

        {tags.length === 0 && (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 text-dark-400 mx-auto mb-4" />
            <p className="text-dark-300 text-sm">No tags yet. Create your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
