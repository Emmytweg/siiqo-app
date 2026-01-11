"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  MapPin,
  Search,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  ShoppingBag,
  User,
  Zap,
  X,
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LandingPage from "./LandingPage";
import NearbyDealCard, { DealData } from "./ui/NearbyDealsProdCard";
import { Product } from "@/types/products";
import { useLocation } from "@/context/LocationContext";

const CATEGORIES = ["All Items", "Smartphones", "Electronics", "Fashion"];
const ITEMS_PER_PAGE = 4;

// --- THE HERO VISUALIZATION COMPONENT ---
const MarketplaceSimulation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Generate deterministic positions based on index to avoid hydration mismatch
  const getPosition = (index: number) => {
    // Use a simple seeded random based on index for consistent positions
    const seed = index * 12345;
    const random1 = Math.abs(Math.sin(seed) * 10000) % 1;
    const random2 = Math.abs(Math.sin(seed + 1) * 10000) % 1;
    return {
      top: `${random1 * 80 + 10}%`,
      left: `${random2 * 80 + 10}%`,
    };
  };

  return (
    <div className="relative w-full max-w-[600px] h-[450px] flex items-center justify-center perspective-1000">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="w-[500px] h-[500px] border border-blue-500/10 rounded-full absolute animate-[ping_3s_linear_infinite]" />
        <div className="w-[350px] h-[350px] border border-blue-500/20 rounded-full absolute" />
        <div className="w-[200px] h-[200px] border border-orange-500/20 rounded-full absolute" />
        {[...Array(6)].map((_, i) => {
          const position = getPosition(i);
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/50 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
              style={{
                top: position.top,
                left: position.left,
              }}
            />
          );
        })}
      </div>

      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <motion.path
          d="M 120 225 L 300 225"
          fill="transparent"
          stroke="url(#gradient-left)"
          strokeWidth="3"
          strokeDasharray="10 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5 }}
        />
        <motion.path
          d="M 480 225 L 300 225"
          fill="transparent"
          stroke="url(#gradient-right)"
          strokeWidth="3"
          strokeDasharray="10 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 0.5 : 0 }}
          transition={{ duration: 1.5 }}
        />
        <defs>
          <linearGradient id="gradient-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="gradient-right" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        className="absolute left-4 top-[60%] md:top-1/2 -translate-y-1/2 z-30 md:z-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative bg-slate-800/90 backdrop-blur-md border border-blue-500/30 p-4 rounded-2xl shadow-xl w-40">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
              <User size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-blue-200">Seller</span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                Nma <ShieldCheck size={10} className="text-green-400" />
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 bg-slate-900/50 p-2 rounded-lg flex items-center gap-2">
            <MapPin size={10} /> 2.1km away
          </div>
        </div>
      </motion.div>

      <motion.div
        className="relative z-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50" />
          <div className="w-full h-32 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl mb-3 flex items-center justify-center relative">
            <ShoppingBag size={40} className="text-white/20" />
            <motion.div 
               className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: 0.5 }}
            >
              $450
            </motion.div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-white/20 rounded" />
            <div className="h-3 w-1/2 bg-white/10 rounded" />
          </div>
          <AnimatePresence>
            {step >= 3 && (
               <motion.div
                 initial={{ scale: 2, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0, opacity: 0 }}
                 className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-2xl"
               >
                 <div className="flex flex-col items-center">
                   <div className="bg-green-500 text-white p-3 rounded-full mb-2 shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                     <CheckCircle2 size={32} />
                   </div>
                   <span className="text-green-400 font-bold tracking-wider text-sm uppercase">Sold & Verified</span>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 md:z-10"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: step >= 1 ? 1 : 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative bg-slate-800/90 backdrop-blur-md border border-pink-500/30 p-4 rounded-2xl shadow-xl w-40">
          <AnimatePresence>
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-10 right-0 bg-white text-slate-900 text-xs font-medium px-3 py-2 rounded-lg rounded-br-none shadow-lg w-max"
              >
                Is this available? 🤔
              </motion.div>
            )}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-10 right-0 bg-green-500 text-white text-xs font-medium px-3 py-2 rounded-lg rounded-br-none shadow-lg w-max flex items-center gap-1"
              >
                <CreditCard size={12} /> Offer Sent!
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white">
              <User size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-pink-200">Buyer</span>
              <span className="text-xs font-bold text-white">Simba</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute -bottom-10 flex gap-3">
         <FeaturePill icon={<ShieldCheck size={14} />} text="Verified" delay={0.2} />
         <FeaturePill icon={<Zap size={14} />} text="Instant" delay={0.4} />
         <FeaturePill icon={<MapPin size={14} />} text="Local" delay={0.6} />
      </div>
    </div>
  );
};

