"use client";
import React, { useState, useEffect } from "react";
import LocationHeader from "@/components/ui/LocationHeader";
import TabNavigation from "./TabNavigation";
import ProductGrid from "./ProductGrid";
import { useToast } from "@/hooks/use-toast";
import { 
  Lock, Clock, Building, Globe, CheckCircle2, 
  ChevronLeft, User, Search, Home, ShoppingBag, 
  Settings, Info
} from "lucide-react";

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    description: "Laptops",
    product_price: 20.90,
    images: ["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800"],
    stock: 5,
  },
  {
    id: 2,
    name: "Phone Accessories",
    description: "Electronics",
    product_price: 20.00,
    images: ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800"],
    stock: 4,
  }
];

const BusinessStorefrontPreview = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    const savedLocal = localStorage.getItem("vendorStorefrontDetails");
    if (savedLocal) {
      const parsed = JSON.parse(savedLocal);
      if (!parsed.products || parsed.products.length === 0) parsed.products = DUMMY_PRODUCTS;
      setBusiness(parsed);
    }
  }, []);

  if (!business) return null;

  const themeColor = business?.themeColor || "#1E293B";

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-40 font-sans">
      {/* 1. TOP BANNER - Matching Pic 1 & 2 */}
      <div className="bg-[#EF8E52] text-white py-2 px-4 flex items-center justify-center gap-2 text-[10px] font-bold sticky top-0 z-[100]">
        <Lock size={12} fill="currentColor" />
        <span className="tracking-tight">PRIVATE DRAFT — Not visible to customers</span>
      </div>

    {/* 2. HEADER SECTION - Professional Cover Image Layout */}
