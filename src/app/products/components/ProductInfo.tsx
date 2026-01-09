"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';
import { useToast } from "@/hooks/use-toast"; // Assuming you have a toast hook for feedback
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { switchMode } from '@/services/api';
interface Product {
    title: string;
    price: number;
    rating: number;
    reviewCount: number;
    distance: number; 
    availability: string;
    views: number;
    watchers: number;
    condition: string;
    lastUpdated: Date;
    description: string;
    specifications: { [key: string]: string };
}

interface ProductInfoProps {
    productData: Product;
    productId: number; // Product ID for API calls
    isWishlisted: boolean;
    onWishlistToggle: () => void;
    // onShare is now handled internally or passed as a callback
    showFullDescription: boolean;
    onToggleDescription: () => void;
    isMobile?: boolean;
}

const ProductInfo = ({
    productData: product,
    productId,
    isWishlisted,
    onWishlistToggle,
    showFullDescription,
    onToggleDescription,
    isMobile = false
}: ProductInfoProps) => {
    const { toast } = useToast();
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const [showBuyerModal, setShowBuyerModal] = useState(false);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

    // Check if user is in buyer mode
    const isBuyerMode = isLoggedIn && switchMode("buyer")
    const formatTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    // --- WISHLIST TOGGLE WITH API CALL ---
    const handleWishlistToggle = async () => {
        if (!isBuyerMode) {
            setShowBuyerModal(true);
            return;
        }

        setIsLoadingWishlist(true);
        try {
            const response = await api.post(`/buyers/favourites/${productId}`);
            
            if (response.data.status === 'success') {
                onWishlistToggle();
                toast({
                    title: isWishlisted ? "Removed from Favourites" : "Added to Favourites",
                    description: isWishlisted 
                        ? "Product removed from your favourites."
                        : "Product added to your favourites.",
                });
            }
        } catch (error) {
            console.error("Failed to update wishlist:", error);
            toast({
                title: "Error",
                description: "Failed to update wishlist. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoadingWishlist(false);
        }
    };

    // --- BUYER MODE MODAL ---
    const BuyerModeModal = () => (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 md:p-8 animate-in zoom-in duration-300">
                <div className="relative">
                    <button
                        onClick={() => setShowBuyerModal(false)}
                        className="absolute -top-2 -right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-yellow-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Switch to Buyer Mode
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            {isLoggedIn
                                ? "You need to switch to buyer mode to add items to your favourites."
                                : "Please log in as a buyer to add items to your favourites."}
                        </p>

                        <div className="space-y-3">
                            {isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        setShowBuyerModal(false);
                                        alert("Please use the mode switcher in the header to switch to buyer mode");
                                    }}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Switch to Buyer Mode
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowBuyerModal(false);
                                        router.push("/auth/login");
                                    }}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Log In
                                </button>
                            )}

                            <button
                                onClick={() => setShowBuyerModal(false)}
                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- CUSTOM SHARE LOGIC ---
    const handleShare = async () => {
        // 1. Format the name and distance (location)
        // Replaces spaces with hyphens and makes lowercase for a clean URL feel
        const formattedName = product.title.toLowerCase().trim().replace(/\s+/g, '-');
        const locationTag = `${product.distance}-miles-away`;
        
        // 2. Construct the specific string: name+location
        const shareUrl = window.location.href;
        
        // 3. Copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast({
                title: "Link Copied!",
                description: "Product details copied to clipboard.",
            });
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const discountPercentage = Math.round(((product.price - product.price) / product.price) * 100);

    return (
      <>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-xl font-bold md:text-2xl font-heading text-text-primary">
              {product.title}
            </h1>

            {/* Price Section */}
            <div className="flex items-center mb-3 space-x-3">
              <span className="text-2xl font-bold md:text-3xl text-text-primary">
                ₦{product.price.toLocaleString()}
              </span>
              {product.price > product.price && (
                <>
                  <span className="text-lg line-through text-text-secondary">
                    ₦{product.price}
                  </span>
                  <span className="px-2 py-1 text-sm font-medium text-orange-500 bg-orange-100 rounded">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Rating and Distance */}
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <div className="flex items-center space-x-1">
                <Icon
                  name="Star"
                  size={16}
                  className="text-orange-500 fill-current"
                />
                <span className="font-medium text-text-primary">
                  {product.rating}
                </span>
                <span>({product.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={16} className="text-primary" />
                <span>{product.distance} miles away</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-center space-x-2">
            <button
              type="button"
              onClick={handleWishlistToggle}
              disabled={isLoadingWishlist}
              className={`p-1 rounded-full transition-all duration-200 ${
                isWishlisted
                  ? "bg-white text-slate-900"
                  : "bg-white text-orange-500"
              } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon
                name="Heart"
                size={15}
                className={isWishlisted ? "fill-current" : ""}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-3 transition-all duration-200 rounded-full bg-surface-secondary text-text-secondary hover:bg-surface hover:text-text-primary"
              aria-label="Share product"
            >
              <Icon name="Share" size={20} />
            </button>
          </div>
        </div>

        {/* ... Rest of your existing JSX (Status, Condition, Description, Specs) ... */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium text-primary">
              {product.availability}
            </span>
          </div>
          {/* <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Eye" size={16} />
            <span>{product.views} views</span>
          </div> */}
          {/* <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Users" size={16} />
            <span>{product.watchers} watching</span>
          </div> */}
        </div>

        <div className="flex items-center justify-between py-4 border-t border-b border-border">
          <div>
            <span className="text-sm text-text-secondary">Condition</span>
            <p className="font-medium text-text-primary">{product.condition}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-text-secondary">Updated</span>
            <p className="font-medium text-text-primary">
              {formatTimeAgo(product.lastUpdated)}
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold font-heading text-text-primary">
            Description
          </h3>
          <div className="leading-relaxed text-text-secondary">
            <p className={`${!showFullDescription && isMobile ? "line-clamp-3" : ""}`}>
              {product.description}
            </p>
            {isMobile && (
              <button
                onClick={onToggleDescription}
                className="mt-2 font-medium transition-colors duration-200 text-primary hover:text-primary-700"
              >
                {showFullDescription ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold font-heading text-text-primary">
            Specifications
          </h3>
          <div className="space-y-3">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-border-light last:border-b-0"
              >
                <span className="text-text-secondary">{key}</span>
                <span className="font-medium text-right text-text-primary">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showBuyerModal && <BuyerModeModal />}
    </>
  );
};

export default ProductInfo;