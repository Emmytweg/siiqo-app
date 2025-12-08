"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ImageGallery from "./components/ImageGallery";
import ProductInfo from "./components/ProductInfo";
import LocationMap from "./components/LocationMap";
import SellerCard from "./components/SellerCard";
import SimilarProducts from "./components/SimilarProducts";
import PriceComparison from "./components/PriceComparison";
import {
  CheckCircle,
  AlertCircle,
  X,
  ChevronRight,
  MapPin,
  Truck,
  ShieldCheck,
  ShoppingBag
} from "lucide-react";
import Button from "@/components/Button";
import { useCartModal } from "@/context/cartModalContext";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import {
  ApiProductFull,
  Product,
  PriceComparisonItem,
  Notification,
} from "@/types/product-detail";

// --- Components ---

const NotificationToast: React.FC<{
  notification: Notification;
  onClose: (id: string) => void;
}> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(notification.id), 4000);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <AlertCircle className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 p-4 rounded-xl border shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 ${styles[notification.type]}`}>
      {icons[notification.type]}
      <p className="text-sm font-medium">{notification.message}</p>
      <button onClick={() => onClose(notification.id)} className="opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const Breadcrumbs = ({ category, title }: { category: string; title: string }) => (
  <nav className="flex items-center text-sm text-gray-500 mb-6 flex-wrap">
    <span className="hover:text-[#E0921C] cursor-pointer transition-colors">Home</span>
    <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
    <span className="hover:text-[#E0921C] cursor-pointer transition-colors">{category || "Product"}</span>
    <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
    <span className="font-medium text-[#212830] line-clamp-1">{title}</span>
  </nav>
);

const ProductDetail = () => {
  // --- State (Restored fully from original) ---
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // --- Hooks ---
  const { openCart } = useCartModal();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Helper Functions ---
  const addNotification = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // --- Data Transformation (Restored fully) ---
  const transformApiProduct = (apiProduct: ApiProductFull): Product => {
    return {
      id: apiProduct.id.toString(),
      title: apiProduct.product_name || "Unknown Product",
      price: apiProduct.product_price / 100 || 0,
      originalPrice: (apiProduct.product_price / 100) * 1.2 || 0,
      discount: apiProduct.discount ?? 0,
      condition: apiProduct.condition ?? "Like New",
      rating: apiProduct.rating ?? 4.7,
      reviewCount: apiProduct.review_count ?? 0,
      distance: apiProduct.distance ?? 0,
      location: apiProduct.location ?? { address: "Unknown", lat: 0, lng: 0 },
      images:
        apiProduct.images.length > 0
          ? apiProduct.images
          : [
              "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
            ],
      description: apiProduct.description || "No description available",
      specifications: {
        Category: apiProduct.category || "General",
        Status: apiProduct.status || "unknown",
        "Product ID": apiProduct.id.toString(),
        Seller: apiProduct.seller?.name || "Unknown",
      },
      seller: {
        id: apiProduct.seller?.id.toString() || "0",
        name: apiProduct.seller?.name || "Unknown Seller",
        avatar:
          apiProduct.seller?.avatar ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rating: apiProduct.seller?.rating ?? 0,
        reviewCount: apiProduct.seller?.review_count ?? 0,
        responseTime: apiProduct.seller?.response_time || "N/A",
        memberSince: apiProduct.seller?.member_since || "N/A",
        verifiedSeller: apiProduct.seller?.verified ?? false,
      },
      availability:
        apiProduct.availability ??
        (apiProduct.status === "active" ? "Available" : "Unavailable"),
      lastUpdated: apiProduct.last_updated
        ? new Date(apiProduct.last_updated)
        : new Date(),
      views: apiProduct.views ?? 0,
      watchers: apiProduct.watchers ?? 0,
    };
  };

  // --- Handlers (Restored fully) ---

  const handleNavigateToVendorProfile = (vendor: Product["seller"]) => {
    if (!vendor || !vendor.name) return;
    const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const businessSlug = slugify(vendor.name);
    router.push(`/seller-profile/${encodeURIComponent(businessSlug)}`);
  };

  const handleWishlistToggle = () => {
    if (!product || typeof window === "undefined") return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let updatedWishlist;

    if (isWishlisted) {
      updatedWishlist = wishlist.filter((id: string) => id !== product.id);
      addNotification("info", "Removed from wishlist");
    } else {
      updatedWishlist = [...wishlist, product.id];
      addNotification("success", "Added to wishlist");
    }
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = async (quantity: number = 1) => {
    if (!product) return;
    try {
      setIsAddingToCart(true);
      await cartService.addToCart(parseInt(product.id), quantity);
      setCartQuantity((prev) => prev + quantity);
      addNotification("success", `Added ${quantity} item(s) to cart successfully!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      addNotification("error", "Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      setIsBuyingNow(true);
      await cartService.addToCart(parseInt(product.id), 1);
      setCartQuantity((prev) => prev + 1);
      openCart(1);
      addNotification("success", "Product added! Redirecting to checkout...");
    } catch (error) {
      console.error("Error on Buy Now:", error);
      addNotification("error", "Failed to process Buy Now. Please try again.");
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleContactSeller = () => {
    addNotification("info", "Opening seller contact...");
    const businessName = sessionStorage.getItem("selectedBusinessName");
    if (businessName) {
      const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      router.push(`/seller-profile/${encodeURIComponent(slugify(businessName))}?tab=contact`);
    } else {
      console.warn("Missing business name!");
    }
  };

  const handleGetDirections = () => {
    if (!product) return;
    const { lat, lng } = product.location;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const handleShare = async () => {
    if (!product) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.title} for ₦${product.price}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      addNotification("success", "Link copied to clipboard!");
    }
  };

  // --- Effects (Restored fully) ---

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productId = searchParams.get("id") || "1";
        
        if (!productId) {
          setError("Missing product ID.");
          return;
        }

        const apiProduct = await productService.getProductById(productId);
        const transformedProduct = transformApiProduct(apiProduct);
        setProduct(transformedProduct);

        // Fetch Similar Products Logic (Restored)
        const category = apiProduct.category;
        if (category) {
          try {
            const similarResponse = await productService.getProducts();
            if (Array.isArray(similarResponse)) {
              const transformed = similarResponse.map(transformApiProduct);
              const filtered = transformed.filter((p: Product) => p.id !== productId);
              setAllProducts(filtered);
            }
          } catch (err) {
            console.error("Error fetching similar products:", err);
            setAllProducts([]);
          }
        }

        // Check Wishlist Status (Restored)
        if (typeof window !== "undefined") {
          const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
          setIsWishlisted(wishlist.includes(transformedProduct.id));
        }

      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
        addNotification("error", "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [searchParams]);

  // --- Comparisons Data ---
  const priceComparisons: PriceComparisonItem[] = [
    { id: "comp_001", seller: "Mobile World", price: 929, condition: "New", distance: 1.5, rating: 4.6 },
    { id: "comp_002", seller: "Phone Paradise", price: 949, condition: "New", distance: 2.3, rating: 4.4 },
    { id: "comp_003", seller: "Digital Store", price: 879, condition: "Like New", distance: 3.1, rating: 4.7 },
  ];

  // --- Loading / Error UI ---

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-[#E0921C] border-t-transparent animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="mb-2 text-xl font-bold text-[#212830]">Product Not Available</h2>
          <p className="mb-6 text-gray-500">{error || "The product you're looking for doesn't exist."}</p>
          <Button onClick={() => router.back()} className="px-6 py-2 bg-[#212830] text-white hover:bg-[#212830]/90 rounded-lg">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const similarProductsData = allProducts.filter(
    (p: Product) =>
      p.id !== product?.id &&
      p.specifications?.Category === product?.specifications?.Category
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Notifications */}
      {notifications.map((n) => (
        <NotificationToast key={n.id} notification={n} onClose={removeNotification} />
      ))}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Breadcrumbs category={product.specifications.Category} title={product.title} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: Visuals & Details (8 Cols) --- */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* 1. Gallery */}
            <div className="bg-white rounded-3xl p-1 overflow-hidden border border-gray-100 shadow-sm">
                <ImageGallery 
                    images={product.images} 
                    activeIndex={activeImageIndex} 
                    onImageChange={setActiveImageIndex} 
                    // isMobile handled via CSS/responsive logic in subcomponent usually, 
                    // or explicitly passed if your component requires it:
                    isMobile={false} 
                />
            </div>
   {/* 2. Seller Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <SellerCard 
                    seller={product.seller} 
                    onContact={handleContactSeller} // Restored handler
                    onNavigateToVendorProfile={() => handleNavigateToVendorProfile(product.seller)} // Restored handler
                />
            </div>
{/* 3. Price Comparison */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h4 className="font-bold text-[#212830] mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <ShoppingBag className="w-4 h-4 text-[#E0921C]" /> Market Comparison
                </h4>
                <PriceComparison 
                    comparisons={priceComparisons} 
                    currentPrice={product.price} 
                />
            </div>
         

            {/* 3. Similar Products */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#212830]">Similar Items</h3>
                </div>
                <SimilarProducts 
                    products={similarProductsData} 
                    onProductClick={(id) => router.push(`/product-detail?id=${id}`)} 
                />
            </div>
          </div>


          {/* --- RIGHT COLUMN: Buy Box & Seller (4 Cols) --- */}
          <div className="lg:col-span-6 space-y-6">
            
              {/* 1. Product Info & Location */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-8">
                <ProductInfo 
                    product={product} 
                    isWishlisted={isWishlisted}
                    onWishlistToggle={handleWishlistToggle}
                    onShare={handleShare}
                    showFullDescription={showFullDescription} // Restored state
                    onToggleDescription={() => setShowFullDescription(!showFullDescription)} // Restored handler
                    isMobile={false}
                />
                
                <hr className="border-gray-100" />
                {/* 1. Sticky Buy Box */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg sticky top-6 z-10">
                <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-extrabold text-[#E0921C]">₦{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    {product.discount && product.discount > 0 && (
                        <div className="flex gap-2">
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                               {product.discount}% OFF
                           </span>
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                               {product.condition}
                           </span>
                        </div>
                    )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-6 text-sm p-3 bg-gray-50 rounded-lg">
                    {product.availability === "Available" ? (
                        <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-[#212830] font-medium">Available & Ready to Ship</span>
                        </>
                    ) : (
                        <>
                            <X className="w-5 h-5 text-red-500" />
                            <span className="text-red-600 font-medium">Currently Unavailable</span>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button 
                        onClick={handleBuyNow} 
                        disabled={isBuyingNow || product.availability !== "Available"}
                        className="w-full py-4 text-base font-bold bg-[#212830] hover:bg-[#212830]/90 text-white rounded-xl shadow-md transition-transform active:scale-[0.98] disabled:opacity-50"
                    >
                        {isBuyingNow ? (
                           <span className="flex items-center justify-center gap-2">
                             <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
                             Processing...
                           </span>
                        ) : "Buy Now"}
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        onClick={() => handleAddToCart(1)}
                        disabled={isAddingToCart || product.availability !== "Available"}
                        className="w-full py-4 text-base font-semibold border-2 border-gray-200 hover:border-[#212830] hover:text-[#212830] text-gray-600 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isAddingToCart ? (
                           <span className="flex items-center justify-center gap-2">
                             <span className="w-4 h-4 border-2 border-[#212830] rounded-full border-t-transparent animate-spin"></span>
                             Adding...
                           </span>
                        ) : `Add to Cart ${cartQuantity > 0 ? `(${cartQuantity})` : ""}`}
                    </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center text-center gap-1">
                        <ShieldCheck className="w-6 h-6 text-gray-300" />
                        <span className="text-xs text-gray-500 font-medium">Secure Payment</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1">
                        <Truck className="w-6 h-6 text-gray-300" />
                        <span className="text-xs text-gray-500 font-medium">Nationwide Delivery</span>
                    </div>
                </div>
            </div>
                <div>
                    <h3 className="text-lg font-bold text-[#212830] mb-4 flex items-center gap-2">
                       <MapPin className="w-5 h-5 text-[#E0921C]" /> Item Location
                    </h3>
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                        <LocationMap location={product.location} onGetDirections={handleGetDirections} />
                    </div>
                </div>
            </div>

          
            

          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3">
            <Button 
                variant="outline" 
                className="flex-1 py-3 rounded-xl font-semibold border-gray-300 text-gray-700" 
                onClick={() => handleAddToCart(1)}
                disabled={isAddingToCart || product.availability !== "Available"}
            >
                Add to Cart
            </Button>
            <Button 
                className="flex-1 py-3 bg-[#E0921C] hover:bg-[#c9831b] text-white rounded-xl font-bold shadow-lg" 
                onClick={handleBuyNow}
                disabled={isBuyingNow || product.availability !== "Available"}
            >
                Buy Now
            </Button>
        </div>
      </div>

    </div>
  );
};

const ProductDetailPage = () => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#E0921C] border-t-transparent rounded-full animate-spin"></div>
    </div>
  }>
    <ProductDetail />
  </Suspense>
);

export default ProductDetailPage;