<div className="relative w-full overflow-hidden font-sans">
  {/* Cover Image Container */}
  <div className="relative h-64 w-full bg-slate-200">
    {business.coverImage ? (
      <>
        <img 
          src={business.coverImage} 
          className="w-full h-full object-cover" 
          alt="Cover" 
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </>
    ) : (
      <div 
        className="w-full h-full flex items-center justify-center" 
        style={{ backgroundColor: themeColor }}
      >
        <Building size={48} className="text-white/20" />
      </div>
    )}

    {/* Top Navigation Icons (Absolute on top of Image) */}
    <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white">
      <button className="p-2 bg-black/20 backdrop-blur-md rounded-xl hover:bg-black/40 transition-colors">
        <ChevronLeft size={20} />
      </button>
      <div className="flex gap-3">
        <button className="p-2 bg-black/20 backdrop-blur-md rounded-xl">
          <Search size={20} />
        </button>
        <button className="p-2 bg-black/20 backdrop-blur-md rounded-xl">
          <User size={20} />
        </button>
      </div>
    </div>
  </div>

  {/* Business Info - Overlapping the cover image slightly */}
  <div className="relative px-6 -mt-12 mb-6 flex items-end gap-4">
    {/* Profile Image / Logo */}
    <div className="relative flex-shrink-0">
      <div className="w-20 h-20 bg-white rounded-[2rem] p-1 shadow-xl">
        <div className="w-full h-full bg-slate-50 rounded-[1.8rem] flex items-center justify-center overflow-hidden border border-slate-100">
          {business.profileImage ? (
            <img src={business.profileImage} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            <Building size={32} className="text-slate-300" />
          )}
        </div>
      </div>
      {/* Verified Badge */}
      <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full border-4 border-[#F1F5F9]">
        <CheckCircle2 size={12} className="text-white" />
      </div>
    </div>

    {/* Name and Slug - White text when over image, or styled for visibility */}
    <div className="pb-10 text-black">
      <h2 className="text-xl font-black text-white drop-shadow-md leading-tight">
        {business.business_name}
      </h2>
      <div className="flex items-center gap-1.5 text-white/80">
        <Globe size={10} />
        <p className="text-[10px] font-bold tracking-wide">
          siiqo.com/{business.slug || 'store'}
        </p>
      </div>
    </div>
  </div>
</div>

      {/* 3. CONTENT WRAPPER (Overlapping Card Style) */}
      <div className="px-4 mt-4 space-y-4 relative z-50">
        
        {/* ABOUT CARD - Matching Pic 1 */}
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">About</h4>
              
              <h3 className="text-sm font-bold text-slate-900">{business.business_name}</h3>
               <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
            {business.about}
          </p>
      <div className="flex flex-col gap-2 px-2">
  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
    Availability
  </span>
  
  <div className="flex flex-col items-start gap-3">
    {/* Days Row */}
    <div className="flex -space-x-1.5">
      {business.selectedDays.map((day:string, index:number)  => (
        <div 
          key={index} 
          className="w-8 h-8 rounded-xl text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm transition-transform hover:scale-110" 
          style={{ 
            backgroundColor: business.themeColor,
            zIndex: business.selectedDays.length - index 
          }}
          title={day}
        >
          {day.charAt(0)}
        </div>
      ))}
    </div>

    {/* Time Column */}
    <div className="flex flex-col">
      <div className="flex items-center gap-1 text-slate-900 font-bold text-xs">
        <Clock size={12} className="text-slate-400" />
        <span>{business.openTime} — {business.closeTime}</span>
      </div>
      <p className="text-[9px] text-slate-400 font-medium">Daily Operating Hours</p>
    </div>
  </div>
</div>
            </div>
            <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden">
               {/* Mock image from your screenshot */}
               <img src="https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-50" />
            </div>
          </div>
         
        </div>

        {/* STYLE PREVIEW SECTION - Matching Pic 1 (Side-by-side Cards) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-[1.5rem] p-4 flex items-center gap-3 border border-slate-50 shadow-sm">
            <div className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: business.themeColor }} />
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Primary Color</p>
              <p className="text-[11px] font-bold text-slate-800">Theme Color</p>
            </div>
          </div>
          <div className="bg-white rounded-[1.5rem] p-4 flex items-center gap-3 border border-slate-50 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <Globe size={14} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Font</p>
              <p className="text-[11px] font-bold text-slate-800">{business.fontFamily}</p>
            </div>
          </div>
        </div>

        {/* SETTINGS TOGGLES - Matching Pic 1 */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 flex justify-between items-center border border-slate-50 shadow-sm">
             <span className="text-xs font-bold text-slate-700">Font Style</span>
             <div className="w-10 h-5 bg-slate-200 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5" /></div>
          </div>
          <div className="bg-white rounded-2xl p-4 flex justify-between items-center border border-slate-50 shadow-sm">
             <span className="text-xs font-bold text-slate-700">Storefront Visibility</span>
             <div className="w-10 h-5 bg-slate-200 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5" /></div>
          </div>
        </div>

        {/* NEW ARRIVALS - Matching Pic 1 (List Layout) */}
        <div className="pt-4">
          <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">New Arrivals</h3>
            <span className="text-[10px] font-bold text-orange-500">View All</span>
          </div>
          
          <div className="space-y-3">
            {business.products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-[1.5rem] p-3 flex items-center justify-between border border-slate-50 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden">
                    <img src={product.images?.[0]} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-900">{product.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{product.description}</p>
                  </div>
                </div>
                <span className="text-[11px] font-black text-slate-900">${product.product_price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM NAVIGATION - Matching Pic 1 (Floating Button) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex items-center justify-between z-[100]">
       
        
        <button 
          className="bg-[#1E293B] text-white px-8 py-3 rounded-full text-xs font-black shadow-lg shadow-slate-200 transform -translate-y-2 active:scale-95 transition-all"
          onClick={() => toast({ title: "Store Published!" })}
        >
          Publish Storefront
        </button>
        
     
      </div>
    </div>
  );
};

export default BusinessStorefrontPreview;