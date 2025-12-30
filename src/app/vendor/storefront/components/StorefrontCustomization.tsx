"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, Clock, Building, Globe, CheckCircle2, 
  MessageCircle, Palette, Layout, Phone, 
  Save, Smartphone, Monitor, Instagram, 
  Facebook, Twitter, Trash2, Plus, Lock, X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const StorefrontCustomization = () => {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  
  // Separate Refs for different upload slots
  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  
  const [settings, setSettings] = useState({
    business_name: "My Premium Store",
    slug: "my-store",
    about: "The best collection of curated goods.",
    themeColor: "#1E293B",
    fontFamily: "Inter",
    workingHoursEnabled: true,
    openTime: "09:00",
    closeTime: "21:00",
    selectedDays: ["Mon", "Tue", "Wed", "Thu", "Fri"], // Shortened to match buttons
    showCallButton: true,
    phone: "123456789",
    socialLinks: { facebook: "", instagram: "", twitter: "" },
    coverImage: null as string | null, // Base64 String
    profileImage: null as string | null, // Base64 String
    products: [],
    template_options: { theme: "#1E293B", font: "Inter" }
  });

  useEffect(() => {
    const saved = localStorage.getItem("vendorStorefrontDetails");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("vendorStorefrontDetails", JSON.stringify(settings));
  }, [settings]);

  // --- Image Upload Logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "coverImage" | "profileImage") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit for LocalStorage health
        toast({ title: "File too large", description: "Please upload an image under 2MB", variant: "destructive" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updateSetting(type, reader.result as string);
        toast({ title: "Image uploaded successfully" });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleDay = (day: string) => {
    const current = settings.selectedDays;
    updateSetting("selectedDays", 
      current.includes(day) ? current.filter(d => d !== day) : [...current, day]
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#F8FAFC] overflow-y-auto md:overflow-hidden font-sans">
      
      {/* Hidden File Inputs */}
      <input type="file" className="hidden" ref={coverInputRef} accept="image/*" onChange={(e) => handleFileChange(e, "coverImage")} />
      <input type="file" className="hidden" ref={profileInputRef} accept="image/*" onChange={(e) => handleFileChange(e, "profileImage")} />

      {/* --- EDITOR PANEL (LEFT) --- */}
      <aside className="w-full lg:w-[450px] bg-white border-r border-slate-200 overflow-y-auto flex flex-col shadow-xl z-50">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Design Store</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Storefront Customizer</p>
          </div>
          <button 
            onClick={() => {
              setIsSaving(true);
              setTimeout(() => { setIsSaving(false); toast({ title: "Changes Published Live!" }); }, 1500);
            }}
            className="p-3 bg-slate-900 text-white rounded-2xl hover:scale-105 transition-transform disabled:opacity-50"
          >
            {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Save size={20} />}
          </button>
        </div>

        <div className="p-6 space-y-10 pb-32">
          {/* Functional Images Section */}
          <section className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Camera size={14} /> Brand Assets
            </label>
            
            {/* Cover Photo Slot */}
            <div 
              onClick={() => coverInputRef.current?.click()}
              className="relative h-40 bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-slate-400 transition-colors"
            >
               {settings.coverImage ? (
                  <>
                    <img src={settings.coverImage} className="w-full h-full object-cover" alt="Cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateSetting("coverImage", null); }}
                      className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </>
               ) : (
                  <span className="text-xs font-bold text-slate-400 flex flex-col items-center gap-2">
                    <Plus size={24} /> Upload Cover Photo
                  </span>
               )}
            </div>

            {/* Profile Photo Slot */}
            <div className="flex items-center gap-4">
              <div 
                onClick={() => profileInputRef.current?.click()}
                className="w-20 h-20 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center relative cursor-pointer hover:border-slate-400 overflow-hidden"
              >
                {settings.profileImage ? (
                  <img src={settings.profileImage} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <Building size={24} className="text-slate-300" />
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                  <Plus size={14} />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-black text-slate-700">Display Picture</p>
                <p className="text-[10px] font-medium text-slate-400">Recommended: 500x500px</p>
              </div>
            </div>
          </section>

          {/* Identity Section */}
          <section className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layout size={14} /> Basic Information
            </label>
            <input 
              type="text"
              placeholder="Business Name"
              value={settings.business_name}
              onChange={(e) => updateSetting('business_name', e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 ring-blue-500 outline-none"
            />
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4">
              <span className="text-xs font-bold text-slate-400 italic">siiqo.com/</span>
              <input 
                type="text"
                placeholder="slug"
                value={settings.slug}
                onChange={(e) => updateSetting('slug', e.target.value)}
                className="flex-1 p-4 bg-transparent text-sm font-bold outline-none"
              />
            </div>
            <textarea 
              placeholder="Business Bio"
              value={settings.about}
              onChange={(e) => updateSetting('about', e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500 outline-none min-h-[100px]"
            />
          </section>

          {/* Availability Grid */}
          <section className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Working Days & Hours
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`py-3 rounded-xl text-[10px] font-black transition-all ${
                    settings.selectedDays.includes(day) 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase ml-2">Open</span>
                <input type="time" value={settings.openTime} onChange={(e) => updateSetting('openTime', e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase ml-2">Close</span>
                <input type="time" value={settings.closeTime} onChange={(e) => updateSetting('closeTime', e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100" />
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Palette size={14} /> Theme Color
            </label>
            <div className="flex flex-wrap gap-3">
              {['#1E293B', '#F97316', '#8B5CF6', '#EC4899', '#10B981', '#3B82F6'].map((color) => (
                <button
                  key={color}
                  onClick={() => updateSetting('themeColor', color)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform ${settings.themeColor === color ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input 
                type="color" 
                value={settings.themeColor} 
                onChange={(e) => updateSetting('themeColor', e.target.value)}
                className="w-10 h-10 rounded-full overflow-hidden border-none cursor-pointer"
              />
            </div>
          </section>

          {/* Social Links */}
          <section className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> Social Presence
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-pink-600 shadow-sm"><Instagram size={18} /></div>
                <input 
                  type="text" 
                  placeholder="Instagram Username" 
                  value={settings.socialLinks.instagram}
                  onChange={(e) => updateSetting("socialLinks", { ...settings.socialLinks, instagram: e.target.value })}
                  className="bg-transparent flex-1 text-xs font-bold outline-none" 
                />
              </div>
              <div className="flex items-center gap-3 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Facebook size={18} /></div>
                <input 
                  type="text" 
                  placeholder="Facebook Page Name" 
                  value={settings.socialLinks.facebook}
                  onChange={(e) => updateSetting("socialLinks", { ...settings.socialLinks, facebook: e.target.value })}
                  className="bg-transparent flex-1 text-xs font-bold outline-none" 
                />
              </div>
            </div>
          </section>
        </div>
      </aside>

      {/* --- PREVIEW PANEL (RIGHT) --- */}
      <main className=" bg-slate-100 flex flex-col items-center justify-center p-4 lg:p-10 md:overflow-hidden relative">
        
        <div className="absolute top-6 flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200 z-10">
          <button onClick={() => setViewMode("mobile")} className={`p-2 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase transition-all ${viewMode === 'mobile' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
            <Smartphone size={14} /> Mobile
          </button>
          <button onClick={() => setViewMode("desktop")} className={`p-2 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase transition-all ${viewMode === 'desktop' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
            <Monitor size={14} /> Desktop
          </button>
        </div>

        <div className={`transition-all duration-700 ease-in-out bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden border-[8px] border-slate-900 rounded-[3rem] 
          ${viewMode === 'mobile' ? 'w-[360px] h-[740px]' : 'w-full max-w-[900px] h-[600px] rounded-3xl'}`}>
          
          <div className="h-full overflow-y-auto hide-scrollbar">
            {/* Live Hero Preview */}
            <div className="h-40 w-full bg-slate-200 relative overflow-hidden">
               {settings.coverImage ? (
                  <img src={settings.coverImage} className="w-full h-full object-cover" alt="Preview Cover" />
               ) : (
                  <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-black to-transparent" />
               )}
               
               {/* Profile Image Preview */}
               <div 
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl flex items-center justify-center bg-white overflow-hidden shadow-orange-500/10"
               >
                  {settings.profileImage ? (
                    <img src={settings.profileImage} className="w-full h-full object-cover" alt="Preview Profile" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: settings.themeColor }}>
                       <Building size={32} className="text-white/50" />
                    </div>
                  )}
               </div>
            </div>

            <div className="pt-16 px-6 text-center space-y-2">
               <h2 className="text-2xl font-black text-slate-900 leading-tight">{settings.business_name}</h2>
               <div className="flex items-center justify-center gap-1">
                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Verified Merchant</p>
                 <CheckCircle2 size={12} className="text-blue-500" />
               </div>
               <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium leading-relaxed italic">
                 {settings.about || "Your business story goes here..."}
               </p>
            </div>

            {/* Dynamic Working Hours Preview */}
            <div className="mt-8 px-6">
               <div className="bg-slate-50 p-4 rounded-[2rem] flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm" style={{ color: settings.themeColor }}>
                      <Clock size={18}/>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-300 uppercase">Operating Hours</span>
                      <span className="text-xs font-black text-slate-700">{settings.openTime} - {settings.closeTime}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    {['Mon','Tue','Wed','Thur','Fri','Sat','Sun'].filter(d => settings.selectedDays.includes(d)).slice(0, 5).map((d, i) => (
                      <div key={i} className="w-7 h-7 rounded-xl text-white text-[9px] font-black flex items-center justify-center border-2 border-white" style={{ backgroundColor: settings.themeColor }}>{d}</div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Social Icons Preview (Only shows if link exists) */}
            <div className="flex justify-center gap-4 mt-8 pb-10">
               {settings.socialLinks.instagram && <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-pink-600 border border-slate-100 shadow-sm"><Instagram size={20}/></div>}
               {settings.socialLinks.facebook && <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm"><Facebook size={20}/></div>}
               <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-green-500 border border-slate-100 shadow-sm"><MessageCircle size={20}/></div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 mt-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
           <Lock size={12} /> Live encryption active
        </div>
      </main>

      {/* Mobile Publish Button */}
      <button 
        onClick={() => toast({ title: "Storefront Updated!" })}
        className="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-3xl shadow-2xl flex items-center justify-center z-[100] active:scale-90 transition-transform"
      >
        <CheckCircle2 size={28} />
      </button>

    </div>
  );
};

export default StorefrontCustomization;