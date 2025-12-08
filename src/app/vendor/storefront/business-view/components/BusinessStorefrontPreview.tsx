
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import CustomerBottomTabs from "@/components/ui/CustomerBottomTabs";
import LocationHeader from "@/components/ui/LocationHeader";
import BusinessHero from "./BusinessHero";
import TabNavigation from "./TabNavigation";
import ProductGrid from "./ProductGrid";
import AboutSection from "./AboutSection";
import ReviewsSection from "./ReviewSection";
import ContactSection from "./ContactSection";
import { StorefrontData } from "@/types/vendor/storefront";
import { useToast } from "@/components/ui/use-toast"; // ✅ TOAST

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  product_price: number;
  images: string[];
  stock: number;
  status: string;
  category: string;
}

interface Props {
  storefrontData: StorefrontData | null;
  products: Product[];
}

type TabId = "products" | "about" | "reviews" | "contact";

const BusinessStorefrontPreview: React.FC<Props> = ({
  storefrontData,
  products,
}) => {
  const { businessId } = useParams<{ businessId: string }>();
  const router = useRouter();
  const { toast } = useToast(); // ✅ TOAST HOOK

  const [activeTab, setActiveTab] = useState<TabId>("products");
  const [business, setBusiness] = useState<StorefrontData | null>(
    storefrontData
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storefrontData) {
      setBusiness(storefrontData);
      setLoading(false);
    }
  }, [storefrontData]);

  // ✅ PREVIEW TABS (READ ONLY)
  const tabs = [
    { id: "products", label: "Products", count: products.length },
    { id: "about", label: "About" },
    { id: "reviews", label: "Reviews", count: 0 },
    { id: "contact", label: "Contact" },
  ];

  // ✅ READ-ONLY TAB CONTENT
  const renderTabContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <div>
            <ProductGrid
              products={products}
              onProductClick={(p) =>
                console.log("Preview product:", p)
              }
              onAddToCart={() => {
                toast({
                  title: "Preview Mode",
                  description: "You cannot add to cart in preview mode.",
                  variant: "destructive",
                });
              }}
            />
          </div>
        );

      case "about":
        return business ? (
          <AboutSection
            business={{
              name: business.businessName,
              description: business.description,
              story: "",
              established: "",
              teamSize: "",
              specialties: [],
              hours: [],
              gallery: [],
              team: [],
            }}
          />
        ) : null;

      case "reviews":
        return (
          <ReviewsSection
            reviews={[]}
            businessRating={{ average: 0, total: 0 }}
            onWriteReview={() =>
              toast({
                title: "Preview Mode",
                description: "Reviews are disabled in preview mode.",
                variant: "destructive",
              })
            }
          />
        );

      case "contact":
        return business ? (
          <ContactSection
            business={{
              name: business.businessName,
              phone: business.contact.phone,
              email: business.contact.email,
              address: business.contact.address,
              website: business.contact.website,
              socialMedia: {},
              coordinates: { lat: 0, lng: 0 },
            }}
            onSendMessage={async () => {
              toast({
                title: "Preview Mode",
                description: "Messaging is disabled in preview mode.",
                variant: "destructive",
              });
            }}
          />
        ) : null;

      default:
        return null;
    }
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LocationHeader context="customer" />
        <div className="flex items-center justify-center h-96">
          <p className="text-text-secondary">
            Loading storefront preview...
          </p>
        </div>
        <CustomerBottomTabs />
      </div>
    );
  }

  // ✅ NOT FOUND STATE
  if (!business) {
    return (
      <div className="min-h-screen bg-background">
        <LocationHeader context="customer" />
        <div className="flex items-center justify-center h-96">
          <h2 className="text-xl font-semibold">
            Storefront Not Found
          </h2>
        </div>
        <CustomerBottomTabs />
      </div>
    );
  }

  // ✅ MAIN PREVIEW RENDER
  return (
    <div className="min-h-screen bg-background">
      <LocationHeader context="customer" />

      <BusinessHero
        business={business}
        onContactClick={() =>
          toast({
            title: "Preview Mode",
            description: "Calling is disabled in preview mode.",
            variant: "destructive",
          })
        }
        onDirectionsClick={() =>
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${business.contact.address}`,
            "_blank"
          )
        }
        onShareClick={() =>
          navigator.share?.({
            title: business.businessName,
            url: window.location.href,
          })
        }
      />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
        tabs={tabs}
      />

      <main className="px-4 py-8 pb-20 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:pb-8">
        {renderTabContent()}
      </main>

      <CustomerBottomTabs />
    </div>
  );
};

export default BusinessStorefrontPreview;
