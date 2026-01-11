// types/storeFront.ts
export interface Vendor {
    business_name: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    profile_pic: string | null;
}

interface BusinessHours {
    day: string;
    hours: string;
    isToday: boolean;
}

interface StorefrontExtension {
    country: string;
    description: string;
    phone: string;
    hour: BusinessHours[];
}

export interface Storefront {
    id: number;
    business_name: string;
    description: string;
    logo?: string | null;
    address: string;
    established_at?: string;
    banner: string | null;
    ratings?: number;
    vendor?: Vendor | null;
    vendor_info?: {
        member_since: string;
    };
    extended?: StorefrontExtension | null;
    slug?: string;
    branding?: {
        layout_style: string;
        primary_color: string;
        secondary_color: string;
    };
}

export interface APIResponse {
    count: number;
    storefronts: Storefront[];
}
