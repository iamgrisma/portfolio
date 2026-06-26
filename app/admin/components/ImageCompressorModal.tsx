'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface ImageCompressorModalProps {
    file: File;
    onConfirm: (compressedFile: File) => void;
    onCancel: () => void;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ImageCompressorModal({ file, onConfirm, onCancel }: ImageCompressorModalProps) {
    const isPng = file.type === 'image/png';
    const [quality, setQuality] = useState<number>(80);
    const [convertToWebp, setConvertToWebp] = useState<boolean>(!isPng);
    const [keepExif, setKeepExif] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const originalImageRef = useRef<HTMLImageElement | null>(null);

    const processImageRef = useRef<(() => void) | null>(null);

    // Keep processImageRef updated with the latest processImage
    useEffect(() => {
        processImageRef.current = processImage;
    });

    // Load original image into memory
    useEffect(() => {
        let isMounted = true;
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        const img = new Image();
        img.onload = () => {
            if (isMounted) {
                originalImageRef.current = img;
                if (processImageRef.current) processImageRef.current();
            }
        };
        img.src = objectUrl;

        return () => {
            isMounted = false;
            URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    // Process image when quality, format toggle, or EXIF toggle changes
    useEffect(() => {
        if (originalImageRef.current && processImageRef.current) {
            processImageRef.current();
        }
    }, [quality, convertToWebp, keepExif]);

    const processImage = () => {
        const img = originalImageRef.current;
        if (!img) return;

        setIsProcessing(true);

        if (keepExif) {
            setCompressedFile(file);
            setIsProcessing(false);
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        let outputMimeType = file.type;
        let extension = file.name.split('.').pop() || '';

        if (convertToWebp) {
            outputMimeType = 'image/webp';
            extension = 'webp';
        }

        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const newFileName = `${baseName}_compressed.${extension}`;

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const newFile = new File([blob], newFileName, {
                        type: outputMimeType,
                        lastModified: Date.now(),
                    });
                    setCompressedFile(newFile);
                }
                setIsProcessing(false);
            },
            outputMimeType,
            quality / 100
        );
    };

    const showPngWarning = isPng && !convertToWebp;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-0">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-indigo-500" />
                        Compress Image
                    </h2>
                    <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="w-full h-48 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center justify-center overflow-hidden mb-6 border border-gray-100 dark:border-gray-700">
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Convert to WebP</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Next-gen format. Significantly smaller file sizes.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={convertToWebp}
                                    onChange={(e) => setConvertToWebp(e.target.checked)}
                                    disabled={keepExif}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 opacity-100 disabled:opacity-50"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Keep EXIF Data</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Preserves camera metadata. <span className="text-amber-600 dark:text-amber-400 font-medium">Disables compression.</span>
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={keepExif}
                                    onChange={(e) => {
                                        setKeepExif(e.target.checked);
                                        if (e.target.checked) setConvertToWebp(false);
                                    }}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        {showPngWarning && !keepExif && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                <span className="text-red-500 text-lg mt-0.5">⚠️</span>
                                <div>
                                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-400">Recommendation</h4>
                                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                        PNG files are large and can slow down your website. We highly recommend turning on <strong>Convert to WebP</strong>.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className={`transition-opacity ${keepExif ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Compression Quality
                                </label>
                                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                    {quality}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                step="5"
                                value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                            <div className="text-center flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original Size</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {formatFileSize(file.size)}
                                </p>
                            </div>
                            <div className="text-indigo-300 dark:text-indigo-700 px-4">→</div>
                            <div className="text-center flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estimated Size</p>
                                <p className={`font-semibold ${keepExif ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                                    {isProcessing ? '...' : compressedFile ? formatFileSize(compressedFile.size) : '...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (compressedFile) {
                                onConfirm(compressedFile);
                            }
                        }}
                        disabled={isProcessing || !compressedFile}
                        className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 dark:shadow-none disabled:opacity-50"
                    >
                        {keepExif ? 'Upload Original' : 'Compress & Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
}
