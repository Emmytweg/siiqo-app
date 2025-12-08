"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  CreditCard,
  ShoppingBag,
  User,
  Clock,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LandingPage from "./LandingPage";

// --- THE HERO VISUALIZATION COMPONENT ---
const MarketplaceSimulation = () => {
  const [step, setStep] = useState(0);

  // Cycle through the "story" of a transaction
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000); // Change step every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[600px] h-[450px] flex items-center justify-center perspective-1000">
      
      {/* 1. Background Radar (Representing Local Search) */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="w-[500px] h-[500px] border border-blue-500/10 rounded-full absolute animate-[ping_3s_linear_infinite]" />
        <div className="w-[350px] h-[350px] border border-blue-500/20 rounded-full absolute" />
        <div className="w-[200px] h-[200px] border border-orange-500/20 rounded-full absolute" />
        {/* Map Dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/50 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
          />
        ))}
      </div>

      {/* 2. Connection Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        {/* Line Seller -> Product */}
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
        {/* Line Buyer -> Product */}
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

      {/* 3. The Nodes */}

      {/* LEFT NODE: The Seller */}
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

      {/* CENTER NODE: The Product (The Hero) */}
      <motion.div
        className="relative z-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50" />
          
          {/* Product Image Placeholder */}
          <div className="w-full h-32 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl mb-3 flex items-center justify-center relative">
            <ShoppingBag size={40} className="text-white/20" />
            
            {/* Price Tag */}
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

          {/* Verification Stamp Animation */}
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

      {/* RIGHT NODE: The Buyer */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 md:z-10"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: step >= 1 ? 1 : 0.3 }} // Dim until step 1
        transition={{ duration: 0.8 }}
      >
        <div className="relative bg-slate-800/90 backdrop-blur-md border border-pink-500/30 p-4 rounded-2xl shadow-xl w-40">
           {/* Message Bubble Animation */}
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

      {/* Floating Feature Pills (Bottom) */}
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const [location, setLocation] = useState<string>("");
  const [category, setCategory] = useState<string>("Any Category");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#001d3b] relative overflow-x-hidden selection:bg-orange-500/30">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-orange-500/10 rounded-full blur-[100px]" />
         {/* Grid Pattern Overlay */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <section className="relative z-10 px-4 pt-32 pb-20 mx-auto max-w-7xl lg:pt-40">
        <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
          
          {/* LEFT: Text & Search */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-semibold tracking-wide text-orange-300 uppercase border rounded-full border-orange-500/30 bg-orange-500/10 w-fit">
                <span className="relative flex w-2 h-2 mr-1">
                  <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="relative inline-flex w-2 h-2 bg-orange-500 rounded-full"></span>
                </span>
                Live Marketplace
              </div>
              
              <h1 className="mb-6 text-5xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
                Trade Safely in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0921C]  to-[#E0921C]/50 animate-gradient-x">
                  Real-Time
                </span>
              </h1>
              
              <p className="max-w-xl mb-10 text-lg leading-relaxed text-blue-100/70">
                The most secure way to buy and sell locally. We verify every user, secure every payment, and connect you instantly with neighbors.
              </p>
            </motion.div>

            {/* Modern Search Interface */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative z-20"
            >
              <div className="p-2 mb-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:divide-x divide-white/10 gap-2 md:gap-0">
                  
                  {/* Location */}
                  <div className="flex items-center flex-1 px-4 py-3">
                    <MapPin className="text-[#E0921C] mr-3" size={20} />
                    <div className="flex flex-col w-full">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Where</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-gray-500 text-sm font-medium outline-none"
                        placeholder="Your City or Zip"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center flex-1 px-4 py-3 relative">
                     <ShoppingBag className="text-purple-500 mr-3" size={20} />
                    <div className="flex flex-col w-full">
                       <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">What</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-transparent text-white text-sm font-medium outline-none appearance-none cursor-pointer [&>option]:text-black"
                        >
                          <option>All Items</option>
                          <option>Electronics</option>
                          <option>Fashion</option>
                          <option>Vehicles</option>
                        </select>
                    </div>
                    <ChevronDown className="absolute right-4 text-gray-500 pointer-events-none" size={16} />
                  </div>

                  {/* Search Button */}
                  <div className="p-1">
                    <button 
                      onClick={(e: any) => handleSearch(e)}
                      className="w-full md:w-auto h-14 px-8 bg-gradient-to-r from-[#E0921C]  hover:from-[#E0921C]/80 hover:to-[#E0921C]/50 text-white font-bold rounded-xl shadow-lg shadow-[#E0921C]/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <Search size={18} />
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-blue-200/60 pl-2">
                <span>Popular:</span>
                <span className="hover:text-white cursor-pointer transition-colors border-b border-white/20">iPhones</span>
                <span className="hover:text-white cursor-pointer transition-colors border-b border-white/20">Laptops</span>
                <span className="hover:text-white cursor-pointer transition-colors border-b border-white/20">Furniture</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: The Ecosystem Code Visual */}
          <div className="flex items-center justify-center h-full relative">
             <MarketplaceSimulation />
          </div>

        </div>
      </section>

      <LandingPage />
    </div>
  );
};

export default Homepage;