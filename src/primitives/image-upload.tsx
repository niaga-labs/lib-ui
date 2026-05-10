'use client';

import { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export interface ImageUploadResponse {
    file_url: string;
}

export interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    /**
     * Caller-provided uploader. Receives a multipart FormData with `file`,
     * `folder`, and `alt_text` fields and resolves to `{ file_url }`.
     * Wrapping the host frontend's media-upload client keeps this primitive
     * tenant-agnostic.
     */
    uploadFn: (formData: FormData) => Promise<ImageUploadResponse>;
    folder?: string;
    className?: string;
    aspectRatio?: 'square' | 'video' | 'banner' | 'portrait';
    placeholder?: string;
    /**
     * Optional path to an image used as the broken-preview fallback. If
     * omitted, broken images are left untouched.
     */
    fallbackImageSrc?: string;
}

export function ImageUpload({
    value,
    onChange,
    uploadFn,
    folder = 'cms/settings',
    className,
    aspectRatio = 'square',
    placeholder = 'Drop image or click to upload',
    fallbackImageSrc,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState(value || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const aspectRatioClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        banner: 'aspect-[3/1]',
        portrait: 'aspect-[3/4]',
    };

    const uploadFile = async (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Please upload JPG, PNG, WebP, or GIF.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large. Maximum size is 5MB.');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);
            formData.append('alt_text', file.name);

            const response = await uploadFn(formData);

            if (response?.file_url) {
                onChange(response.file_url);
                toast.success('Image uploaded successfully');
            } else {
                throw new Error('No URL returned');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error?.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            uploadFile(file);
        }
    };

    const handleUrlSubmit = () => {
        const trimmed = urlInput.trim();
        if (!trimmed) return;
        try {
            const parsed = new URL(trimmed);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                toast.error('Invalid URL. Only http and https URLs are allowed.');
                return;
            }
            onChange(parsed.toString());
            setShowUrlInput(false);
        } catch {
            toast.error('Please enter a valid URL.');
        }
    };

    const handleClear = () => {
        onChange('');
        setUrlInput('');
    };

    return (
        <div className={cn('space-y-2', className)}>
            <div
                className={cn(
                    'relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-colors hover:border-primary/50 bg-muted/30',
                    aspectRatioClasses[aspectRatio],
                    isUploading && 'pointer-events-none opacity-70',
                    isDragging && 'border-primary bg-primary/10'
                )}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {value ? (
                    <>
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                if (fallbackImageSrc) {
                                    (e.target as HTMLImageElement).src = fallbackImageSrc;
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/80"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        ) : isDragging ? (
                            <>
                                <Upload className="w-8 h-8 mb-2 text-primary" />
                                <span className="text-sm text-primary font-medium">Drop image here</span>
                            </>
                        ) : (
                            <>
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span className="text-sm">{placeholder}</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
            />

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                >
                    Use URL
                </Button>
            </div>

            {showUrlInput && (
                <div className="flex gap-2">
                    <Input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1"
                    />
                    <Button type="button" size="sm" onClick={handleUrlSubmit}>
                        Apply
                    </Button>
                </div>
            )}
        </div>
    );
}
