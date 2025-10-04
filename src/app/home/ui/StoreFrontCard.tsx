import React from "react";
import { Star } from "lucide-react";
import { Storefront } from "@/types/storeFront";
import Skeleton from "../../../components/skeleton";

interface StorefrontCardProps {
  storefront: Storefront;
}

export const StorefrontCard: React.FC<StorefrontCardProps> = ({ storefront }) => {
  const formatEstablishedDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) return "Established today";
      if (diffDays <= 7) return `Established ${diffDays} days ago`;
      if (diffDays <= 30)
        return `Established ${Math.ceil(diffDays / 7)} weeks ago`;
      if (diffDays <= 365)
        return `Established ${Math.ceil(diffDays / 30)} months ago`;
      return `Established ${Math.ceil(diffDays / 365)} years ago`;
    } catch {
      return "Recently established";
    }
  };

  const getFallbackImage = (businessName: string): string => {
    const colors = ["blue", "green", "purple", "orange", "red", "teal"];
    const colorIndex = businessName.length % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      businessName
    )}&background=${colors[colorIndex]}&color=fff&size=300`;
  };

  return (
    <div className="overflow-hidden transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
        <img
          src={
            storefront.business_banner ||
            getFallbackImage(storefront.business_name)
          }
          alt={storefront.business_name}
          className="object-cover w-full h-full"
          onError={e => {
            (e.target as HTMLImageElement).src = getFallbackImage(
              storefront.business_name
            );
          }}
        />
        {storefront.vendor && (
          <div className="absolute flex items-center px-2 py-1 space-x-1 text-xs text-white bg-green-500 rounded-full top-2 right-2">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span>Verified</span>
          </div>
        )}
        {storefront.ratings > 0 && (
          <div className="absolute flex items-center px-2 py-1 space-x-1 text-xs text-gray-800 rounded-full top-2 left-2 bg-white/90 backdrop-blur-sm">
            <Star className="w-3 h-3 text-orange-400 fill-current" />
            <span>{storefront.ratings.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-bold text-gray-900">
          {storefront.business_name}
        </h3>
        <p className="text-gray-600 mb-3 min-h-[2rem] text-sm">
          {storefront.description || "No description available"}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-500">
            {formatEstablishedDate(storefront.established_at)}
          </div>
          {storefront.vendor && (
            <div className="flex items-center space-x-1 font-medium text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Active</span>
            </div>
          )}
        </div>
        {storefront.vendor && (
          <div className="pt-3 mt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-orange-500 rounded-full">
                {storefront.vendor.firstname.charAt(0)}
              </div>
              <span className="text-sm text-gray-700">
                {storefront.vendor.firstname} {storefront.vendor.lastname}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

//  storefront skeleton component
interface StorefrontSkeletonProps {
  count?: number;
}

export const StorefrontSkeleton: React.FC<StorefrontSkeletonProps> = ({
  count = 6,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden bg-white rounded-lg shadow-md"
        >
          {/* Banner */}
          <Skeleton width="100%" height="192px" className="rounded-t-lg" />

          <div className="p-4">
            {/* Title */}
            <Skeleton width="70%" height="24px" className="mb-2" />

            {/* Description */}
            <Skeleton count={2} width="100%" height="16px" className="mb-1" />

            {/* Footer info */}
            <div className="flex items-center justify-between mt-3">
              <Skeleton width="120px" height="14px" />
              <Skeleton width="60px" height="14px" />
            </div>

            {/* Vendor info */}
            <div className="pt-3 mt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Skeleton type="circle" width="24px" height="24px" />
                <Skeleton width="100px" height="14px" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StorefrontSkeleton;
