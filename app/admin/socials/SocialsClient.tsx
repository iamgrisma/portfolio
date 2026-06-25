'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2, ExternalLink, GripVertical } from 'lucide-react';
import { SocialIcon } from '@/src/components/SocialIcon';
import { addSocialProfile, deleteSocialProfile, updateSocialProfileUrl } from './actions';

export const PLATFORMS = [
  'Facebook', 'Twitter / X', 'LinkedIn', 'Instagram', 'YouTube', 'TikTok', 'GitHub', 
  'Snapchat', 'Reddit', 'Pinterest', 'WhatsApp', 'Telegram', 'Discord', 'Twitch', 
  'Medium', 'Dribbble', 'Figma', 'Behance', 'Stack Overflow', 'CodePen', 'GitLab', 
  'Bitbucket', 'Patreon', 'Vimeo', 'SoundCloud', 'Spotify', 'Apple Music', 'Slack', 
  'Mastodon', 'Threads', 'Tumblr', 'Flickr', 'Quora', 'VK', 'WeChat', 'LINE', 'Viber', 
  'Skype', 'Strava', 'Goodreads', 'Yelp', 'TripAdvisor', 'Linktree', 'Substack', 
  'Dev.to', 'Hashnode', 'Codecademy', 'HackerRank', 'LeetCode', 'Upwork', 'Fiverr', 
  'Personal Website', 'Email', 'Phone', 'Other'
];

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

export default function SocialsClient({ initialSocials }: { initialSocials: SocialLink[] }) {
  const router = useRouter();
  const [links, setLinks] = useState<SocialLink[]>(initialSocials);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    if (!newPlatform || !newUrl) return;
    startTransition(async () => {
      await addSocialProfile(newPlatform, newUrl, newPlatform.toLowerCase());
      setNewPlatform('');
      setNewUrl('');
      setShowAdd(false);
      router.refresh();
    });
  };

  const handleRemove = (id: number) => {
    if (!confirm('Are you sure you want to remove this social link?')) return;
    startTransition(async () => {
      await deleteSocialProfile(id);
      router.refresh();
    });
  };

  const handleUpdate = (id: number, url: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, url } : l)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      for (const link of links) {
        const original = initialSocials.find(s => s.id === link.id);
        if (original && original.url !== link.url) {
          await updateSocialProfileUrl(link.id, link.url);
        }
      }
      alert('Changes saved successfully!');
      router.refresh();
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">Social Links</h1>
          <p className="text-sm text-dark-300 mt-1">Manage your social media profiles. Icons are auto-detected!</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-secondary text-sm inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      {showAdd && (
        <div className="admin-card rounded-xl p-6 animate-fade-in-up">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Add New Social Link</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="admin-input sm:w-48"
            >
              <option value="" className="bg-dark-900 text-white">Select platform...</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p} className="bg-dark-900 text-white">{p}</option>
              ))}
            </select>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="admin-input flex-1"
            />
            <button onClick={handleAdd} disabled={isPending || !newPlatform || !newUrl} className="btn-primary text-sm shrink-0 disabled:opacity-50">
              {isPending ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {links.map((link) => (
          <div key={link.id} className="admin-card rounded-xl p-5 flex items-center gap-4 group">
            <GripVertical className="w-4 h-4 text-dark-500 shrink-0 cursor-grab" />

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/10 to-teal-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
              <SocialIcon platform={link.platform} className="w-5 h-5 text-accent-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white mb-2">{link.platform}</p>
              <input
                type="url"
                value={link.url}
                onChange={(e) => handleUpdate(link.id, e.target.value)}
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
                onClick={() => handleRemove(link.id)}
                disabled={isPending}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-300 hover:text-red-400 hover:border-red-500/30 transition-all disabled:opacity-50"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <div className="admin-card rounded-xl p-12 text-center">
            <p className="text-dark-300 text-sm">No social links added yet. Click Add Link to get started!</p>
          </div>
        )}

        {links.length > 0 && (
          <div className="pt-4 border-t border-white/5">
            <button type="submit" disabled={isPending} className="btn-primary text-sm inline-flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
