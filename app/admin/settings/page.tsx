'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, updateSiteSettings } from '@/src/lib/apiClient';
import MediaPicker from '../components/MediaPicker';
import { Settings, Save, Globe, Image as ImageIcon, Link as LinkIcon, Trash2 } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({
        siteName: '',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        logoUrl: '',
        faviconUrl: '',
        ogImageUrl: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<'logoUrl' | 'faviconUrl' | 'ogImageUrl' | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res: any = await getSiteSettings();
            if (res.success && res.data) {
                setSettings((prev) => ({ ...prev, ...res.data }));
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        
        try {
            const res: any = await updateSiteSettings(settings);
            if (res.success) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });
            } else {
                setMessage({ type: 'error', text: res.error || 'Failed to save settings' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    const openMediaPicker = (target: 'logoUrl' | 'faviconUrl' | 'ogImageUrl') => {
        setMediaPickerTarget(target);
        setMediaPickerOpen(true);
    };

    const handleMediaSelect = (media: { url: string; alt?: string; id: number }) => {
        if (mediaPickerTarget) {
            setSettings(prev => ({ ...prev, [mediaPickerTarget]: media.url }));
        }
        setMediaPickerTarget(null);
    };

    const renderImageField = (name: 'logoUrl' | 'faviconUrl' | 'ogImageUrl', label: string, description: string) => (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {label}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{description}</p>
            
            <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center overflow-hidden relative group shrink-0">
                    {settings[name] ? (
                        <>
                            <img src={settings[name]} alt={label} className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    type="button"
                                    onClick={() => setSettings(prev => ({ ...prev, [name]: '' }))}
                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                    )}
                </div>
                
                <div className="flex-1 space-y-3">
                    <button
                        type="button"
                        onClick={() => openMediaPicker(name)}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-sm"
                    >
                        Choose from Library
                    </button>
                    <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            name={name}
                            value={settings[name] || ''}
                            onChange={handleChange}
                            placeholder="Or paste URL here..."
                            className="flex-1 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Settings className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings & SEO</h1>
                    <p className="text-gray-500 dark:text-gray-400">Configure global site settings, metadata, and branding.</p>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    message.type === 'success' 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                
                {/* General Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-400" />
                        General Information
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Site Name</label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName || ''}
                                onChange={handleChange}
                                placeholder="My Awesome Portfolio"
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                            />
                        </div>
                    </div>
                </div>

                {/* Branding & Media */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                        Branding & Media
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderImageField('logoUrl', 'Site Logo', 'Displayed in the header/navbar.')}
                        {renderImageField('faviconUrl', 'Favicon', 'Small icon displayed in browser tabs (.ico or .png).')}
                        <div className="md:col-span-2">
                            {renderImageField('ogImageUrl', 'Default Social/OG Image', 'The default image shown when sharing your site on social media.')}
                        </div>
                    </div>
                </div>

                {/* SEO Metadata */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-400" />
                        SEO Metadata
                    </h2>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">SEO Title (Default)</label>
                            <p className="text-xs text-gray-500 mb-2">Used as the default &lt;title&gt; tag for pages without a specific title.</p>
                            <input
                                type="text"
                                name="seoTitle"
                                value={settings.seoTitle || ''}
                                onChange={handleChange}
                                placeholder="Raksha | Professional Developer"
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">SEO Description</label>
                            <p className="text-xs text-gray-500 mb-2">The default meta description for search engines.</p>
                            <textarea
                                name="seoDescription"
                                value={settings.seoDescription || ''}
                                onChange={handleChange}
                                placeholder="Welcome to my personal portfolio. I am a full-stack developer..."
                                rows={3}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow resize-y"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">SEO Keywords</label>
                            <p className="text-xs text-gray-500 mb-2">Comma separated list of keywords (e.g. developer, react, nextjs, portfolio).</p>
                            <input
                                type="text"
                                name="seoKeywords"
                                value={settings.seoKeywords || ''}
                                onChange={handleChange}
                                placeholder="web development, nextjs, react"
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-70 transition-colors shadow-lg shadow-indigo-600/20"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>

            <MediaPicker
                isOpen={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={handleMediaSelect}
                title="Select Image"
                accept="image/*"
            />
        </div>
    );
}
