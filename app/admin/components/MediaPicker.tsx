'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { uploadMedia, getMediaList, deleteMedia, updateMedia } from '@/src/lib/apiClient';
import ImageCompressorModal from './ImageCompressorModal';
import { X, UploadCloud, File as FileIcon, FileVideo, FileAudio, FileText, Check, Copy, Trash2, Search, Filter } from 'lucide-react';

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

interface MediaPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: { url: string; alt?: string; id: number }) => void;
    accept?: string;
    title?: string;
    defaultFolder?: string;
}

export const FOLDER_OPTIONS = [
    { label: 'Admin Media', value: 'Admin Media' },
    { label: 'Post Media > Featured Images', value: 'Featured Images' },
    { label: 'Post Media > Blog Images', value: 'Blog Images' },
    { label: 'Other Media', value: 'Other Media' },
    { label: 'Files', value: 'Files' },
];

const FOLDER_FILTERS = [
    { label: 'All Folders', value: 'all' },
    ...FOLDER_OPTIONS
];

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MediaPicker({ isOpen, onClose, onSelect, accept, title = 'Media Library', defaultFolder }: MediaPickerProps) {
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
            const mimeFilter = accept === 'image/*' ? 'image/' : '';
            const response: { success: boolean; data?: { items: MediaItem[], pagination?: { total_pages: number } }; error?: string } = await getMediaList(
                page,
                24,
                folder,
                mimeFilter,
                searchDebounced
            ) as any;
            if (response.success && response.data) {
                setItems(response.data.items || []);
                setTotalPages(response.data.pagination?.total_pages || 1);
            }
        } catch (error) {
            console.error('Failed to load media:', error);
        } finally {
            setLoading(false);
        }
    }, [page, folder, searchDebounced, accept]);

    useEffect(() => {
        if (isOpen) {
            loadMedia();
        }
    }, [isOpen, loadMedia]);

    useEffect(() => {
        if (isOpen) {
            setSelectedItem(null);
            setActiveTab('library');
            setUploadError('');
            if (defaultFolder) {
                setUploadFolder(defaultFolder);
                setFolder(defaultFolder);
            }
        }
    }, [isOpen, defaultFolder]);

    const doActualUpload = async (file: File) => {
        setUploading(true);
        setUploadError('');
        try {
            const response: any = await uploadMedia(file, uploadFolder);
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

    const handleInsert = () => {
        if (selectedItem) {
            onSelect({
                url: selectedItem.url,
                alt: selectedItem.altText,
                id: selectedItem.id,
            });
            onClose();
        }
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
                    <div className="flex bg-gray-200 dark:bg-gray-700/50 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setActiveTab('library')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                activeTab === 'library'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Library
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('upload')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                activeTab === 'upload'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Upload
                        </button>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex overflow-hidden">
                    {activeTab === 'upload' ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8">
                            
                            <div className="mb-6 w-full max-w-xl">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Upload Destination Folder
                                </label>
                                <select 
                                    value={uploadFolder}
                                    onChange={(e) => setUploadFolder(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                className={`w-full max-w-xl border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                                    dragOver
                                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.02]'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50/50 dark:hover:bg-gray-800'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileInput}
                                    accept={accept}
                                    className="hidden"
                                />
                                {uploading ? (
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                        <p className="text-indigo-600 dark:text-indigo-400 font-semibold">Uploading to R2 Storage...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-center text-indigo-500/50 dark:text-indigo-400/50">
                                            <UploadCloud className="w-16 h-16" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                                Drop files here or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Max file size: 50MB • Images will be automatically compressed
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {uploadError && (
                                    <p className="mt-4 text-red-600 dark:text-red-400 text-sm font-medium p-2 bg-red-50 dark:bg-red-900/20 rounded">{uploadError}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Library Grid Area */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-gray-800">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-gray-400" />
                                        <select 
                                            value={folder}
                                            onChange={(e) => { setFolder(e.target.value); setPage(1); }}
                                            className="text-sm border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 py-1.5 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {FOLDER_FILTERS.map(f => (
                                                <option key={f.value} value={f.value}>{f.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                            placeholder="Search by filename or alt text..."
                                            className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 dark:bg-gray-900/20">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                            <UploadCloud className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                                            <p className="text-lg font-medium">No media found</p>
                                            <p className="text-sm mt-1">Upload files to this folder to get started</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                            {items.map((item) => (
                                                <button
                                                    type="button"
                                                    key={item.id}
                                                    onClick={() => setSelectedItem(item)}
                                                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                                        selectedItem?.id === item.id
                                                            ? 'border-indigo-500 ring-2 ring-indigo-500/30 scale-[0.97]'
                                                            : 'border-transparent hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-800 shadow-sm'
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
                                                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-gray-400 dark:text-gray-500">
                                                            {item.folder === 'Videos' ? <FileVideo className="w-8 h-8 mb-2" /> :
                                                             item.folder === 'Audio' ? <FileAudio className="w-8 h-8 mb-2" /> :
                                                             <FileText className="w-8 h-8 mb-2" />}
                                                            <span className="text-[10px] truncate w-full text-center px-1">
                                                                {item.filename}
                                                            </span>
                                                        </div>
                                                    )}
                                                    
                                                    {selectedItem?.id === item.id && (
                                                        <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                                                            <Check className="w-3.5 h-3.5 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-8 pb-4">
                                            <button
                                                onClick={() => setPage(Math.max(1, page - 1))}
                                                disabled={page === 1}
                                                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mx-4">
                                                Page {page} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                                disabled={page === totalPages}
                                                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar Details */}
                            {selectedItem && (
                                <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
                                    <div className="p-5 space-y-5">
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Attachment Details
                                        </h3>

                                        <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                            {isImage(selectedItem.mimeType) ? (
                                                <img src={selectedItem.url} alt={selectedItem.altText} className="w-full" />
                                            ) : (
                                                <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                                                    <FileIcon className="w-12 h-12 mb-3" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium break-all">{selectedItem.filename}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 text-xs space-y-2 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700/50">
                                            <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-gray-200">File:</span> <span className="truncate ml-2">{selectedItem.originalFilename}</span></div>
                                            <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-gray-200">Type:</span> <span>{selectedItem.mimeType}</span></div>
                                            <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-gray-200">Size:</span> <span>{formatFileSize(selectedItem.size)}</span></div>
                                            <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-gray-200">Date:</span> <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span></div>
                                            <div className="flex justify-between"><span className="font-medium text-gray-900 dark:text-gray-200">Folder:</span> <span>{selectedItem.folder}</span></div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">File URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={selectedItem.url}
                                                    className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 truncate outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => navigator.clipboard.writeText(selectedItem.url)}
                                                    className="px-3 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors border border-indigo-100 dark:border-indigo-500/20"
                                                    title="Copy URL"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Alt Text</label>
                                            <input
                                                type="text"
                                                value={selectedItem.altText || ''}
                                                onChange={(e) => setSelectedItem({ ...selectedItem, altText: e.target.value })}
                                                onBlur={(e) => handleUpdateMeta('altText', e.target.value)}
                                                placeholder="Describe the image for SEO..."
                                                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Caption</label>
                                            <textarea
                                                value={selectedItem.caption || ''}
                                                onChange={(e) => setSelectedItem({ ...selectedItem, caption: e.target.value })}
                                                onBlur={(e) => handleUpdateMeta('caption', e.target.value)}
                                                placeholder="Optional caption..."
                                                rows={2}
                                                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(selectedItem.id)}
                                                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Permanently
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {selectedItem ? `Selected: ${selectedItem.filename}` : 'Select a file to insert'}
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleInsert}
                            disabled={!selectedItem}
                            className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
                        >
                            Insert Selected
                        </button>
                    </div>
                </div>
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
