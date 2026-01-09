"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import FilterDrawer from "@/components/ui/FilterDrawer";
import ProductCard from "./components/ProductCard";
import QuickFilters from "./components/QuickFilters";
import SearchSuggestions from "./components/SearchSuggestions";
import { Filter } from "@/types/search-results";

// --- Types --- //
interface MapCenter {
  lat: number;
  lng: number;
}

const SearchResults = () => {
  // --- State --- //
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showMapFull, setShowMapFull] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMode, setSearchMode] = useState<'storefront' | 'product'>('product');
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [mapCenter] = useState<MapCenter>({ lat: 6.5244, lng: 3.3792 });

  // --- PAGINATION STATE --- //
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const router = useRouter();
  const searchParams = useSearchParams();

  const transformNearbyItem = (item: any, isProduct: boolean): any => {
    return {
      id: item.id,
      name: item.name || item.business_name || "Unnamed Item",
      price: item.price || 0,
      originalPrice: item.price ? Math.round(item.price * 1.15) : 0, 
      image: item.image ,
      seller: item.vendor_name || "Verified Seller",
      rating: "4.8", 
      reviewCount: Math.floor(Math.random() * 100) + 10,
      distance: item.distance_km ? item.distance_km.toFixed(1) : (Math.random() * 5 + 0.5).toFixed(1),
      condition: "New",
      category: isProduct ? "Product" : "Store",
      isVerified: true,
      availability: "In Stock",
      location: "Lagos, NG",
      postedDate: new Date().toISOString().split('T')[0],
      isProduct: isProduct,
      coordinates: { 
        lat: mapCenter.lat + (Math.random() * 0.04 - 0.02), 
        lng: mapCenter.lng + (Math.random() * 0.04 - 0.02) 
      }
    };
  };

 const fetchProducts = async (query: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://server.siiqo.com/api/marketplace/search?q=${encodeURIComponent(query)}`);
      const result = await response.json();
      if (result.status === "success") {
        const { nearby_products, nearby_stores } = result.data;
        setProducts((nearby_products || []).map((p: any) => transformNearbyItem(p, true)));
        setStores((nearby_stores || []).map((s: any) => transformNearbyItem(s, false)));
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
console.log("Products:", products);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    if (query) {
      setSearchQuery(query);
      setHasSearched(true);
      fetchProducts(query);
    }
  }, [searchParams]);
  // --- PAGINATION LOGIC --- //
  const { paginatedItems, totalPages } = useMemo(() => {
    let currentList = searchMode === 'product' ? [...products] : [...stores];
    activeFilters.forEach((filter) => {
        if (filter.type === "price") currentList = currentList.filter(p => p.price <= filter.value);
        if (filter.type === "distance") currentList = currentList.filter(p => parseFloat(p.distance) <= filter.value);
    });

    const total = Math.ceil(currentList.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    return {
        paginatedItems: currentList.slice(start, start + itemsPerPage),
        totalPages: total
    };
  }, [products, stores, activeFilters, searchMode, currentPage]);

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) setCurrentPage(prev => prev + 1);
    if (direction === 'prev' && currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleSearchSubmit = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", query);
    router.push(`/search-results?${params.toString()}`);
    setShowSuggestions(false);
    setHasSearched(true);
    setCurrentPage(1); 
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1B3F61] font-sans">
      
      {/* 1. Map Layer */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${hasSearched ? 'opacity-100' : 'opacity-0'}`}>
         <iframe width="100%" height="100%" title="Search Map" src={`https://maps.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=14&output=embed`} className="w-full h-full filter brightness-90 grayscale-[0.2]" style={{ border: 0 }} />
      </div>

      {/* 2. Glass UI Panel */}
      <div 
        className={`absolute top-0 bottom-0 left-0 z-50 w-full h-screen md:w-[450px] bg-white/70 backdrop-blur-2xl border-r border-white/40 shadow-2xl transition-all duration-500 ease-in-out flex flex-col ${showMapFull ? '-translate-x-full ' : 'translate-x-0'} ${!hasSearched ? 'mt-20 md:w-full items-center justify-center bg-white/0 top-0 backdrop-blur-none border-none' : 'mt-0 top-0'}`}
      >
        <div className={`flex flex-col w-full h-full ${!hasSearched ? 'max-w-xl p-6' : ''}`}>
            
            <div className="flex-none p-5 pb-2">
                <div className="relative z-50 mb-4">
                    <div className="relative group shadow-xl rounded-full overflow-hidden border border-white/50 bg-white/90">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Icon name="Search" size={18} className="text-slate-600" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products or stores..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
                            onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit(searchQuery)}
                            className="w-full py-4 pl-12 pr-12 text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                    </div>
                </div>

                {hasSearched && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex items-center justify-center mb-5 gap-4">
                            <button onClick={() => { setSearchMode('storefront'); setCurrentPage(1); }} className={`text-[10px] font-black uppercase tracking-[2px] ${searchMode === 'storefront' ? 'text-primary' : 'text-slate-400'}`}>Stores</button>
                            <button onClick={() => { setSearchMode(prev => prev === 'product' ? 'storefront' : 'product'); setCurrentPage(1); }} className="relative w-12 h-6 bg-slate-200 rounded-full p-1">
                                <div className={`w-4 h-4 bg-primary rounded-full transition-transform duration-300 ${searchMode === 'product' ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            <button onClick={() => { setSearchMode('product'); setCurrentPage(1); }} className={`text-[10px] font-black uppercase tracking-[2px] ${searchMode === 'product' ? 'text-primary' : 'text-slate-400'}`}>Products</button>
                        </div>
                        <QuickFilters onApplyFilter={(f) => { setActiveFilters([...activeFilters, {...f, id: Date.now().toString()}]); setCurrentPage(1); }} />
                    </div>
                )}
            </div>

            {/* Results List */}
            {hasSearched && (
                <div className="flex-1 overflow-y-auto px-5 pb-4 scrollbar-hide">
                    <div className="space-y-4 mt-2">
                        {isLoading ? (
                            <div className="flex justify-center py-10"><Icon name="Loader2" className="animate-spin text-primary" /></div>
                        ) : paginatedItems.length === 0 ? (
                            <div className="text-center py-20 opacity-50">
                                <Icon name="PackageSearch" size={48} className="mx-auto mb-2" />
                                <p>No {searchMode}s found nearby</p>
                            </div>
                        ) : (
                            paginatedItems.map((item) => (
                                <ProductCard
                                    key={`${item.id}-${searchMode}`}
                                    product={item}
                                    onClick={() => router.push(`/${searchMode === 'product' ? 'product' : 'store'}-detail?id=${item.id}`)}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* NEW: Pagination at the bottom of the left hand side glass panel */}
            {hasSearched && totalPages > 1 && (
                <div className="flex-none p-4 pb-28 md:pb-24 border-t border-white/30 bg-white/40 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-4">
                        <button 
                            onClick={() => handlePageChange('prev')}
                            disabled={currentPage === 1}
                            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs uppercase tracking-widest ${currentPage === 1 ? 'bg-slate-200/50 text-slate-400 cursor-not-allowed' : 'bg-white text-primary shadow-lg hover:bg-slate-50'}`}
                        >
                            <Icon name="ChevronLeft" size={16} />
                            Prev
                        </button>
                        
                        <div className="px-4 text-[10px] font-black text-slate-600 whitespace-nowrap">
                            {currentPage} / {totalPages}
                        </div>

                        <button 
                            onClick={() => handlePageChange('next')}
                            disabled={currentPage === totalPages}
                            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold text-xs uppercase tracking-widest ${currentPage === totalPages ? 'bg-slate-200/50 text-slate-400 cursor-not-allowed' : 'bg-white text-primary shadow-lg hover:bg-slate-50'}`}
                        >
                            Next
                            <Icon name="ChevronRight" size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Map Toggle Button */}
      {hasSearched && (
        <button onClick={() => setShowMapFull(!showMapFull)} className="fixed z-[70] bottom-10 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
            <Icon name={showMapFull ? "List" : "Map"} size={24} />
        </button>
      )}
    </div>
  );
};

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#1B3F61] text-white uppercase tracking-widest text-xs">Initialising Map...</div>}>
      <SearchResults />
    </Suspense>
  );
}