const FeaturePill = ({ icon, text, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm text-xs text-blue-100"
  >
    {icon} {text}
  </motion.div>
);

// --- MAIN HOMEPAGE ---
const Homepage: React.FC = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [category, setCategory] = useState<string>("All Items");

  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(2);
  const { coords } = useLocation();

  const fetchProducts = async () => {
    try {
      const nearUrl = new URL("https://server.siiqo.com/api/marketplace/search");
      if (coords?.lat && coords?.lng) {
        nearUrl.searchParams.set("lat", String(coords.lat));
        nearUrl.searchParams.set("lng", String(coords.lng));
      }
      const allUrl = new URL("https://server.siiqo.com/api/marketplace/search");
      console.log('[Homepage] Fetch near:', nearUrl.toString(), '| Coords:', coords);
      console.log('[Homepage] Fetch all:', allUrl.toString());
      const [nearRes, allRes] = await Promise.all([
        fetch(nearUrl.toString()),
        fetch(allUrl.toString())
      ]);
      const nearJson = await nearRes.json();
      const allJson = await allRes.json();
      console.log('[Homepage] Near Response:', nearJson);
      console.log('[Homepage] All Response:', allJson);
      const nearProducts = nearJson?.data?.nearby_products || [];
      const nearStores = nearJson?.data?.nearby_stores || [];
      const allProducts = allJson?.data?.products || allJson?.data?.nearby_products || [];
      const allStores = allJson?.data?.stores || allJson?.data?.nearby_stores || [];
      const dedupById = (arr: any[]) => {
        const seen = new Set();
        const out: any[] = [];
        for (const it of arr) {
          const id = it?.id;
          if (id == null) continue;
          if (!seen.has(id)) {
            seen.add(id);
            out.push(it);
          }
        }
        return out;
      };
      const merged = dedupById([...nearProducts, ...allProducts]);
      merged.sort((a, b) => {
        const da = typeof a.distance_km === 'number' ? a.distance_km : Infinity;
        const db = typeof b.distance_km === 'number' ? b.distance_km : Infinity;
        return da - db;
      });
      setProducts(merged);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [coords]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return results.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [results, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);

    setTimeout(() => {
      const filtered = products.filter((item) => {
        const matchesWhat = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesWhere = location === "" || item.vendor.business_name.toLowerCase().includes(location.toLowerCase());
        const matchesCat = category === "All Items" || category === "Any Category" || item.category === category;
        return matchesWhat && matchesWhere && matchesCat;
      });

      setResults(filtered);
      setHasSearched(true);
      setIsSearching(false);
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 600);
  };

  const resetSearch = () => {
    setHasSearched(false);
    setSearchQuery("");
    setLocation("");
    setCategory("All Items");
    setCurrentPage(1);
  };

  const generateDealData = (product: any): DealData => ({
    price: product.originalPrice ? product.originalPrice * 1.15 : product.price,
    distance_km: product.distance_km || null,
    id: product.id || null,
    image: product.images?.[0] || null,
    name: product.name || null,
    vendor_name: product.vendor?.vendor_name || null,
    crypto_price: product.crypto_price || null,
    discount: 0,
    rating: 0,
    condition: ""
  });

  return (
    <div className="min-h-screen bg-[#001d3b] relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-orange-500/10 rounded-full blur-[100px]" />
      </div>

      <section className="relative z-10 px-4 pt-32 pb-20 mx-auto max-w-7xl lg:pt-40">
        <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="mb-6 text-5xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
                Trade Safely in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0921C] to-[#E0921C]/50 animate-gradient-x">
                  Real-Time
                </span>
              </h1>
              <p className="max-w-xl mb-10 text-lg leading-relaxed text-blue-100/70">
                Secure local trading. We verify users and secure payments instantly.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20"
            >
              <div className="p-2 mb-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:divide-x divide-white/10 gap-2 md:gap-0">
                  <div className="flex items-center flex-1 px-4 py-3">
                    <Search className="text-[#E0921C] mr-3" size={20} />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">What</label>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-gray-500 text-sm font-medium outline-none"
                        placeholder="Search items..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center flex-1 px-4 py-3">
                    <MapPin className="text-[#E0921C] mr-3" size={20} />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Where</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-gray-500 text-sm font-medium outline-none"
                        placeholder="City or Zip"
                      />
                    </div>
                  </div>

                  <div className="flex items-center flex-1 px-4 py-3 relative">
                    <div className="flex flex-col w-full rounded-md" ref={dropdownRef}>
                      <label className="text-[10px] uppercase font-bold text-[#E0921C] tracking-wider mb-1">
                        Category
                      </label>
                      <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <ShoppingBag size={16} className="text-purple-400 shrink-0" />
                          <span className="text-white text-sm font-medium truncate">
                            {category}
                          </span>
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                        />
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden bg-[#0A1D3B]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                          >
                            <div className="py-2 max-h-[240px] overflow-y-auto scrollbar-hide">
                              {CATEGORIES.map((item) => (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => {
                                    setCategory(item);
                                    setIsOpen(false);
                                  }}
                                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-blue-100/80 hover:bg-[#E0921C] hover:text-white transition-all text-left"
                                >
                                  {item}
                                  {category === item && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                      <Check size={14} className="text-white" />
                                    </motion.div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="p-1">
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="w-full md:w-auto h-14 px-8 bg-[#E0921C] text-white font-bold rounded-xl shadow-lg hover:bg-[#E0921C]/80 transition-all flex items-center justify-center gap-2"
                    >
                      {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search size={18} />}
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.form>
          </div>

          <div className="flex items-center justify-center h-full relative">
            <MarketplaceSimulation />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {hasSearched && (
          <motion.section
            id="results-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="relative z-20 max-w-7xl mx-auto px-4 py-16 bg-white rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.2)]"
          >
            {/* PAGINATION: LEFT SIDE BUTTON */}
            {totalPages > 1 && (
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-4 bg-white border border-slate-200 rounded-full shadow-2xl text-[#E0921C] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:scale-110 transition-all hidden lg:flex"
              >
                <ChevronLeft size={32} strokeWidth={3} />
              </button>
            )}

            {/* PAGINATION: RIGHT SIDE BUTTON */}
            {totalPages > 1 && (
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-4 bg-white border border-slate-200 rounded-full shadow-2xl text-[#E0921C] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:scale-110 transition-all hidden lg:flex"
              >
                <ChevronRight size={32} strokeWidth={3} />
              </button>
            )}

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Found {results.length} Items</h2>
                <p className="text-slate-500">Page {currentPage} of {totalPages || 1}</p>
              </div>
              <button
                onClick={resetSearch}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative px-2">
                {paginatedResults.map((product) => (
                  <NearbyDealCard
                    key={product.id}
                    product={product}
                    dealData={generateDealData(product)}
                    onClick={(id) => router.push(`/products/${encodeURIComponent(id)}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No matches found</h3>
                <p className="text-slate-500">Try adjusting your keywords.</p>
              </div>
            )}

            {/* MOBILE ONLY FALLBACK BOTTOM PAGINATION */}
            {totalPages > 1 && (
              <div className="flex lg:hidden items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-slate-100 rounded-xl disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="font-bold text-slate-700">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-slate-100 rounded-xl disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <LandingPage />
    </div>
  );
};

export default Homepage;