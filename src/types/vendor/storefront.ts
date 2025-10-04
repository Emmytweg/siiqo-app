export interface StorefrontTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface StorefrontContact {
  phone: string;
  email: string;
  address: string;
  website: string;
}

export interface StorefrontHoursDay {
  open: string;
  close: string;
  closed: boolean;
}

export interface StorefrontHours {
  monday: StorefrontHoursDay;
  tuesday: StorefrontHoursDay;
  wednesday: StorefrontHoursDay;
  thursday: StorefrontHoursDay;
  friday: StorefrontHoursDay;
  saturday: StorefrontHoursDay;
  sunday: StorefrontHoursDay;
}

export interface StorefrontFeatures {
  onlineOrdering: boolean;
  reservations: boolean;
  delivery: boolean;
  pickup: boolean;
  paymentMethods: string[];
  amenities: string[];
}

export interface StorefrontSocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface StorefrontData {
  id: string;
  businessName: string;
  slug: string;
  description: string;
  logo: string;
  bannerImage: string;
  theme: StorefrontTheme;
  contact: StorefrontContact;
  hours: StorefrontHours;
  features: StorefrontFeatures;
  socialMedia: StorefrontSocialMedia;
  gallery: string[];
  isPublished: boolean;
  publishedAt: string | null;
  lastUpdated: string;
  views: number;
  clicks: number;
  orders: number;
}

export interface VendorData {
  businessName?: string;
  [key: string]: any;
}

export interface ApiStorefrontResponse {
  storefront?: {
    business_name?: string;
    description?: string;
    email?: string;
    phone?: string;
    state?: string;
    country?: string;
    website?: string;
    is_published?: boolean;
    published_at?: string | null;
  };
  products?: Array<{
    images?: string[];
  }>;
}
