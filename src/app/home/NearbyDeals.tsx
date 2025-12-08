"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { productService } from "@/services/productService";
import { Product, APIResponse } from "@/types/products";
// import NearbyDealCard, { DealData } from "./NearbyDealsProdCard"; // Ensure path is correct
import Skeleton from "@/components/skeleton";
import NearbyDealCard, {DealData} from "./ui/NearbyDealsProdCard";
interface NearbyDealsProps {
  onRefresh: () => Promise<void>;
}

const NearbyDeals: React.FC<NearbyDealsProps> = ({ onRefresh }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const data: APIResponse = await productService.getProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const generateDealData = (product: Product): DealData => {
    // Generate consistent pseudo-random data based on product ID
    const seed = typeof product.id === 'string' ? parseInt(product.id, 10) || 123 : product.id;
    const random = (min: number, max: number) =>
      Math.floor((Math.sin(seed * 9999) * 10000) % (max - min + 1)) + min;

    const discount = random(10, 35);
    const originalPrice = Math.round(
      product.product_price / (1 - discount / 100)
    );

    return {
      originalPrice,
      discount,
      distance: `${(random(1, 20) / 10).toFixed(1)} km`,
      rating: random(40, 50) / 10,
      condition: ["New", "Like New", "Open Box"][random(0, 2)],
    };
  };

  const handleDealClick = (id: number) => {
    router.push(`/product-detail?id=${id}`);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchProducts();
      await onRefresh();
    } catch (err) {
      console.error("Error during refresh:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
        <p className="mb-4 text-gray-500 text-sm">
          Oops! Could not load nearby deals.
        </p>
        <button
          onClick={handleRefresh}
          className="px-5 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-full bg-[#E0921C] hover:bg-[#c78219] shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Header Section (Optional context if needed, otherwise kept minimal) */}
      <div className="flex items-center justify-end mb-4 px-1">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh Deals</span>
        </button>
      </div>

      {/* Scroll Container */}
      <div className="overflow-x-auto pb-8 pt-2 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-6 w-max">
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, index) => (
              <DealCardSkeleton key={index} />
            ))
          ) : products.length === 0 ? (
            <div className="w-full flex items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 min-w-[300px]">
              No deals found in your area.
            </div>
          ) : (
            // Product Cards
            products.map((product) => (
              <NearbyDealCard
                key={product.id}
                product={product}
                dealData={generateDealData(product)}
                onClick={handleDealClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- Skeleton Component ---
const DealCardSkeleton = () => (
  <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
    <div className="h-48 bg-gray-100 relative">
      <Skeleton height="100%" />
    </div>
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <Skeleton width={80} height={12} />
        <Skeleton width={30} height={12} />
      </div>
      <Skeleton width="90%" height={20} className="mb-3" />
      <div className="flex gap-2 mb-4">
        <Skeleton width={40} height={16} />
        <Skeleton width={60} height={16} />
      </div>
      <div className="flex justify-between items-end border-t border-gray-100 pt-3">
        <div>
           <Skeleton width={40} height={12} className="mb-1" />
           <Skeleton width={70} height={20} />
        </div>
        <Skeleton type="circle" width={32} height={32} />
      </div>
    </div>
  </div>
);

export default NearbyDeals;