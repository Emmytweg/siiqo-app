"use client";
import React, { useState, useEffect } from "react";
import { useRouter,useParams } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import ProductInfo from "../components/ProductInfo";
import SellerCard from "../components/SellerCard";
import ImageGallery from "../components/ImageGallery";
import ActionBar from "../components/ActionBar";
import LocationMap from "../components/LocationMap";


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!productId) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://server.siiqo.com/api/marketplace/products/${productId}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();

        if (data?.status !== "success" || !data?.product) {
          throw new Error("Product not found");
        }

        setProductData(data.product);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }
console.log("Product Data:", productData);
  if (!productData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Product not found.
      </div>
    );
  }

  const images =
    Array.isArray(productData.images) && productData.images.length > 0
      ? productData.images
      : ["/placeholder-product.png"];

  const mappedProduct = {
    id: Number(productId),
    title: productData.name,
    price: productData.price,
    rating: 4.5,
    reviewCount: 0,
    distance: 0,
    availability: productData.quantity > 0 ? "In Stock" : "Out of Stock",
    views: 0,
    watchers: 0,
    condition: "New",
    lastUpdated: new Date(),
    description: productData.description || "",
    specifications: {
      Quantity: String(productData.quantity ?? 0),
      Vendor: productData.vendor_name || "Unknown",
    },
  };

  const mappedSeller = {
    name: productData.vendor_name || "Vendor",
    avatar: "",
    rating: 4.8,
    reviewCount: 24,
    responseTime: "Usually responds within 1 hour",
    memberSince: "2023",
    verifiedSeller: true,
    phoneNumber: productData.whatsapp_chat || "",
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ImageGallery
            images={images}
            activeIndex={activeImageIndex}
            onImageChange={setActiveImageIndex}
          />

          <div className="space-y-8">
            <ProductInfo
              productData={mappedProduct}
              productId={Number(productId)}
              isWishlisted={isWishlisted}
              onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
              showFullDescription
              onToggleDescription={() => {}}
            />

            <SellerCard
              seller={mappedSeller}
              onNavigateToVendorProfile={() => {}}
            />

            <LocationMap
              location={{
                address: "Lagos, Nigeria",
                lat: 6.5244,
                lng: 3.3792,
              }}
              onGetDirections={() => {}}
            />
          </div>
        </div>
      </div>

      <ActionBar
        product={mappedProduct}
        cartQuantity={0}
        onAddToCart={() => alert("Added to cart")}
        onBuyNow={() => alert("Proceeding to checkout")}
        onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
        isWishlisted={isWishlisted}
      />
    </div>
  );
}

