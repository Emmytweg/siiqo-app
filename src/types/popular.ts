
export interface PopularItem {
    id: number;
    title: string;
    price: number;
    image: string;
    distance: string;
    seller: string;
    rating: number;
    reviews: number;
    popularity: number;
    category: string;
    description: string;
}

// API Response interfaces
export interface ApiVendor {
    business_name: string;
    email: string;
    id: number;
}

export interface ApiProduct {
    category: string;
    id: number;
    images: string[];
    product_name: string;
    product_price: number;
    vendor: ApiVendor;
    // Optional fields that may not exist in API response
    description?: string;
    status?: string;
    visibility?: boolean;
}

export interface ApiResponse {
    count: number;
    products: ApiProduct[];
}
