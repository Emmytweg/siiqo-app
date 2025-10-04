import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Image from "@/components/ui/AppImage";
import Button from "@/components/ui/new/Button";
import { Checkbox } from "@/components/ui/new/Checkbox";

type ProductStatus = "active" | "draft" | "out-of-stock" | "inactive";
interface Product {
  id: any;
  name: string;
  image: string;
  images?: { id: number; url: string; alt: string }[];
  category: string;
  sku: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  stock: number;
  lowStockThreshold?: number;
  status: ProductStatus;
  createdAt: string;
  views: number;
  description?: string;
  barcode?: string;
  weight?: number;
  dimensions?: { length?: number; width?: number; height?: number };
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
}

interface StatusConfig {
  bg: string;
  text: string;
  label: string;
}

interface StockStatusConfig {
  color: string;
  icon: string;
}

interface ProductGridProps {
  products: Product[];
  selectedProducts: string[] | any;
  onProductSelect: (productId: string, selected: boolean) => void;
  onEditProduct: (productId: any) => void;
  onDuplicateProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  viewMode: "grid" | "list";
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedProducts,
  onProductSelect,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  viewMode,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getStatusBadge = (status: ProductStatus): React.ReactNode => {
    const statusConfig: Record<ProductStatus, StatusConfig> = {
      active: { bg: "bg-success/10", text: "text-success", label: "Active" },
      draft: { bg: "bg-warning/10", text: "text-warning", label: "Draft" },
      "out-of-stock": {
        bg: "bg-error/10",
        text: "text-error",
        label: "Out of Stock",
      },
      inactive: {
        bg: "bg-muted",
        text: "text-muted-foreground",
        label: "Inactive",
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getStockStatus = (stock: number): StockStatusConfig => {
    if (stock === 0) return { color: "text-error", icon: "AlertCircle" };
    if (stock <= 10) return { color: "text-warning", icon: "AlertTriangle" };
    return { color: "text-success", icon: "CheckCircle" };
  };

  if (products.length === 0) {
    return (
      <div className="p-12 text-center border rounded-lg bg-card border-border">
        <Icon
          name="Package"
          size={48}
          className="mx-auto mb-4 text-muted-foreground"
        />
        <h3 className="mb-2 text-lg font-medium text-foreground">
          No products found
        </h3>
        <p className="mb-4 text-muted-foreground">
          Get started by adding your first product to the catalog.
        </p>
        <Button variant="default" iconName="Plus" iconPosition="left">
          Add New Product
        </Button>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          : "space-y-3"
      }
    >
      {products.map((product, index) => {
        const stockStatus = getStockStatus(product.stock);
        const isMenuOpen = openMenuId === product.id;

        return (
          <div
            key={product.id ? `product-${product.id}` : `product-${index}`}
            className={`overflow-hidden border rounded-lg bg-card border-border hover:shadow-card transition-smooth ${
              viewMode === "list" ? "flex items-center justify-between p-4" : ""
            }`}
          >
            {viewMode === "grid" && (
              <>
                {/* Product Image */}
                <div className="relative">
                  <div className="overflow-hidden aspect-square bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Checkbox Overlay */}
                  <div className="absolute z-20 top-3 left-3">
                    <div className="p-1 rounded-md bg-background/80 backdrop-blur-sm">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onChange={e =>
                          onProductSelect(product.id, e.target.checked)
                        }
                      />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute z-20 top-3 right-3">
                    {getStatusBadge(product.status)}
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center space-x-2 opacity-0 bg-black/50 hover:opacity-100 transition-smooth">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEditProduct(product.id)}
                      iconName="Edit"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onDuplicateProduct(product.id)}
                      iconName="Copy"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteProduct(product.id)}
                      iconName="Trash2"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3
                      className="font-medium truncate text-foreground"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs text-muted-foreground">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold text-foreground">
                      ${product.price}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon
                        name={stockStatus.icon}
                        size={14}
                        className={stockStatus.color}
                      />
                      <span
                        className={`text-sm font-medium ${stockStatus.color}`}
                      >
                        {product.stock}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Created {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Eye" size={12} />
                      <span>{product.views || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="px-4 pb-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => onEditProduct(product.id)}
                      iconName="Edit"
                      iconPosition="left"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicateProduct(product.id)}
                      iconName="Copy"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteProduct(product.id)}
                      iconName="Trash2"
                    />
                  </div>
                </div>
              </>
            )}

            {viewMode === "list" && (
              <>
                {/* Left section: thumbnail + info */}
                <div className="flex items-center space-x-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-16 h-16 rounded-md"
                  />
                  <div>
                    <h3 className="font-medium text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                </div>

                {/* Right section: price + stock + 3-dot menu */}
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">${product.price}</span>
                  <span className={`text-sm ${stockStatus.color}`}>
                    {product.stock}
                  </span>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreVertical"
                      onClick={() =>
                        setOpenMenuId(isMenuOpen ? null : product.id)
                      }
                    />
                    {isMenuOpen && (
                      <div className="absolute right-0 z-50 w-40 mt-2 border rounded-lg shadow-md bg-popover border-border">
                        <button
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted"
                          onClick={() => onEditProduct(product.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted"
                          onClick={() => onDuplicateProduct(product.id)}
                        >
                          Duplicate
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-error hover:bg-muted"
                          onClick={() => onDeleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
