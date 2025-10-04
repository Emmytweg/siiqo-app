import { Category, Storefront } from "@/types/landingPage";
import {
  Car,
  GraduationCap,
  Heart,
  Home,
  Monitor,
  Package,
  Shirt,
  Users,
  Wrench,
} from "lucide-react";

export const categories: Category[] = [
  { name: "Food", icon: <Package className="w-5 h-5" /> },
  { name: "Fashion", icon: <Shirt className="w-5 h-5" /> },
  { name: "Home", icon: <Home className="w-5 h-5" /> },
  { name: "Electronics", icon: <Monitor className="w-5 h-5" /> },
  { name: "Beauty", icon: <Heart className="w-5 h-5" /> },
  { name: "Maintenance", icon: <Wrench className="w-5 h-5" /> },
  { name: "Transportation", icon: <Car className="w-5 h-5" /> },
  { name: "Health", icon: <Heart className="w-5 h-5" /> },
  { name: "Trainings", icon: <GraduationCap className="w-5 h-5" /> },
  { name: "Local Artisans", icon: <Users className="w-5 h-5" /> },
] as const;

export const storefronts: Storefront[] = [
  {
    id: 1,
    name: "Green Leaf Market",
    description: "Grocery store",
    distance: "1,2 km away",
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
    isOpen: true,
    isVerified: true,
  },
  {
    id: 2,
    name: "Trendy Threads",
    description: "Clothing boutique",
    distance: "0,8 km away",
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
    isOpen: true,
    isVerified: true,
  },
  {
    id: 3,
    name: "Fix-It Fast",
    description: "Repair service",
    distance: "3,1 km away",
    category: "Maintenance",
    image:
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=250&fit=crop",
    isOpen: true,
    isVerified: true,
  },
] as const;
