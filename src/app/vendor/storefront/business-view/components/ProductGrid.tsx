"use client";

import React, { useState } from "react";
import Icon, { type LucideIconName } from "@/components/AppIcon";
import Image from "@/components/ui/alt/AppImageAlt";
import Button from "@/components/ui/alt/ButtonAlt";

interface Product {
  id: string | number;
  name: string;
  description: string;
  product_price: number;
  images: string[];
  stock: number;
  status?: string;
  category?: string;
  originalPrice?: number | null;
  rating?: number;
  reviewCount?: number;
  discount?: number | null;
}

interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void; // Added ?
  onAddToCart?: (product: Product) => void;   // Added ?
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  onProductClick,
  onAddToCart,
}) => {
  const [loadingProduct, setLoadingProduct] = useState<number | string | null>(null);

  const handleAddToCart = async (product: Product): Promise<void> => {
    // Safety check: Only run if the prop was provided
    if (!onAddToCart) return; 

    setLoadingProduct(product.id);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onAddToCart(product);
    setLoadingProduct(null);
  };
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

  const getStockInfo = (stock: number) => {
    if (stock <= 0) return { text: "Sold Out", class: "bg-slate-100 text-slate-400" };
    if (stock <= 5) return { text: "Limited", class: "bg-orange-100 text-orange-600" };
    return { text: "New", class: "bg-blue-100 text-blue-600" };
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 animate-in fade-in duration-700">
        <div className="bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <Icon name="Package" size={32} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">No Products Yet</h3>
        <p className="text-slate-400 max-w-xs mx-auto text-sm">
          Items added to your shop in the customization panel will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 lg:gap-8">
      {products.map((product, idx) => {
        const stockInfo = getStockInfo(product.stock);
        const hasDiscount = product.discount && product.discount > 0;

        return (
          <div
            key={product.id || idx}
            className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${idx * 50}ms` }}
           onClick={() => onProductClick?.(product)}
          >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden m-2 rounded-[1.5rem] bg-slate-50">
              <Image
                src={product.images?.[0] || "/placeholder-product.jpg"}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${stockInfo.class}`}>
                  {stockInfo.text}
                </span>
                {hasDiscount && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-sm">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Product Content */}
            <div className="p-5 pt-2 flex flex-col flex-1">
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                {product.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <Icon name="Star" size={12} className="fill-orange-400 text-orange-400" />
                    <span className="text-[10px] font-bold text-slate-500">{product.rating}</span>
                  </div>
                )}
              </div>

              {/* Price Row */}
              <div className="flex items-end justify-between gap-2 mt-auto">
                <div className="flex flex-col">
                  {hasDiscount && (
                    <span className="text-[10px] line-through text-slate-300 font-bold">
                      {formatPrice(product.originalPrice || product.product_price * 1.2)}
                    </span>
                  )}
                  <span className="text-lg font-black text-slate-900">
                    {formatPrice(product.product_price)}
                  </span>
                </div>

                <Button
                  variant={product.stock <= 0 ? "outline" : "primary"}
                  size="sm"
                  className="rounded-xl h-10 w-10 p-0 shrink-0"
                  disabled={product.stock <= 0}
                  loading={loadingProduct === product.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  {product.stock <= 0 ? (
                    <Icon name="Slash" size={16} />
                  ) : (
                    <Icon name="Plus" size={18} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;