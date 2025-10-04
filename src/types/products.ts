// Raw API Response
export interface ApiProduct {
  id: number;
  product_name: string;
  description: string;
  product_price: number;
  category: string;
  images: string[];
  status: string;
  visibility: boolean;
  vendor: {
    id: number;
    business_name: string;
    email: string;
  };
}

// Local Product Interface
export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount?: number;
  condition: string;
  rating: number;
  reviewCount: number;
  distance: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  images: string[];
  description: string;
  specifications: { [key: string]: string };
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    responseTime: string;
    memberSince: string;
    verifiedSeller: boolean;
  };
  availability: string;
  lastUpdated: Date;
  views: number;
  watchers: number;
}

export interface PriceComparisonItem {
  id: string;
  seller: string;
  price: number;
  condition: string;
  distance: number;
  rating: number;
}

export interface SimilarProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  distance: number;
  rating: number;
  condition: string;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export interface Products {
  id: any;
  name: string;
  vendor: string;
  price: number;
  salePrice?: number;
  originalPrice?: any;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  stock: number;
  category: string;
  isWishlisted?: boolean;
  description: string;
}