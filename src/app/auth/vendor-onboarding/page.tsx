"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vendorOnboardingSchema,
  VendorOnboardingData,
} from "@/lib/Validation/VendorOnboardingSchema";

import InputField from "@/components/Input";
import Button from "@/components/Button";
import { vendorService } from "@/services/vendorService"; // Added switchMode
import { switchMode } from "@/services/api";
import { Loader2, MapPin, RefreshCw, CheckCircle2, ArrowLeft} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLocationDetection } from "@/hooks/useLocationDetection";
import Link from "next/link";

const SuccessScreen = () => (
  <motion.div
    key="success"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center w-full max-w-md p-8 text-center bg-white border border-gray-100 rounded-xl"
  >
    <CheckCircle2 className="w-16 h-16 mb-4 text-green-600" />
    <h2 className="text-2xl font-bold text-gray-800">Registration Successful</h2>
    <p className="mt-2 text-sm text-gray-600">
      Your vendor profile has been submitted and is pending admin approval.
    </p>
    <p className="mt-4 text-sm text-gray-500 font-medium">
      Redirecting to login to refresh your session...
    </p>
  </motion.div>
);

const VendorOnboarding = () => {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    location,
    loading: locationDetecting,
    detected: locationDetected,
    refresh: handleLocationRefresh,
  } = useLocationDetection();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VendorOnboardingData>({
    resolver: zodResolver(vendorOnboardingSchema),
    defaultValues: {
      business_name: "",
      description: "",
      address: "",
      country: "",
      state: "",
    },
  });

  // AUTOFILL LOGIC: Fills country, state, AND the address field
  useEffect(() => {
    if (locationDetected) {
      if (location.country) setValue("country", location.country);
      if (location.state) setValue("state", location.state);
      
      // Auto-populate the main address field if hook provides it
    if (location.country) {
        // Fallback to country and state if full address isn't available
        setValue("address", `${location.country}, ${location.state}`, { shouldValidate: true });
      }
    }
  }, [locationDetected, location, setValue]);

  // Handle Redirection
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, router]);

  const onSubmit = async (data: VendorOnboardingData) => {
    try {
      // 1. Create the store (Onboarding)
      const payload = {
        business_name: data.business_name,
        address: data.address,
        description: data.description,
        latitude: location.latitude || 6.4698,
        longitude: location.longitude || 3.5852,
      };

      await vendorService.vendorOnboarding(payload);

      // 2. REAL API CALL: Update the user's role/mode on the server
      // This ensures the backend knows this user is now a vendor
      await switchMode("vendor");

      // 3. Optional: Clean up local storage to ensure fresh login
      localStorage.removeItem("user");
      sessionStorage.removeItem("RSUsertarget_view");

      toast({ title: "Success!", description: "Store created and role updated." });
      setIsCompleted(true);
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.response?.data?.message || "Onboarding failed" 
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 lg:p-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <AnimatePresence>
         <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                      <ArrowLeft className="h-4 w-4" /> Back to Marketplace
                    </Link>
                  </div>
        {!isCompleted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-xl p-8 space-y-8 bg-white border border-gray-100 rounded-2xl shadow-sm"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800">Store Setup</h3>
              <p className="mt-2 text-sm text-gray-600">Provide your basic business details to go live.</p>
            </div>

            <div className="space-y-5">
              <InputField
                label="Store Name*"
                placeholder="Olowo Ventures"
                {...register("business_name")}
                error={errors.business_name?.message}
              />

              <InputField
                label="Store Description*"
                placeholder="Best shoes in Lagos..."
                {...register("description")}
                error={errors.description?.message}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Business Address*</label>
                  <button
                    type="button"
                    onClick={handleLocationRefresh}
                    disabled={locationDetecting}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${locationDetecting ? "animate-spin" : ""}`} />
                    {locationDetected ? "Refresh Location" : "Detect Location"}
                  </button>
                </div>
                
                <InputField
                  placeholder="Street address, City"
                  {...register("address")}
                  error={errors.address?.message}
                />

                {locationDetected && (
                   <p className="text-[10px] text-green-600 flex items-center gap-1">
                     <MapPin className="w-3 h-3" /> GPS Locked: {location.latitude}, {location.longitude}
                   </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-white bg-[#0E2848] hover:bg-[#0E2848]/90 py-6 text-lg rounded-xl"
              disabled={isSubmitting || locationDetecting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" /> Finalizing...
                </div>
              ) : (
                "Complete Onboarding"
              )}
            </Button>
          </motion.form>
        ) : (
          <SuccessScreen />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorOnboarding;