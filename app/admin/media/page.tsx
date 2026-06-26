'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { uploadMedia, getMediaList, deleteMedia, updateMedia } from '@/src/lib/apiClient';
import ImageCompressorModal from '../components/ImageCompressorModal';
import { UploadCloud, File as FileIcon, FileVideo, FileAudio, FileText, Copy, Trash2, Search, Filter } from 'lucide-react';
import { FOLDER_OPTIONS } from '../components/MediaPicker';

interface MediaItem {
    id: number;
    filename: string;
    originalFilename: string;
    r2Key: string;
    url: string;
    altText: string;
    caption: string;
    mimeType: string;
    size: number;
    folder: string;
    createdAt: string;
}

const FOLDER_FILTERS = [
    { label: 'All Folders', value: 'all' },
    ...FOLDER_OPTIONS
];

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MediaGalleryPage() {
    const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [folder, setFolder] = useState('all');
    const [uploadFolder, setUploadFolder] = useState('Other Media');
    const [search, setSearch] = useState('');
    const [searchDebounced, setSearchDebounced] = useState('');

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pendingImage, setPendingImage] = useState<File | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setSearchDebounced(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    const loadMedia = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getMediaList(
                page,
                24,
                folder,
                '',
                searchDebounced
            );
            if (response.success && response.data) {
                setItems(response.data.items || []);
                setTotalPages(response.data.pagination?.total_pages || 1);
            }
        } catch (error) {
            console.error('Failed to load media:', error);
        } finally {
            setLoading(false);
        }
    }, [page, folder, searchDebounced]);

    useEffect(() => {
        loadMedia();
    }, [loadMedia]);

    const doActualUpload = async (file: File) => {
        setUploading(true);
        setUploadError('');
        try {
            const response = await uploadMedia(file, uploadFolder);
            if (response.success && response.data) {
                setActiveTab('library');
                setPage(1);
                setFolder('all');
                setSearch('');
                await loadMedia();
                setSelectedItem(response.data);
            } else {
                setUploadError(response.error || 'Upload failed');
            }
        } catch (err: any) {
            setUploadError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = async (file: File) => {
        if (file.type.startsWith('image/')) {
            setPendingImage(file);
        } else {
            await doActualUpload(file);
        }
    };

    const handleCompressConfirm = async (compressedFile: File) => {
        setPendingImage(null);
        await doActualUpload(compressedFile);
    };

    const handleCompressCancel = () => {
        setPendingImage(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) handleUpload(files[0]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) handleUpload(files[0]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Permanently delete this file? This cannot be undone.')) return;
        try {
            await deleteMedia(id);
            setSelectedItem(null);
            await loadMedia();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleUpdateMeta = async (field: 'altText' | 'caption', value: string) => {
        if (!selectedItem) return;
        const updated = { ...selectedItem, [field]: value };
        setSelectedItem(updated);
        try {
            await updateMedia(selectedItem.id, {
                alt_text: updated.altText,
                caption: updated.caption
            });
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const isImage = (mime: string) => mime.startsWith('image/');

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Gallery</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all your uploaded images and files.</p>
                </div>
                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={() => setActiveTab('library')}
                        className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === 'library'
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Library
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === 'upload'
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Upload New
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                {activeTab === 'upload' ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/50 dark:bg-gray-900/50">
                        
                        <div className="mb-6 w-full max-w-2xl">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Upload Destination Folder
                            </label>
                            <select 
                                value={uploadFolder}
                                onChange={(e) => setUploadFolder(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                            >
                                {FOLDER_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 bg-white dark:bg-gray-800 ${
                                dragOver
                                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.02]'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:shadow-md'
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileInput}
                                className="hidden"
                            />
                            {uploading ? (
                                <div className="space-y-6">
                                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">Uploading to R2 Storage...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-center text-indigo-500/30 dark:text-indigo-400/30">
                                        <UploadCloud className="w-24 h-24" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                            Drop files here or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                                            Max file size: 50MB • Images will be automatically compressed
                                        </p>
                                    </div>
                                </div>
                            )}
                            {uploadError && (
                                <p className="mt-6 text-red-600 dark:text-red-400 font-medium p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">{uploadError}</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex overflow-hidden">
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                    <select 
                                        value={folder}
                                        onChange={(e) => { setFolder(e.target.value); setPage(1); }}
                                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-8 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm font-medium"
                                    >
                                        {FOLDER_FILTERS.map(f => (
                                            <option key={f.value} value={f.value}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative flex-1 max-w-md ml-auto">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                        placeholder="Search media..."
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 dark:bg-gray-900/20">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                        <UploadCloud className="w-20 h-20 mb-6 text-gray-300 dark:text-gray-600" />
                                        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">No media found</p>
                                        <p className="mt-2">Upload files to this folder to get started.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {items.map((item) => (
                                            <button
                                                type="button"
                                                key={item.id}
                                                onClick={() => setSelectedItem(item === selectedItem ? null : item)}
                                                className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                                                    selectedItem?.id === item.id
                                                        ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-[0.98]'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
                                                }`}
                                            >
                                                {isImage(item.mimeType) ? (
                                                    <img
                                                        src={item.url}
                                                        alt={item.altText || item.filename}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-gray-400 dark:text-gray-500">
                                                        {item.folder === 'Videos' ? <FileVideo className="w-12 h-12 mb-3" /> :
                                                         item.folder === 'Audio' ? <FileAudio className="w-12 h-12 mb-3" /> :
                                                         <FileText className="w-12 h-12 mb-3" />}
                                                        <span className="text-xs truncate w-full text-center font-medium">
                                                            {item.filename}
                                                        </span>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 mt-8">
                                        <button
                                            onClick={() => setPage(Math.max(1, page - 1))}
                                            disabled={page === 1}
                                            className="px-5 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-xl disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition bg-white dark:bg-gray-800 shadow-sm"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                                            disabled={page === totalPages}
                                            className="px-5 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-xl disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition bg-white dark:bg-gray-800 shadow-sm"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedItem && (
                            <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-y-auto shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 animate-in slide-in-from-right-4 duration-200">
                                <div className="p-6 space-y-6">
                                    <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        File Details
                                    </h3>

                                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 shadow-inner">
                                        {isImage(selectedItem.mimeType) ? (
                                            <img src={selectedItem.url} alt={selectedItem.altText} className="w-full" />
                                        ) : (
                                            <div className="p-10 text-center text-gray-400 flex flex-col items-center">
                                                <FileIcon className="w-16 h-16 mb-4" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium break-all">{selectedItem.filename}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 text-sm space-y-3 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-gray-200">File:</span> <span className="truncate ml-4">{selectedItem.originalFilename}</span></div>
                                        <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-gray-200">Type:</span> <span>{selectedItem.mimeType}</span></div>
                                        <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-gray-200">Size:</span> <span>{formatFileSize(selectedItem.size)}</span></div>
                                        <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-gray-200">Date:</span> <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span></div>
                                        <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-gray-200">Folder:</span> <span>{selectedItem.folder}</span></div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={selectedItem.url}
                                                className="flex-1 text-xs px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 truncate outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => navigator.clipboard.writeText(selectedItem.url)}
                                                className="px-3 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors border border-indigo-200 dark:border-indigo-500/20 shadow-sm"
                                                title="Copy URL"
                                            >
                                                <Copy className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alt Text (SEO)</label>
                                        <input
                                            type="text"
                                            value={selectedItem.altText || ''}
                                            onChange={(e) => setSelectedItem({ ...selectedItem, altText: e.target.value })}
                                            onBlur={(e) => handleUpdateMeta('altText', e.target.value)}
                                            placeholder="Describe image..."
                                            className="w-full text-sm px-4 py-2.5 border border-gray-300 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Caption</label>
                                        <textarea
                                            value={selectedItem.caption || ''}
                                            onChange={(e) => setSelectedItem({ ...selectedItem, caption: e.target.value })}
                                            onBlur={(e) => handleUpdateMeta('caption', e.target.value)}
                                            placeholder="Optional caption..."
                                            rows={3}
                                            className="w-full text-sm px-4 py-2.5 border border-gray-300 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-sm"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(selectedItem.id)}
                                            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-xl transition-colors border border-red-200 dark:border-red-900/30"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                            Delete Permanently
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {pendingImage && (
                <ImageCompressorModal
                    file={pendingImage}
                    onConfirm={handleCompressConfirm}
                    onCancel={handleCompressCancel}
                />
            )}
        </div>
    );
}
