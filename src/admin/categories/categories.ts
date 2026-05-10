export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId: string | null;
    children?: Category[];
    productCount: number;
    isActive: boolean;
    image?: string;
    order: number;
    isFeatured?: boolean;
    featuredOrder?: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryFormData {
    name: string;
    slug: string;
    description?: string;
    parentId: string | null;
    isActive: boolean;
    image?: string;
    isFeatured?: boolean;
    featuredOrder?: number | null;
}

// Default slug generator — lowercase, replace whitespace + special chars with hyphens.
// Consumers can pass a different slugify function as the `slugify` prop if they need
// a tenant-specific transform (e.g. transliteration).
export function defaultSlugify(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}
