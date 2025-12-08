import React from "react";
import { useRouter } from "next/navigation";
import { 
  Star, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  BadgeCheck, 
  Store 
} from "lucide-react";
import Skeleton from "@/components/skeleton";
// import { Skeleton } from "@/components/ui/skeleton";
// import Skeleton from "react-loading-skeleton"; // Assuming you are using this or a custom component
// import "react-loading-skeleton/dist/skeleton.css";
import { Storefront } from "@/types/storeFront";

export const StorefrontCard = ({ storefront }: { storefront: Storefront }) => {
  const router = useRouter();

  const formatEstablishedDate = (dateString: string | undefined): string => {
    if (!dateString) return "New";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      return `Since ${year}`;
    } catch {
      return "Since 2024";
    }
  };

  const getFallbackImage = (businessName: string): string => {
    const colors = ["2563EB", "059669", "7C3AED", "EA580C", "DC2626", "0D9488"];
    const colorIndex = businessName.length % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      businessName
    )}&background=${colors[colorIndex]}&color=fff&size=400&font-size=0.33&bold=true`;
  };

  const handleClick = () => {
    if (storefront.business_name) {
      const slugify = (text: string) =>
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      const businessSlug = slugify(storefront.business_name);

      // Set session storage ONLY on click to prevent overwriting
      sessionStorage.setItem("selectedVendorEmail", storefront.vendor?.email || "");
      sessionStorage.setItem("selectedBusinessName", storefront.business_name);

      router.push(`/storefront/${encodeURIComponent(businessSlug)}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        <img
          src={
            storefront.business_banner ||
            getFallbackImage(storefront.business_name)
          }
          alt={storefront.business_name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackImage(
              storefront.business_name
            );
          }}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {storefront.ratings > 0 ? (
            <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-900 bg-white/90 backdrop-blur-md rounded-full shadow-sm">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>{storefront.ratings.toFixed(1)}</span>
            </div>
          ) : (
            <div /> /* Spacer */
          )}

          {storefront.vendor && (
            <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50/90 backdrop-blur-md rounded-full shadow-sm">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-5">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
              {storefront.business_name}
            </h3>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {storefront.description || "Welcome to our store! We offer quality products and excellent service."}
          </p>

          {/* Meta Tags */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {formatEstablishedDate(storefront.vendor_info?.member_since)}
            </div>
            {storefront.address && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="max-w-[100px] truncate">{storefront.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Vendor Info */}
        <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-gradient-to-br from-[#0E2848] to-[#0E2848]/60 rounded-full shadow-sm">
                {storefront.vendor?.firstname?.charAt(0) || "V"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-900">
                {storefront.vendor?.firstname} {storefront.vendor?.lastname}
              </span>
              <span className="text-[10px] text-gray-500">Store Owner</span>
            </div>
          </div>

          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
         View Storefront   <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Updated Skeleton ---

export const StorefrontSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden"
        >
          {/* Banner Skeleton */}
          <div className="h-48 w-full bg-gray-100 relative">
             <Skeleton type="rect" height="100%" width="100%" />
          </div>

          {/* Content Skeleton */}
          <div className="p-5 flex flex-col flex-grow">
            <Skeleton width="60%" height={24} className="mb-3" />
            <Skeleton width="100%" height={16} count={2} className="mb-4" />

            <div className="flex gap-2 mb-6">
              <Skeleton width={80} height={24} className="rounded-md" />
              <Skeleton width={80} height={24} className="rounded-md" />
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton type="circle" width={32} height={32} />
                <div className="flex flex-col">
                  <Skeleton width={80} height={12} />
                  <Skeleton width={50} height={10} />
                </div>
              </div>
              <Skeleton type="circle" width={32} height={32} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StorefrontSkeleton;