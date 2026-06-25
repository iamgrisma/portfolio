"use client";

import { useState, FormEvent } from 'react';
import { Save, Plus, Trash2, ExternalLink, GripVertical } from 'lucide-react';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

const INITIAL_LINKS: SocialLink[] = [
  { id: 1, platform: 'Facebook', url: 'https://facebook.com/kamalbaral', icon: 'facebook' },
  { id: 2, platform: 'Twitter / X', url: 'https://twitter.com/kamalbaral', icon: 'twitter' },
  { id: 3, platform: 'LinkedIn', url: 'https://linkedin.com/in/kamalbaral', icon: 'linkedin' },
];

const PLATFORMS = ['Facebook', 'Twitter / X', 'LinkedIn', 'Instagram', 'YouTube', 'TikTok', 'GitHub', 'Website'];

export default function AdminSocials() {
  const [links, setLinks] = useState<SocialLink[]>(INITIAL_LINKS);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    alert('Social links saved successfully! (Demo mode)');
  };

  const addLink = () => {
    if (!newPlatform || !newUrl) return;
    setLinks([...links, { id: Date.now(), platform: newPlatform, url: newUrl, icon: newPlatform.toLowerCase() }]);
    setNewPlatform('');
    setNewUrl('');
    setShowAdd(false);
  };

  const removeLink = (id: number) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const updateUrl = (id: number, url: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, url } : l)));
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">Social Links</h1>
          <p className="text-sm text-dark-300 mt-1">Manage your social media profiles</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-secondary text-sm inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      {/* Add New Link */}
      {showAdd && (
        <div className="admin-card rounded-xl p-6 animate-fade-in-up">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Add New Social Link</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="admin-input sm:w-48"
            >
              <option value="">Select platform...</option>
              {PLATFORMS.filter((p) => !links.some((l) => l.platform === p)).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="admin-input flex-1"
            />
            <button onClick={addLink} className="btn-primary text-sm shrink-0">
              Add
            </button>
          </div>
        </div>
      )}

      {/* Social Links List */}
      <form onSubmit={handleSave} className="space-y-4">
        {links.map((link) => (
          <div key={link.id} className="admin-card rounded-xl p-5 flex items-center gap-4 group">
            <GripVertical className="w-4 h-4 text-dark-500 shrink-0 cursor-grab" />

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/10 to-teal-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
              <span className="text-accent-400 text-xs font-bold uppercase">
                {link.platform.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white mb-2">{link.platform}</p>
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateUrl(link.id, e.target.value)}
                className="admin-input text-sm"
              />
            </div>

            <div className="flex gap-2 shrink-0">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-300 hover:text-accent-400 transition-all"
                title="Open link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => removeLink(link.id)}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-300 hover:text-red-400 hover:border-red-500/30 transition-all"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <div className="admin-card rounded-xl p-12 text-center">
            <p className="text-dark-300 text-sm">No social links added yet.</p>
          </div>
        )}

        <div className="pt-4 border-t border-white/5">
          <button type="submit" className="btn-primary text-sm inline-flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
