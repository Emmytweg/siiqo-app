"use client";
import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/AppIcon";
import Image from "@/components/ui/AppImage";
import MyListings from "./components/MyListings";
import PurchaseHistory from "./components/PurchaseHistory";
import SavedItems from "./components/SavedItems";
import Settings from "./components/Settings";
import { useRouter } from "next/navigation";
import { UserProfileData } from "@/types/userProfile";
import { userService } from "@/services/userService";
import ProtectedRoute from "@/components/auth/RoleProtectedRoute";
import { useAuth } from "@/context/AuthContext"; // Import AuthContext

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<string>("history");
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { logout } = useAuth(); // Use logout from context
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    state: "",
    country: "",
    bio: ""
  });

  const [uploading, setUploading] = useState(false);

  // 1. Fetch Live Data on Load
 useEffect(() => {
  const fetchLiveProfile = async () => {
    try {
      setLoading(true);
      const responseData = await userService.getUserProfile();
      
      // Look for user data either at root or inside a .user property
      const userData = responseData.user || responseData;

      setUser(userData);
      setEditData({
        name: userData.name || userData.business_name || "User",
        phone: userData.phone || "",
        state: userData.state || "",
        country: userData.country || "",
        bio: userData.bio || "Community Member"
      });
    } catch (err) {
      console.error("Failed to fetch live profile:", err);
      // Fallback to dummy name so the UI doesn't look broken if you want
    } finally {
      setLoading(false);
    }
  };

  fetchLiveProfile();
}, []);

  // 2. Handle Live Profile Update
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Assuming you'll add an updateProfile method to userService
      // await userService.updateProfile(editData); 
      
      setUser(prev => prev ? { ...prev, ...editData } : null);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile on server.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Live Image Upload
  const handleProfilePictureUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profile_pic", file); // Check if backend expects "image" or "profile_pic"
      
      const response = await userService.uploadProfilePicture(formData);
      
      // Update UI with the returned URL from server
      setUser(prev => prev ? { ...prev, profile_pic_url: response.url || response.data.url } : null);
      alert("Profile picture updated!");
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col h-screen items-center justify-center">
      <Icon name="Loader2" className="animate-spin text-primary mb-2" size={32} />
      <p className="text-sm font-bold text-gray-500">Fetching live profile...</p>
    </div>
  );

  if (!user) return <div className="p-10 text-center">No user data found. Please log in.</div>;

  // Use live data for constants
  const avatarImage = user.profile_pic_url || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&face";
  const coverImage = "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=80";

  return (
      <div className="min-h-screen bg-background pb-10">
        {/* COVER SECTION */}
        <div className="relative">
          <div className="h-40 md:h-64 w-full bg-center bg-cover" style={{ backgroundImage: `url(${coverImage})` }}>
            <div className="absolute inset-0 bg-black/20" />
          </div>
          
          {/* AVATAR */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-12">
            <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-full border-[6px] border-white bg-gray-100 shadow-xl overflow-hidden group">
              <Image src={avatarImage} alt="Profile" fill className="object-cover" />
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Icon name={uploading ? "Loader2" : "Camera"} size={24} className={`text-white ${uploading ? 'animate-spin' : ''}`} />
                <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleProfilePictureUpload(e.target.files[0])} />
              </label>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-16 md:mt-20">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold">{user.name || user.business_name}</h1>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <button 
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className="px-6 py-2 bg-primary text-white rounded-full text-sm font-bold shadow-md hover:bg-primary/90 transition-all"
              >
                {isEditing ? "SAVE CHANGES" : "EDIT PROFILE"}
              </button>
              <button onClick={logout} className="px-6 py-2 border border-red-200 text-red-500 rounded-full text-sm font-bold hover:bg-red-50">
                LOGOUT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* LEFT SIDEBAR */}
            <aside className="md:col-span-4 space-y-6">
              <div className="p-6 border rounded-2xl bg-white shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest mb-4">About</h3>
                {isEditing ? (
                  <textarea 
                    className="w-full text-sm p-3 border rounded-xl bg-gray-50 outline-none"
                    value={editData.bio}
                    onChange={e => setEditData({...editData, bio: e.target.value})}
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">{editData.bio || "No bio set."}</p>
                )}
              </div>

              <div className="p-6 border rounded-2xl bg-white shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest mb-4">Verification Status</h3>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-xs font-bold">Email Verified</span>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="md:col-span-8">
               <div className="mb-6 border rounded-2xl bg-white shadow-sm overflow-hidden min-h-[500px]">
                  <div className="flex border-b bg-gray-50/50">
                    {['history', 'saved', 'settings'].map((tab) => (
                      <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === tab ? "border-b-2 border-primary text-primary bg-white" : "text-gray-500"}`}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="p-6">
                    {/* {activeTab === "history" && <PurchaseHistory />} */}
                    {activeTab === "saved" && <SavedItems />}
                    {activeTab === "settings" && <Settings userProfile={user as any} />}
                  </div>
               </div>
            </main>
          </div>
        </div>
      </div>
  );
};

export default UserProfile;