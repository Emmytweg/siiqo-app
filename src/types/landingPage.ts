export interface Storefront {
  id: number;
  name: string;
  description: string;
  distance: string;
  category: string;
  image: string;
  isOpen: boolean;
  isVerified: boolean;
}


export interface Category {
  name: string;
  icon: React.ReactNode;
}