export interface MarketplaceConnection {
    id: string;
    platform: 'shopee' | 'tiktok';
    shop_id: string;
    shop_name: string;
    is_active: boolean;
    token_expires_at: string;
    settings?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export const PLATFORM_NAMES: Record<string, string> = {
    shopee: 'Shopee',
    tiktok: 'TikTok Shop',
};

export function getPlatformIcon(platform: string): string {
    switch (platform) {
        case 'shopee': return '🛒';
        case 'tiktok': return '📱';
        default: return '🏪';
    }
}