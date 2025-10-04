export interface Vendor {
    business_name: string;
    email: string;
    id: number;
}

export interface Product {
    id: number;
    product_name: string;
    product_price: number;
    description: string;
    category: string;
    images: string[];
    status: string;
    visibility: boolean;
    vendor: Vendor;
}

export interface ApiResponse {
    count: number;
    products: Product[];
}
