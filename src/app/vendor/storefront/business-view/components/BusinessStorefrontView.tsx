"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Share2, 
  Clock, 
  Building,
  Star,
  ChevronLeft,
  User,
  Search,
  Globe,
  Lock,
  ShoppingBag,
  Home
} from "lucide-react";
import CustomerBottomTabs from "@/components/ui/CustomerBottomTabs";
import LocationHeader from "@/components/ui/LocationHeader";
import TabNavigation from "./TabNavigation";
import ProductGrid from "./ProductGrid";
import AboutSection from "./AboutSection";
import ReviewsSection from "./ReviewSection";
import ContactSection from "./ContactSection";
import { StorefrontData } from "@/types/vendor/storefront";

// Using the Dummy Data you provided earlier as fallback
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 13 Pro Max - 256GB Gold",
    product_price: 750000,
    description: "Smartphones",
    images: ["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800"],
    stock: 5,
    rating: 4.8
  },
  {
    id: 2,
    name: "Sony WH-1000XM4",
    product_price: 220000,
    description: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"],
    stock: 12,
    rating: 4.9
  }
];

interface Props {
  storefrontData: StorefrontData | null;
  products: any[];
}

type TabId = "products" | "about" | "reviews" | "contact";

const BusinessStorefrontView: React.FC<Props> = ({ storefrontData, products: initialProducts }) => {
  const [activeTab, setActiveTab] = useState<TabId>("products");
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncData = () => {
      const savedLocal = localStorage.getItem("vendorStorefrontDetails");
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        setBusiness({
          ...storefrontData,
          ...parsed,
          // If no products in local, use dummy data
          products: parsed.products?.length > 0 ? parsed.products : DUMMY_PRODUCTS 
        });
      } else {
        setBusiness({ ...storefrontData, products: DUMMY_PRODUCTS });
      }
      setLoading(false);
    };

    syncData();
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, [storefrontData]);

  if (loading || !business) return null;

  const themeColor = business.themeColor || "#1E293B";
  const fontFamily = business.fontFamily || "Inter";

  const renderTabContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">New Arrivals</h3>
              <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase">
                View All
              </span>
            </div>
            {/* Using the grid component logic */}
<ProductGrid products={business.products || []} />          </div>
        );
      case "about":
        return (
          <div className="space-y-4">
             {/* Styled About Card from Image 1 */}
             <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">About</h4>
                   <h3 className="text-sm font-bold text-slate-900">{business.business_name}</h3>
                 </div>
                 <div className="w-16 h-12 bg-slate-100 rounded-xl overflow-hidden border border-slate-50">
                    <img src={business.coverImage || business.profileImage} className="w-full h-full object-cover opacity-80" />
                 </div>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed italic">
                 {business.about || "No business description provided."}
               </p>
             </div>

             {/* Side by side stats from Image 1 */}
             <div className="grid grid-cols-2 gap-3">
               <div className="bg-white rounded-[1.5rem] p-4 flex items-center gap-3 border border-slate-50 shadow-sm">
                 <div className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: themeColor }} />
                 <div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase">Primary Color</p>
                   <p className="text-[11px] font-black text-slate-800 uppercase">{themeColor}</p>
                 </div>
               </div>
               <div className="bg-white rounded-[1.5rem] p-4 flex items-center gap-3 border border-slate-50 shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                   <Globe size={14} />
                 </div>
                 <div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Font Style</p>
                   <p className="text-[11px] font-black text-slate-800">{fontFamily}</p>
                 </div>
               </div>
             </div>
          </div>
        );
      case "contact":
        return <ContactSection business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-40" style={{ fontFamily }}>
      {/* 1. TOP DRAFT BANNER (Image 1) */}
      <div className="bg-[#EF8E52] text-white py-2 px-4 flex items-center justify-center gap-2 text-[10px] font-bold sticky top-0 z-[100]">
        <Lock size={12} fill="currentColor" />
        <span className="tracking-tight uppercase">Private Draft — Not visible to customers</span>
      </div>

      {/* 2. HERO SECTION (Image 1 & 2 Style) */}
      <div className="relative pt-6 pb-20 px-6 text-white" style={{ backgroundColor: themeColor }}>
        {/* Navigation Row */}
        <div className="flex justify-between items-center mb-8">
          <ChevronLeft size={24} />
          <div className="flex gap-4">
            <Search size={20} className="opacity-70" />
            <User size={20} className="opacity-70" />
          </div>
        </div>

        {/* Identity Row */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 border-2 border-white/20">
            <div className="w-full h-full bg-slate-100 rounded-full overflow-hidden">
              {business.profileImage ? (
                <img src={business.profileImage} className="w-full h-full object-cover" />
              ) : <Building size={24} className="text-slate-300 m-auto mt-4" />}
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black leading-tight uppercase tracking-tighter">
                {business.business_name}
              </h2>
              <CheckCircle2 size={16} className="text-blue-400 fill-white" />
            </div>
            <p className="text-[10px] opacity-60 font-bold tracking-widest lowercase">
              siiqo.com/{business.slug}
            </p>
          </div>
        </div>

        {/* Floating Contact Vendor Button (Image 2) */}
        <button 
          className="absolute top-6 right-6 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold"
          onClick={() => window.open(`https://wa.me/${business.phone}`)}
        >
          <MessageCircle size={14} className="text-green-400 fill-green-400" />
          Contact Vendor
        </button>
      </div>

      {/* 3. AVAILABILITY STACKED CHIPS (Previous Correction) */}
     
       <div className="max-w-xl mx-auto px-6 -mt-8 relative z-50 flex flex-col items-start gap-3 bg-white rounded-[2rem] p-4 shadow-lg border border-slate-100 mx-8">
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


      {/* 4. TABS & CONTENT */}
      <div className="max-w-xl mx-auto px-6 mt-8">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as TabId)}
          tabs={[
            { id: "products", label: "Shop", count: business.products?.length || 0 },
            { id: "about", label: "Profile" },
            { id: "contact", label: "Contact" }
          ]}
        />

        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderTabContent()}
        </div>
      </div>

      {/* 5. BOTTOM NAVIGATION BAR (Image 1) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-8 py-4 flex items-center justify-between z-[100]">
        
        
        <button 
          className="bg-slate-900 text-white px-8 py-3.5 rounded-full text-xs font-black shadow-lg shadow-slate-300 transform -translate-y-2 active:scale-95 transition-all"
        >
          Publish Storefront
        </button>
        
        
      </div>
    </div>
  );
};

export default BusinessStorefrontView;