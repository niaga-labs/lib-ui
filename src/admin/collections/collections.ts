export interface CategoryInCollection {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    product_count: number;
    position: number;
}

export interface Collection {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    collection_type: 'manual' | 'automated';
    automation_rules?: string;
    sort_order: string;
    meta_title?: string;
    meta_desc?: string;
    is_active: boolean;
    published_at?: string;
    category_ids?: string[];
    categories?: CategoryInCollection[];
    category_count?: number;
    created_at: string;
    updated_at?: string;
}

export interface CollectionSummary {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    category_count: number;
    is_active: boolean;
    created_at: string;
}

export interface CollectionFormData {
    name: string;
    description?: string;
    image_url?: string;
    collection_type?: 'manual' | 'automated';
    automation_rules?: string;
    sort_order?: string;
    meta_title?: string;
    meta_desc?: string;
    is_active: boolean;
    category_ids?: string[];
}
