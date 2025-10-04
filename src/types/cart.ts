export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    subtotal: number;
    available_stock: number;
    display_image: string | null;
    product: {
        id: number;
        product_name: string;
        unit_price: number;
        images: string[];
        category: string;
    };
}

export interface AppNotification {
    id: string;
    type: "success" | "error" | "info";
    message: string;
}
