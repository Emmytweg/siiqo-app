"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Using Next.js Image for optimization
import { Heart, Star, MapPin, TrendingUp, AlertCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { productService } from "@/services/productService";
import { PopularItem, ApiProduct, ApiResponse } from "@/types/popular";
// import Skeleton from "react-loading-skeleton";
import Skeleton from "@/components/skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

const PopularInArea: React.FC = () => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Helper Functions (Same as before) ---
  const generateDistance = (productId: number): string => {
    const seed = productId;
    const distance = (((Math.sin(seed * 9999) * 10000) % 3) + 0.5).toFixed(1);
    return `${Math.abs(parseFloat(distance))} km`; // Changed to km for consistency
  };

  const generateRatingAndReviews = (productId: number) => {
    const seed = productId;
    const rating = +(((Math.sin(seed * 1111) * 10000) % 1.5) + 3.5).toFixed(1);
    const reviews = Math.floor((Math.sin(seed * 2222) * 10000) % 200) + 20;
    return { rating: Math.abs(rating), reviews: Math.abs(reviews) };
  };

  const calculatePopularity = (rating: number, reviews: number): number => {
    const ratingScore = (rating / 5) * 60;
    const reviewScore = Math.min(reviews / 200, 1) * 40;
    return Math.round(ratingScore + reviewScore);
  };

  const transformApiProduct = (apiProduct: ApiProduct): PopularItem => {
    const { rating, reviews } = generateRatingAndReviews(apiProduct.id);
    return {
      id: apiProduct.id,
      title: apiProduct.product_name,
      price: apiProduct.product_price,
      image: apiProduct.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image",
      distance: generateDistance(apiProduct.id),
      seller: apiProduct.vendor.business_name,
      rating,
      reviews,
      popularity: calculatePopularity(rating, reviews),
      category: apiProduct.category,
      description: apiProduct.description || "No description available",
    };
  };

  const fetchPopularProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data: ApiResponse = await productService.getProducts();
      const transformedProducts = data.products
        .filter((p) => p.product_name && p.product_price !== undefined && p.vendor?.business_name)
        .map(transformApiProduct)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 8); // Limit to top 8 for clean layout

      setPopularItems(transformedProducts);
    } catch (err) {
      console.error("Error fetching popular products:", err);
      setError("Failed to load popular products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const handleItemClick = (id: number) => {
    router.push(`/product-detail?id=${id}`);
  };

  const toggleWishlist = (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const newSet = new Set(prev);
      newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
      return newSet;
    });
  };

  // --- Render States ---

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-between items-end mb-6">
          <Skeleton width={200} height={32} />
          <Skeleton width={100} height={40} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
               <Skeleton height={192} />
               <div className="p-4">
                 <Skeleton width="60%" height={24} className="mb-2" />
                 <Skeleton width="40%" height={20} className="mb-4" />
                 <Skeleton width="100%" height={40} />
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={fetchPopularProducts}
          className="px-6 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (popularItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">No trending items yet</h3>
        <p className="text-gray-500 max-w-sm text-center mb-6">
          There are currently no popular products in your area. Check back later!
        </p>
        <button
          onClick={fetchPopularProducts}
          className="px-6 py-2 bg-[#212830] text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <TrendingUp className="w-5 h-5 text-[#E0921C]" />
             <span className="text-xs font-bold uppercase tracking-wider text-[#E0921C]">Trending Now</span>
          </div>
          <h2 className="text-2xl font-bold text-[#212830]">
            Popular in Your Area
          </h2>
        </div>

        <button
          onClick={() => router.push("/search-results?sort=popular")}
          className="group flex items-center text-sm font-semibold text-[#212830] hover:text-[#E0921C] transition-colors"
        >
          View All Items
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                <TrendingUp size={10} />
                HOT
              </div>

              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <MapPin size={10} />
                {item.distance}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={(e) => toggleWishlist(e, item.id)}
                className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                  wishlist.has(item.id)
                    ? "bg-red-50 text-red-500"
                    : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white"
                }`}
              >
                <Heart size={16} className={wishlist.has(item.id) ? "fill-current" : ""} />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide truncate max-w-[120px]">
                    {item.category}
                 </span>
                 <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                    <Star size={12} className="fill-orange-400 text-orange-400" />
                    {item.rating} <span className="text-gray-400 font-normal">({item.reviews})</span>
                 </div>
              </div>

              <h3 className="text-base font-bold text-[#212830] line-clamp-2 mb-3 group-hover:text-[#E0921C] transition-colors">
                {item.title}
              </h3>

              <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                <div>
                   <span className="text-xs text-gray-400 block mb-0.5">Price</span>
                   <span className="text-lg font-extrabold text-[#E0921C]">
                    ₦{item.price.toLocaleString()}
                   </span>
                </div>

                <div className="flex flex-col items-end">
                   <span className="text-xs text-gray-400 block mb-0.5">Seller</span>
                   <span className="text-xs font-medium text-[#212830] truncate max-w-[100px]">
                    {item.seller}
                   </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularInArea;