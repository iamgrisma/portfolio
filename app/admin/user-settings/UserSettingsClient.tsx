"use client";

import { useState } from 'react';
import { User, Mail, Image as ImageIcon, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { updateUser } from './actions';
import { useRouter } from 'next/navigation';

export default function UserSettingsClient({ initialUser }: { initialUser: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialUser.name || '',
    email: initialUser.email || '',
    image: initialUser.image || '',
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    try {
      await updateUser(initialUser.id, formData);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to update user');
      setStatus('error');
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-heading)] mb-2">User Account</h1>
          <p className="text-dark-200 text-sm">Manage your admin account details and profile picture.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="shrink-0">
              {formData.image ? (
                <img src={formData.image} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover border border-white/10" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-dark-800 flex items-center justify-center border border-white/10">
                  <User className="w-8 h-8 text-dark-400" />
                </div>
              )}
            </div>
            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-accent-400" />
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all"
                />
                <p className="text-xs text-dark-300 mt-2">Provide a valid image URL for your avatar. You can upload one in the Media Gallery and paste the URL here.</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Details Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-accent-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="john@example.com"
                  className="w-full bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {status === 'success' && (
            <div className="p-4 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center gap-3 text-accent-400">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">User account updated successfully!</p>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={status === 'saving'}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {status === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
