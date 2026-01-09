"use client";

import React, { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import ProductCard from "./components/ProductCard";
import SearchSuggestions from "./components/SearchSuggestions";
import FilterPanel from "./components/FilterPanel";

const MarketplaceBrowse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<"storefront" | "product">("product");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [storefronts, setStorefronts] = useState<any[]>([]);
  const [hasError, setHasError] = useState(false);

  const [activeFilters, setActiveFilters] = useState<any>({
    categories: [],
    vendors: [],
    priceRange: { min: '', max: '' },
    minRating: 0,
    availability: { inStock: false, onSale: false, freeShipping: false }
  });

  // Pagination state (client-side paging of fetched results)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3 cols x 3 rows by default

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters, searchMode]);

  const totalItemsCount = useMemo(() => {
    let curr = searchMode === "product" ? [...products] : [...storefronts];

    if (activeFilters.priceRange?.max) {
      curr = curr.filter((p) => p.price <= parseFloat(activeFilters.priceRange.max));
    }

    if (searchQuery) {
      curr = curr.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return curr.length;
  }, [products, storefronts, activeFilters, searchMode, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(totalItemsCount / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const categoriesList = ["Popular Categories", "Featured Storefront", "Shop by Distance"];

  // Mapping logic updated for your specific API response keys
  const transformApiProduct = useCallback((item: any) => {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: Math.round(item.price * 1.2), 
      image: item.image , // Fallback for null images
      seller: item.vendor_name || "Unknown Seller",
      rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Mocked as not in API
      reviewCount: Math.floor(Math.random() * 50),
      distance: item.distance_km ? `${item.distance_km} km` : "Nearby",
      condition: "New",
      category: "General",
      isVerified: true,
      availability: "In Stock",
      location: "Local Area",
      postedDate: new Date().toISOString().split("T")[0],
      isProduct: true,
      crypto_price: item.crypto_price
    };
  }, []);

  const transformApiStorefront = useCallback((store: any) => {
    return {
      id: store.id,
      name: store.business_name || store.name || "Store",
      image: store.logo ,
      price: 0,
      seller: store.vendor_name || store.business_name,
      rating: 4.5,
      reviewCount: 10,
      distance: store.distance_km ? `${store.distance_km} km` : "0.5 km",
      category: "Storefront",
      isVerified: true,
      availability: "Open Now",
      location: store.city || "Online",
      isProduct: false,
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      // Using the specific URL provided
      const response = await fetch("https://server.siiqo.com/api/marketplace/search");
      const result = await response.json();

      if (result.status === "success" && result.data) {
        const p = (result.data.nearby_products || []).map(transformApiProduct);
        const s = (result.data.nearby_stores || []).map(transformApiStorefront);

        setProducts(p);
        setStorefronts(s);
        
        if (p.length === 0 && s.length === 0) {
            // Optional: handle empty state
        }
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Marketplace Fetch Error:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
    fetchData();
  }, [searchParams]);

  const displayItems = useMemo(() => {
    let current = searchMode === "product" ? [...products] : [...storefronts];

    // Local filter application
    if (activeFilters.priceRange?.max) {
      current = current.filter((p) => p.price <= parseFloat(activeFilters.priceRange.max));
    }
    
    // Simple local search filter for the UI
    if (searchQuery) {
        current = current.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Pagination slice
    const start = (currentPage - 1) * itemsPerPage;
    return current.slice(start, start + itemsPerPage);
  }, [products, storefronts, activeFilters, searchMode, searchQuery, currentPage]);

  const handleSearchSubmit = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query);
    else params.delete("q");
    
    router.push(`/marketplace?${params.toString()}`);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-100 font-sans flex flex-col overflow-hidden">
      
      {/* LEFT PANEL - Glass UI Logic maintained */}
      <div className="hidden md:flex md:fixed md:left-0 md:top-16 md:w-2/5 md:h-screen md:z-0 bg-white/60 backdrop-blur-xl border-r border-white/40 flex-col items-start p-6 overflow-y-auto">
        
        <div className="w-[90%] mb-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(searchQuery)}
              className="w-full placeholder-slate-400 py-3 pl-10 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            
            {showSuggestions && (
              <SearchSuggestions 
                query={searchQuery} 
                onSelect={handleSearchSubmit} 
                recentSearches={[]} 
                popularSearches={["Electronics", "Furniture", "Fashion"]} 
                onSelectSuggestion={(val: string) => handleSearchSubmit(val)} 
                onClose={() => setShowSuggestions(false)}
              />
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold cursor-pointer ${searchMode === 'storefront' ? 'text-gray-900' : 'text-gray-400'}`} onClick={() => setSearchMode('storefront')}>Storefront</span>
              <div onClick={() => setSearchMode(searchMode === "product" ? "storefront" : "product")} className={`w-12 h-6 rounded-full cursor-pointer p-1 transition-all ${searchMode === "product" ? "bg-blue-500" : "bg-gray-300"}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all ${searchMode === "product" ? "translate-x-6" : "translate-x-0"}`} />
              </div>
              <span className={`text-xs font-bold cursor-pointer ${searchMode === 'product' ? 'text-gray-900' : 'text-gray-400'}`} onClick={() => setSearchMode('product')}>Product</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center overflow-x-auto scrollbar-hide py-4 md:py-5 mb-4 w-full">
          {categoriesList.map((category) => (
            <button key={category} className="whitespace-nowrap px-3 py-2 rounded-full bg-white/50 border border-white/60 text-sm font-medium text-slate-600 shadow-sm hover:bg-white/90 transition-all active:scale-95 flex-shrink-0">
              {category}
            </button>
          ))}
        </div>

        <div className="w-full mt-2 z-0">
          <FilterPanel
            isOpen={true}
            isMobile={false}
            filters={activeFilters}
            onFiltersChange={(filters: any) => setActiveFilters(filters)}
          />
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden w-full bg-white/60 backdrop-blur-xl border-b border-white/40 p-4 sticky top-0 z-20">
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(searchQuery)}
            className="w-full py-2 pl-8 pr-10 rounded-full border border-gray-300 text-sm"
          />
          <Icon name="Search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <button onClick={() => setIsFilterOpen(true)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
            <Icon name="Filter" size={14} />
          </button>
        </div>
      </div>

      {/* RIGHT PRODUCT RESULTS */}
      <div className="w-full md:ml-[40%] md:w-3/5 p-4 overflow-y-auto flex-1 mt-40 mb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 font-medium">Loading nearby items...</p>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <Icon name="AlertCircle" size={40} className="text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">Issue loading marketplace</h3>
            <button onClick={fetchData} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full active:scale-95 transition-transform">Try Again</button>
          </div>
        ) : (
          <>
            <div className="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {displayItems.map((item) => (
                <ProductCard
                  key={`${item.isProduct ? 'p' : 's'}-${item.id}`}
                  product={item}
                  onAddToCart={() => {}}
                  onQuickView={() => {}}
                  onAddToWishlist={() => {}}
                  cartQuantities={{}}
                  isAddingToCart={{}}
                />
              ))}
              {displayItems.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-400">
                      No items found matching your search.
                  </div>
              )}
            </div>

            {/* Pagination (desktop right bottom) */}
            {totalItemsCount > itemsPerPage && (
              <>
                <div className="hidden md:flex items-center gap-2 fixed bottom-6 right-6 z-30">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50">
                    Prev
                  </button>

                  <div className="bg-white border px-3 py-1 rounded-md text-sm shadow-sm">
                    Page {currentPage} / {totalPages}
                  </div>

                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50">
                    Next
                  </button>
                </div>

                {/* Mobile pagination bottom */}
                <div className="md:hidden mt-4 flex items-center justify-center gap-3">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="px-3 py-2 rounded-full border">Prev</button>
                  <span className="text-sm text-gray-500">Page {currentPage}/{totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="px-3 py-2 rounded-full border">Next</button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        isMobile={true}
        filters={activeFilters}
        onFiltersChange={(filters: any) => setActiveFilters(filters)}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};

const MarketPlaceBrowsePage = () => (
  <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
    <MarketplaceBrowse />
  </Suspense>
);

export default MarketPlaceBrowsePage;