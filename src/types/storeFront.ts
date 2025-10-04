
export interface Vendor {
    business_name: string;
    email: string;
    firstname: string;
    id: number;
    lastname: string;
    phone: string;
    profile_pic: string | null;
}

export interface Storefront {
    id: number;
    business_name: string;
    description: string;
    established_at: string;
    business_banner: string | null;
    ratings: number;
    vendor: Vendor | null;
}

export interface APIResponse {
    count: number;
    storefronts: Storefront[];
}
