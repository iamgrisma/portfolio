'use client';

import React, { useState } from 'react';
import { clearCacheByTag, clearAllCaches } from './actions';
import { Database, Info } from 'lucide-react';

export default function CachePage() {
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleClearCache = async (tag: string) => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await clearCacheByTag(tag);
            setMessage({ type: 'success', text: res.message });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || `Failed to clear ${tag} cache` });
        } finally {
            setSaving(false);
        }
    };

    const handleClearAllCaches = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await clearAllCaches();
            setMessage({ type: 'success', text: res.message });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to clear all caches' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cache Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manually invalidate static caches to force fresh data fetches.
                    </p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    message.type === 'success' 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800/30 flex items-start gap-3 text-blue-800 dark:text-blue-300">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold mb-1">Cache Information</p>
                    <p>
                        The application uses Next.js Data Cache integrated with Cloudflare. Because the cache relies on internal tags and is distributed globally across Edge nodes, <strong>it is not possible to view real-time statistics (like size or number of items)</strong>.
                    </p>
                    <p className="mt-2">
                        Furthermore, <strong>there is no dedicated database table for the cache</strong>. The cache is entirely managed by the Next.js and Cloudflare infrastructure at the framework level, which makes it extremely fast and lightweight without requiring manual database maintenance.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Database className="w-5 h-5 text-gray-400" />
                    Manage Cache Tags
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleClearCache('profile')}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50 text-left"
                    >
                        <span className="block text-gray-900 dark:text-white mb-1">Profile Cache</span>
                        <span className="text-xs text-gray-500">Clears About page data</span>
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleClearCache('projects')}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50 text-left"
                    >
                        <span className="block text-gray-900 dark:text-white mb-1">Projects Cache</span>
                        <span className="text-xs text-gray-500">Clears Projects page data</span>
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleClearCache('blogs')}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50 text-left"
                    >
                        <span className="block text-gray-900 dark:text-white mb-1">Blogs Cache</span>
                        <span className="text-xs text-gray-500">Clears Blog pages data</span>
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleClearCache('stats')}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50 text-left"
                    >
                        <span className="block text-gray-900 dark:text-white mb-1">Stats Cache</span>
                        <span className="text-xs text-gray-500">Clears Homepage stats</span>
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleClearCache('socials')}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50 text-left"
                    >
                        <span className="block text-gray-900 dark:text-white mb-1">Socials Cache</span>
                        <span className="text-xs text-gray-500">Clears Footer social links</span>
                    </button>
                </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-900/30">
                <h2 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">Danger Zone</h2>
                <p className="text-sm text-red-700 dark:text-red-300 mb-6">
                    Purging all caches will force the server to regenerate all static pages and data. This may temporarily slow down the site as it rebuilds the cache.
                </p>
                <button
                    type="button"
                    disabled={saving}
                    onClick={handleClearAllCaches}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold text-sm disabled:opacity-50"
                >
                    {saving ? 'Purging...' : 'Purge All Caches'}
                </button>
            </div>
        </div>
    );
}
