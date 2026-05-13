'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
    PolarisPage,
    PolarisCard,
    PolarisTextField,
    PolarisSelect,
} from '../polaris';
import { ImageIcon, ChevronRight, Upload, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '../common/Toast';
import type { Category, CategoryFormData } from './categories';
import { defaultSlugify } from './categories';

export interface CategoryFormProps {
    mode: 'create' | 'edit';
    initialData?: Category;
    parentCategory?: Category;
    /** Full flat list of categories (used to build the parent picker). */
    categories: Category[];
    loadingCategories?: boolean;
    /** Optional slugify override; defaults to lowercase-and-hyphen. */
    slugify?: (name: string) => string;
    onSubmit: (data: CategoryFormData, opts: { pendingImageFile?: File }) => Promise<void>;
    onCancel: () => void;
    /** Edit mode: upload a new image immediately. */
    onUploadImage?: (file: File) => Promise<{ image: string }>;
    /** Edit mode: clear the saved image. */
    onDeleteImage?: () => Promise<void>;
}

interface InternalFormState {
    name: string;
    slug: string;
    description: string;
    parentId: string | null;
    isActive: boolean;
    image: string;
}

export default function CategoryForm({
    mode,
    initialData,
    parentCategory,
    categories,
    loadingCategories = false,
    slugify = defaultSlugify,
    onSubmit,
    onCancel,
    onUploadImage,
    onDeleteImage,
}: CategoryFormProps) {
    const { showToast, ToastContainer } = useToast();
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<InternalFormState>({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        parentId: initialData?.parentId || parentCategory?.id || null,
        isActive: initialData?.isActive ?? true,
        image: initialData?.image || '',
    });

    // Auto-generate slug from name (only in create mode)
    useEffect(() => {
        if (mode === 'create' && formData.name && !initialData) {
            setFormData(prev => ({ ...prev, slug: slugify(prev.name) }));
        }
    }, [formData.name, mode, initialData, slugify]);

    // Get available parent categories (exclude self and descendants in edit mode)
    const availableParents = useMemo(() => {
        if (mode === 'create') return categories;
        if (!initialData) return categories;

        const excludeIds = new Set<string>([initialData.id]);

        const addDescendants = (catId: string) => {
            categories.forEach(cat => {
                if (cat.parentId === catId) {
                    excludeIds.add(cat.id);
                    addDescendants(cat.id);
                }
            });
        };
        addDescendants(initialData.id);

        return categories.filter(cat => !excludeIds.has(cat.id));
    }, [categories, initialData, mode]);

    // Build hierarchical options for parent select
    const parentOptions = useMemo(() => {
        const options: { value: string; label: string }[] = [
            { value: '', label: 'None (Root Category)' }
        ];

        const addCategoryOptions = (cats: Category[], prefix = '') => {
            cats
                .filter(cat => cat.parentId === null)
                .forEach(cat => {
                    if (availableParents.find(p => p.id === cat.id)) {
                        options.push({
                            value: cat.id,
                            label: `${prefix}${cat.name}`
                        });
                        addChildOptions(cat.id, prefix + '   ');
                    }
                });
        };

        const addChildOptions = (parentId: string, prefix: string) => {
            availableParents
                .filter(cat => cat.parentId === parentId)
                .forEach(cat => {
                    options.push({
                        value: cat.id,
                        label: `${prefix}└ ${cat.name}`
                    });
                    addChildOptions(cat.id, prefix + '   ');
                });
        };

        addCategoryOptions(availableParents);
        return options;
    }, [availableParents]);

    const handleChange = (field: keyof InternalFormState, value: string | boolean | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Invalid file type. Allowed: JPG, PNG, WebP, GIF', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('File too large. Max size: 5MB', 'error');
            return;
        }

        if (mode === 'edit' && initialData && onUploadImage) {
            setUploadingImage(true);
            try {
                const { image } = await onUploadImage(file);
                setFormData(prev => ({ ...prev, image }));
                showToast('Image uploaded successfully', 'success');
            } catch {
                showToast('Failed to upload image', 'error');
            } finally {
                setUploadingImage(false);
            }
        } else {
            // Create mode — preview now, upload after save
            setPendingImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({ ...prev, image: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
            showToast('Image selected. It will be uploaded after saving.', 'info');
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteImage = async () => {
        if (mode === 'edit' && initialData && formData.image && onDeleteImage) {
            setUploadingImage(true);
            try {
                await onDeleteImage();
                setFormData(prev => ({ ...prev, image: '' }));
                showToast('Image deleted successfully', 'success');
            } catch {
                showToast('Failed to delete image', 'error');
            } finally {
                setUploadingImage(false);
            }
        } else {
            setFormData(prev => ({ ...prev, image: '' }));
            setPendingImageFile(null);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            showToast('Category name is required', 'error');
            return;
        }
        if (!formData.slug.trim()) {
            showToast('Category slug is required', 'error');
            return;
        }

        setSaving(true);
        try {
            const data: CategoryFormData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || undefined,
                parentId: formData.parentId,
                isActive: formData.isActive,
            };

            await onSubmit(data, { pendingImageFile: pendingImageFile || undefined });
        } finally {
            setSaving(false);
        }
    };

    // Get category breadcrumb path
    const getCategoryPath = () => {
        const path: string[] = [];
        let currentId = formData.parentId;
        while (currentId) {
            const cat = categories.find(c => c.id === currentId);
            if (cat) {
                path.unshift(cat.name);
                currentId = cat.parentId;
            } else {
                break;
            }
        }
        return path;
    };

    const categoryPath = getCategoryPath();

    return (
        <div className="min-h-screen bg-[hsl(var(--p-surface))]">
            <ToastContainer />

            <PolarisPage
                title={mode === 'create'
                    ? parentCategory
                        ? `Add subcategory to "${parentCategory.name}"`
                        : 'Create category'
                    : 'Edit category'
                }
                backAction={{
                    content: 'Categories',
                    onAction: onCancel,
                }}
                primaryAction={{
                    content: saving ? 'Saving...' : 'Save',
                    onAction: handleSubmit,
                    disabled: saving,
                }}
                secondaryActions={[
                    {
                        content: 'Discard',
                        onAction: onCancel,
                    },
                ]}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Name and Slug */}
                        <PolarisCard>
                            <div className="space-y-4">
                                <PolarisTextField
                                    label="Category name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="e.g., Shirts"
                                    required
                                    helpText="This will be displayed in the storefront navigation"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        URL Slug <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">/categories/</span>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="category-slug"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Used for the category URL</p>
                                </div>
                            </div>
                        </PolarisCard>

                        {/* Description */}
                        <PolarisCard title="Description">
                            <div>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Describe this category... (optional)"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    A brief description of the category for SEO and display purposes
                                </p>
                            </div>
                        </PolarisCard>

                        {/* Parent Category */}
                        <PolarisCard title="Category hierarchy">
                            <div className="space-y-4">
                                {/* Show current path if has parent */}
                                {categoryPath.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <span className="font-medium">Path:</span>
                                        {categoryPath.map((name, index) => (
                                            <span key={index} className="flex items-center">
                                                {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
                                                <span>{name}</span>
                                            </span>
                                        ))}
                                        <ChevronRight className="w-4 h-4 mx-1" />
                                        <span className="font-medium text-blue-600">{formData.name || 'This category'}</span>
                                    </div>
                                )}

                                <PolarisSelect
                                    label="Parent category"
                                    value={formData.parentId || ''}
                                    onChange={(e) => handleChange('parentId', e.target.value || null)}
                                    options={parentOptions}
                                    disabled={loadingCategories || !!parentCategory}
                                />

                                {parentCategory && (
                                    <p className="text-sm text-gray-500">
                                        This category will be created under "{parentCategory.name}"
                                    </p>
                                )}
                            </div>
                        </PolarisCard>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-6">
                        {/* Status */}
                        <PolarisCard title="Status">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm text-gray-700 font-medium">Active</span>
                                    <p className="text-xs text-gray-500 mt-0.5">Visible in storefront</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => handleChange('isActive', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </PolarisCard>

                        {/* Category Image */}
                        <PolarisCard title="Category image">
                            <div className="space-y-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />

                                {formData.image ? (
                                    <div className="relative">
                                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <img
                                                src={formData.image}
                                                alt="Category"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploadingImage}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {uploadingImage ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Upload className="w-4 h-4" />
                                                )}
                                                Replace
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDeleteImage}
                                                disabled={uploadingImage}
                                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {uploadingImage ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingImage}
                                        className="w-full aspect-video flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors disabled:opacity-50"
                                    >
                                        {uploadingImage ? (
                                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                        )}
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-600">
                                                {uploadingImage ? 'Uploading...' : 'Click to upload'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                JPG, PNG, WebP, GIF (max 5MB)
                                            </p>
                                        </div>
                                    </button>
                                )}

                                <p className="text-xs text-gray-500">
                                    This image will be displayed in the storefront category listing
                                </p>
                            </div>
                        </PolarisCard>

                        {/* Info Card */}
                        {mode === 'edit' && initialData && (
                            <PolarisCard title="Category info">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Products</span>
                                        <span className="font-medium">{initialData.productCount || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Created</span>
                                        <span className="font-medium">
                                            {new Date(initialData.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Last updated</span>
                                        <span className="font-medium">
                                            {new Date(initialData.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </PolarisCard>
                        )}
                    </div>
                </div>
            </PolarisPage>
        </div>
    );
}
