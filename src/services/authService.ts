//services/authService.ts
import api from "@/lib/api_client";
import { LoginResponse } from "@/types/auth";

export const authService = {
  // login: async (email: string, password: string): Promise<LoginResponse> => {
  //   const response = await api.post("/auth/login", {
  //     email,
  //     password,
  //   });
  //   return response.data;
  // },
login: async (email: string, password: string) => {
    // --- MOCK FOR LOCAL TESTING ---
    console.log("Mock Login Triggered");
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    
    return {
      access_token: "mock_token_123",
      user: {
        id: 1,
        email: email,
        name: "Test User",
        role: email.includes("admin") ? "admin" : "shopper"
      }
    };
    
    /* --- LIVE CODE (Commented) ---
    return api.post("/auth/login", { email, password });
    */
  },
  signup: async (userData: any) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    const response = await api.post("/auth/request-password-reset", { email });
    return response.data;
  },

  resetPassword: async (passwordData: any) => {
    const response = await api.post("/auth/reset-password", passwordData);
    return response.data;
  },

  forgotPassword: (email: string): Promise<void> => {
    return api.post("/auth/request-password-reset", { email });
  },

  resendVerificationOtp: async (email: string) => {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  },

  verifyEmail: (email: string, otp: string): Promise<any> => {
    return api.post("/auth/verify-email", { email, otp });
  },

  resendOtp: (email: string): Promise<any> => {
    return api.post("/auth/resend-verification", { email });
  },
};
