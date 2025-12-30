import api from "@/lib/api_client";
import { UserData as User } from "@/types/auth";
import { VendorInfo } from "@/types/seller-profile";
import { VendorData as VendorSettingsData } from "@/types/vendor/settings";

export const userService = {
  getUserProfile: async (): Promise<any> => {
    // --- MOCK FOR LOCAL TESTING ---
    const saved = localStorage.getItem("pendingUserData");
    if (saved) return JSON.parse(saved);
    
    return { id: 999, name: "John Doe", role: "shopper", email: "test@test.com" };

    /* --- LIVE CODE ---
    return api.get("/user/profile");
    */
  },
  getVendorByEmail: (email: string): Promise<VendorInfo> => {
    return api.get(`/user/${email}`);
  },
  uploadProfilePicture: (formData: FormData): Promise<any> => {
    return api.post("/upload-profile-pic", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  logout: (): void => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("RSToken");
      sessionStorage.removeItem("RSUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAdminLoggedIn");
    }
  },
  getVendorProfile: (): Promise<VendorSettingsData> => {
    return api.get("/user/profile");
  },
  submitKyc: (formData: FormData): Promise<any> => {
    return api.post("/user/kyc", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
