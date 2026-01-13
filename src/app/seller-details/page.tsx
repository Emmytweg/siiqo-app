"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import Image from "@/components/ui/AppImage";
import { storefrontService } from "@/services/storefrontService";
import { toast } from "sonner";
import { switchMode } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
// Sub-components
import MyListings from "../user-profile/components/MyListings";
import VendorOrders from "../vendor/profile/components/VendorOrders";
import Settings from "../vendor/settings/page";
interface Tab {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

const VendorProfile = () => {
  const router = useRouter();
  const { refreshUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("listings");
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isVendor, setIsVendor] = useState<boolean>(true);

  // Keep a ref of the original profile data to compare changes
  const originalProfileDataRef = React.useRef<any>(null);

  // Form state
  const [editForm, setEditForm] = useState({
    name: "",
    ownerName: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    banner_url: "", // For preview
    logo_url: "", // For preview
    bannerFile: null as File | null,
    logoFile: null as File | null,
  });

  const fetchVendorSettings = async () => {
    try {
      setLoading(true);
      const response = await storefrontService.getStorefrontData();

      if (response.status === "success") {
        const { personal_info, store_settings } = response.data;

        const mappedData = {
          name: store_settings.business_name,
          ownerName: personal_info.fullname,
          email: personal_info.email,
          phone: personal_info.phone || "",
          avatar:
            store_settings.logo_url ||
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
          cover:
            store_settings.banner_url ||
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
          primaryColor:
            store_settings.template_options?.primary_color || "#000000",
          location: store_settings.address,
          bio: store_settings.description,
          isPublished: store_settings.is_published,
        };

        setProfileData(mappedData);
        setEditForm({
          name: mappedData.name,
          ownerName: mappedData.ownerName,
          bio: mappedData.bio,
          email: mappedData.email,
          phone: mappedData.phone,
          location: mappedData.location,
          banner_url: mappedData.cover,
          logo_url: mappedData.avatar,
          bannerFile: null,
          logoFile: null,
        });

        // Update the AuthContext with fresh vendor data
        if (refreshUserProfile) {
          await refreshUserProfile();
        }
      }
    } catch (err) {
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorSettings();
  }, []);

  // Initialize original settings ref after data is fetched
  useEffect(() => {
    if (profileData) {
      originalProfileDataRef.current = {
        name: profileData.name,
        ownerName: profileData.ownerName,
        bio: profileData.bio,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        banner_url: profileData.cover,
        logo_url: profileData.avatar,
      };
    }
  }, [profileData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    switchMode("vendor");
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEditForm((prev) => ({
        ...prev,
        [`${type}_url`]: previewUrl,
        [`${type}File`]: file,
      }));
    }
  };

  const handleEditProfile = () => {
    toast.info("Taking you to settings...");
    router.push("/vendor/settings");
  };

  const tabs: Tab[] = [
    { id: "listings", label: "My Listings", icon: "Package" },
    { id: "orders", label: "My Orders", icon: "ShoppingBag" },
    { id: "settings", label: "Settings", icon: "Settings" },
  ];

  const renderTabContent = () => {
    if (!profileData) return null;
    switch (activeTab) {
      case "listings":
        return <MyListings />;
      case "orders":
        return <VendorOrders />;
      case "settings":
        return <Settings />;
      default:
        return <MyListings />;
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-text-secondary">Loading Profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="px-4 md:px-8 pt-4 pb-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>
      {/* --- Cover Image --- */}
      <div className="relative">
        <div
          className="h-44 md:h-64 w-full bg-center bg-cover relative group"
          style={{ backgroundImage: `url(${editForm.banner_url})` }}
        >
          {isEditing && (
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col items-center text-white">
                <Icon name="Camera" size={32} />
                <span className="text-sm font-medium">Change Banner</span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "banner")}
              />
            </label>
          )}

          {/* --- Profile Logo --- */}
          <div className="absolute -bottom-12 left-6 md:left-12">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl relative group">
              <Image
                src={editForm.logo_url}
                alt="Store Logo"
                fill
                className="object-cover"
              />
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="Edit" size={24} className="text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "logo")}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2 w-full max-w-lg">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="text-2xl font-bold bg-transparent border-b border-primary w-full focus:outline-none"
                  placeholder="Store Name"
                />
                <input
                  name="ownerName"
                  value={editForm.ownerName}
                  onChange={handleInputChange}
                  className="text-sm text-text-secondary w-full bg-transparent border-b focus:outline-none"
                  placeholder="Owner Name"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  {profileData?.name}
                  <Icon
                    name="ShieldCheck"
                    size={24}
                    className="text-blue-500"
                  />
                </h1>
                <p className="text-text-secondary text-sm font-medium">
                  Owned by {profileData?.ownerName}
                </p>
              </>
            )}

            <div className="flex items-center gap-4 text-xs text-text-secondary mt-2">
              <span className="flex items-center gap-1">
                <Icon name="MapPin" size={14} />
                {isEditing ? (
                  <input
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    className="bg-transparent border-b focus:outline-none"
                  />
                ) : (
                  profileData?.location
                )}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl font-bold border border-border hover:bg-muted transition-all"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditProfile}
                  className="px-6 py-2.5 rounded-xl font-bold border border-border hover:bg-muted transition-all flex items-center gap-2"
                >
                  <Icon name="Edit3" size={16} /> Edit Profile
                </button>
                <button
                  onClick={() => router.push("/vendor/products/")}
                  className="px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                  style={{ backgroundColor: profileData?.primaryColor }}
                >
                  + Add Product
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          <aside className="lg:col-span-4 space-y-6">
            <div className="p-6 border rounded-2xl bg-surface shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">
                About Store
              </h3>
              <p className="text-sm leading-relaxed">{profileData?.bio}</p>
            </div>

            <div className="p-6 border rounded-2xl bg-surface shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">
                Contact Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Icon name="Mail" size={16} />
                  {profileData?.email}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Icon name="Phone" size={16} />
                  {profileData?.phone}
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8">
            <div className="border rounded-2xl bg-surface shadow-sm overflow-hidden">
              <div className="flex border-b bg-gray-50/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
                      activeTab === tab.id
                        ? "text-black"
                        : "border-transparent text-text-secondary"
                    }`}
                    style={{
                      borderBottomColor:
                        activeTab === tab.id
                          ? profileData?.primaryColor
                          : "transparent",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-6 mb-20 ">{renderTabContent()}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
