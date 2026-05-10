export interface Banner {
    id: string;
    name: string;
    banner_type: string;
    location: string;
    title?: string;
    subtitle?: string;
    description?: string;
    image_desktop: string;
    image_mobile?: string;
    video_url?: string;
    cta_text?: string;
    cta_url?: string;
    text_position?: string;
    text_color?: string;
    overlay_color?: string;
    overlay_opacity?: number;
    start_date?: string;
    end_date?: string;
    is_active: boolean;
    sort_order: number;
    click_count?: number;
    view_count?: number;
    created_at: string;
    updated_at: string;
}

// Where a banner can appear. Values are tenant-specific (they map to the
// host's `cms.banner_location` enum); admin keeps its own list of options
// and passes it via the BannerForm `bannerLocations` prop.
export interface BannerLocationOption {
    value: string;
    label: string;
    description: string;
    /** Optional override — when this option is selected, the form sets
     *  banner_type to this value instead of the default 'hero'. */
    bannerType?: string;
}
