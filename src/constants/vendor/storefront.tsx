import { StorefrontData } from "@/types/vendor/storefront";

export const mockStorefrontData: StorefrontData = {
  id: "storefront_001",
  businessName: "Bella Vista Restaurant",
  slug: "bella-vista-restaurant",
  description:
    "Authentic Italian cuisine in the heart of downtown. Family-owned restaurant serving traditional recipes.",
  logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop&crop=center",
  bannerImage:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop",
  theme: {
    primaryColor: "#D97706",
    secondaryColor: "#92400E",
    accentColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
    textColor: "#1F2937",
    fontFamily: "Inter",
  },
  contact: {
    phone: "+1 (555) 123-4567",
    email: "hello@bellavista.com",
    address: "123 Main Street, Downtown, NY 10001",
    website: "https://bellavista-restaurant.com",
  },
  hours: {
    monday: { open: "11:00", close: "22:00", closed: false },
    tuesday: { open: "11:00", close: "22:00", closed: false },
    wednesday: { open: "11:00", close: "22:00", closed: false },
    thursday: { open: "11:00", close: "22:00", closed: false },
    friday: { open: "11:00", close: "23:00", closed: false },
    saturday: { open: "11:00", close: "23:00", closed: false },
    sunday: { open: "12:00", close: "21:00", closed: false },
  },
  features: {
    onlineOrdering: true,
    reservations: true,
    delivery: true,
    pickup: true,
    paymentMethods: ["credit", "debit", "cash", "digital"],
    amenities: ["wifi", "parking", "wheelchair", "outdoor"],
  },
  socialMedia: {
    facebook: "https://facebook.com/bellavista",
    instagram: "https://instagram.com/bellavista",
    twitter: "https://twitter.com/bellavista",
  },
  gallery: [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
  ],
  isPublished: true,
  publishedAt: "2024-01-10T00:00:00Z",
  lastUpdated: "2024-01-15T12:30:00Z",
  views: 1247,
  clicks: 89,
  orders: 23,
};
