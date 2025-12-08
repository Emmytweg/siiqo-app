"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { productService } from "@/services/productService";

import Icon from "@/components/AppIcon";
import Button from "@/components/ui/new/Button";
import CategoryTree from "@/app/vendor/products/components/CategoryTree";
import ProductToolbar from "@/app/vendor/products/components/ProductToolbar";
import ProductTable from "@/app/vendor/products/components/ProductTable";
import ProductGrid from "@/app/vendor/products/components/ProductGrid";
import AddProductModal from "@/app/vendor/products/components/AddProductModal";
import StockAlerts from "@/app/vendor/products/components/StockAlerts";
import {
  ProductStatus,
  ViewMode,
  BulkAction,
  Product,
  AddProductRequest,
  VendorData,
  ProductFormData,
} from "@/types/vendor/products";
import { ChevronDown, ChevronUp } from "lucide-react";

// --- Toast Component ---
export interface Toast {
  id: string;
  type: "success" | "error" | "loading" | "info";
  title: string;
  message?: string;
  duration?: number;
}

const ToastNotification: React.FC<{
  toast: Toast;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  useEffect(() => {
    if (toast.type !== "loading" && toast.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, toast.type, onRemove]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-success/10 mt-[3rem] border-success/20 text-success";
      case "error":
        return "bg-error/10 mt-[3rem] border-error/20 text-error";
      case "loading":
        return "bg-primary/10 mt-[3rem] border-primary/20 text-primary";
      default:
        return "bg-muted mt-[3rem] border-border text-foreground";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "CheckCircle";
      case "error":
        return "XCircle";
      case "loading":
        return "Loader2";
      default:
        return "Info";
    }
  };

  return (
    <div
      className={`${getToastStyles()} border rounded-lg p-4 mb-3 shadow-lg transition-all duration-300 transform translate-x-0`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`mt-0.5 ${toast.type === "loading" ? "animate-spin" : ""}`}
        >
          <Icon name={getIcon()} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium">{toast.title}</h4>
          {toast.message && (
            <p className="mt-1 text-sm opacity-80">{toast.message}</p>
          )}
        </div>
        {toast.type !== "loading" && (
          <button
            onClick={() => onRemove(toast.id)}
            className="transition-opacity opacity-60 hover:opacity-100"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const ToastContainer: React.FC<{
  toasts: Toast[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed z-50 max-w-sm top-4 right-4 w-96">
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// --- Main Component ---
const ProductManagement: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Mobile Collapse States
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(true);
  const [isCategoryCollapsed, setIsCategoryCollapsed] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showStockAlerts, setShowStockAlerts] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);

  const addToast = (toast: Omit<Toast, "id">): string => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string): void => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // --- Fetch Data ---
  useEffect(() => {
    const fetchVendorProducts = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getMyProducts();
        if (data.products) {
          const formattedProducts: Product[] = data.products.map(
            (product: any) => ({
              id: product.id || product._id,
              name: product.product_name,
              image: product.images?.[0] || "https://via.placeholder.com/150",
              category: product.category,
              sku: product.sku || `SKU-${product.id}`,
              price: product.product_price,
              stock: product.quantity || 0,
              status: product.status || "active",
              createdAt: product.createdAt || new Date().toISOString(),
              views: product.views || 0,
              description: product.description,
            })
          );
          setProducts(formattedProducts);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching vendor products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProducts();
  }, []);

  // --- Filtering ---
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedQuery) ||
          product.sku.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  // --- Handlers ---
  const handleCategorySelect = (category: string | null): void => {
    setSelectedCategory(category);
    // On mobile, automatically collapse after selection for better UX
    if (window.innerWidth < 1024) {
      setIsCategoryCollapsed(true);
    }
  };

  const handleProductSelect = (
    productId: number | string,
    isSelected: boolean
  ): void => {
    setSelectedProducts((prev) =>
      isSelected
        ? [...prev, Number(productId)]
        : prev.filter((id) => id !== Number(productId))
    );
  };

  const handleSelectAll = (isSelected: boolean): void => {
    setSelectedProducts(
      isSelected ? filteredProducts.map((p) => Number(p.id)) : []
    );
  };

  const handleBulkAction = (action: BulkAction, productIds: number[]): void => {
    console.log(`Performing ${action} on products:`, productIds);
    setSelectedProducts([]);
  };

  const handleAddProduct = (): void => {
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (productId: number | string): void => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setEditingProduct(product);
      setShowAddModal(true);
    }
  };

  const handleDuplicateProduct = (productId: number | string): void => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const loadingToastId = addToast({
        type: "loading",
        title: "Duplicating product...",
        message: "Creating a copy of your product.",
        duration: 0,
      });

      setTimeout(() => {
        const duplicatedProduct: Product = {
          ...product,
          id: Date.now(),
          name: `${product.name} (Copy)`,
          sku: `${product.sku}-COPY`,
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => [duplicatedProduct, ...prev]);

        removeToast(loadingToastId);
        addToast({
          type: "success",
          title: "Product duplicated successfully!",
          message: `${duplicatedProduct.name} has been added to your catalog.`,
          duration: 4000,
        });
      }, 800);
    }
  };

  const handleDeleteProduct = (productId: number | string): void => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Are you sure you want to delete this product?")
    ) {
      const loadingToastId = addToast({
        type: "loading",
        title: "Deleting product...",
        message: "Please wait while we remove this product.",
        duration: 0,
      });

      setTimeout(() => {
        const deletedProduct = products.find((p) => p.id === productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setSelectedProducts((prev) => prev.filter((id) => id !== productId));

        removeToast(loadingToastId);
        addToast({
          type: "success",
          title: "Product deleted successfully!",
          message: deletedProduct
            ? `${deletedProduct.name} has been removed from your catalog.`
            : "Product has been removed.",
          duration: 4000,
        });
      }, 1000);
    }
  };

  const handleQuickEdit = (
    productId: string | number,
    field: string,
    value: string | number
  ): void => {
    setProducts((prev) =>
      prev.map((product) => {
        if (String(product.id) === productId) {
          const isNumericField = [
            "price",
            "stock",
            "views",
            "comparePrice",
            "cost",
            "weight",
          ].includes(field);

          const finalValue = isNumericField ? Number(value) : value;
          return { ...product, [field]: finalValue };
        }
        return product;
      })
    );
  };

  const transformFormDataToApiRequest = (
    formData: ProductFormData
  ): AddProductRequest => {
    const imageUrls = formData.images
      .filter((img: any) => img && img.isUploaded && img.url)
      .map((img: any) => img.url);

    const apiData: AddProductRequest = {
      product_name: formData.name,
      description: (formData.description || "").trim(),
      category: (formData.category || "Uncategorized").trim(),
      product_price: Math.round((parseFloat(formData.price) || 0) * 100),
      quantity: parseInt(formData.stock, 10) || 0,
      status: formData.status || "active",
      visibility: formData.visibility === "visible",
      images: imageUrls,
    };
    return apiData;
  };

  const handleSaveProduct = async (
    formData: ProductFormData
  ): Promise<void> => {
    const isEditing = !!editingProduct;
    const actionText = isEditing ? "Updating" : "Adding";
    const successText = isEditing ? "updated" : "added";

    const loadingToastId = addToast({
      type: "loading",
      title: `${actionText} product...`,
      message: "Please wait while we save your product.",
      duration: 0,
    });

    setLoading(true);
    setError(null);

    try {
      const apiData = transformFormDataToApiRequest(formData);

      if (editingProduct) {
        await productService.editProduct(editingProduct.id, apiData);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  name: apiData.product_name,
                  description: apiData.description,
                  category: apiData.category,
                  price: apiData.product_price,
                  stock: apiData.quantity,
                  status: apiData.status as ProductStatus,
                  image: apiData.images[0] || p.image,
                }
              : p
          )
        );
      } else {
        const response = await productService.addProduct(apiData);
        const newProduct: Product = {
          id: response.data.id || Date.now(),
          name: apiData.product_name,
          description: apiData.description,
          category: apiData.category,
          price: apiData.product_price,
          status: apiData.status as ProductStatus,
          image:
            apiData.images[0] ||
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
          sku: `SKU-${Date.now()}`,
          stock: parseInt(formData.stock, 10) || 0,
          createdAt: new Date().toISOString(),
          views: 0,
        };
        setProducts((prev) => [newProduct, ...prev]);
      }

      removeToast(loadingToastId);
      addToast({
        type: "success",
        title: `Product ${successText} successfully!`,
        message: `${apiData.product_name} has been ${successText} to your catalog.`,
        duration: 4000,
      });

      setShowAddModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Error saving product:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save product";
      removeToast(loadingToastId);
      addToast({
        type: "error",
        title: `Failed to ${actionText.toLowerCase()} product`,
        message: errorMessage,
        duration: 6000,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= 10
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const activeProductsCount = products.filter(
    (p) => p.status === "active"
  ).length;

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="min-h-screen bg-background">
        <div className="max-w-[85vw] mx-auto py-6 px-0 md:px-4">
          {error && (
            <div className="p-4 mb-4 border rounded-lg bg-error/10 border-error/20 mx-4 md:mx-0">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={20} className="text-error" />
                <p className="font-medium text-error">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-error hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* --- Header --- */}
          <div className="flex flex-col mt-14 md:mt-0 sm:flex-row px-4 items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-[18px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold text-foreground">
                Product Management
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage your product catalog and inventory
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(lowStockCount > 0 || outOfStockCount > 0) && (
                <Button
                  variant="outline"
                  onClick={() => setShowStockAlerts(true)}
                  iconName="AlertTriangle"
                  iconPosition="left"
                >
                  Alerts ({lowStockCount + outOfStockCount})
                </Button>
              )}
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
            </div>
          </div>

          {/* --- Collapsible Stats Section --- */}
          <div className="px-4 mb-8">
            <div className="flex items-center justify-between mb-2 lg:hidden">
              <h3 className="font-semibold text-sm text-foreground">Overview</h3>
              <button
                onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
                className="text-primary text-sm flex items-center gap-1 hover:underline"
              >
                {isStatsCollapsed ? "Show Stats" : "Hide Stats"}
                {isStatsCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>

            <div
              className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300 ease-in-out ${
                isStatsCollapsed ? "hidden lg:grid" : "grid"
              }`}
            >
              {/* Stat Cards */}
              <div className="p-4 sm:p-6 border rounded-lg bg-card border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {products.length}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 self-start sm:self-center">
                    <Icon name="Package" size={20} className="text-primary" />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border rounded-lg bg-card border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {activeProductsCount}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-success/10 self-start sm:self-center">
                    <Icon name="CheckCircle" size={20} className="text-success" />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border rounded-lg bg-card border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Low Stock</p>
                    <p className="text-xl sm:text-2xl font-bold text-warning">
                      {lowStockCount}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-warning/10 self-start sm:self-center">
                    <Icon name="AlertTriangle" size={20} className="text-warning" />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border rounded-lg bg-card border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Out of Stock</p>
                    <p className="text-xl sm:text-2xl font-bold text-error">
                      {outOfStockCount}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-error/10 self-start sm:self-center">
                    <Icon name="AlertCircle" size={20} className="text-error" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Main Content --- */}
          <div className="grid grid-cols-1 px-4 gap-6 lg:grid-cols-12">
            
            {/* Sidebar / Category Tree (Collapsible on Mobile) */}
            <div className="lg:col-span-3">
              <div className="lg:hidden mb-4 border rounded-lg p-3 bg-card" onClick={() => setIsCategoryCollapsed(!isCategoryCollapsed)}>
                 <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">Categories & Filters</span>
                    {isCategoryCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                 </div>
              </div>
              
              <div className={`${isCategoryCollapsed ? "hidden lg:block" : "block"}`}>
                 <CategoryTree
                    onCategorySelect={handleCategorySelect}
                    selectedCategory={selectedCategory}
                  />
              </div>
            </div>

            {/* Product List */}
            <div className="lg:col-span-9">
              <ProductToolbar
                onAddProduct={handleAddProduct}
                onBulkAction={handleBulkAction}
                onViewToggle={setViewMode}
                viewMode={viewMode}
                selectedProducts={selectedProducts}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              {loading ? (
                <div className="flex items-center justify-center w-full h-64">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin">
                      <Icon name="Loader2" size={40} className="text-primary" />
                    </div>
                    <p className="text-muted-foreground">Loading products...</p>
                  </div>
                </div>
              ) : viewMode === "table" ? (
                // Wrapper to allow table scrolling on mobile
                <div className="w-full overflow-x-auto">
                    <ProductTable
                    products={filteredProducts}
                    selectedProducts={selectedProducts}
                    onProductSelect={handleProductSelect}
                    onSelectAll={handleSelectAll}
                    onEditProduct={handleEditProduct}
                    onDuplicateProduct={handleDuplicateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onAddProduct={() => { /* Add product handler */ }}
                    onQuickEdit={handleQuickEdit}
                    />
                </div>
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  selectedProducts={selectedProducts}
                  onProductSelect={handleProductSelect}
                  onEditProduct={handleEditProduct}
                  onDuplicateProduct={handleDuplicateProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => {
            if (!loading) {
              setShowAddModal(false);
              setEditingProduct(null);
            }
          }}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
        />

        {showStockAlerts && (
          <StockAlerts onClose={() => setShowStockAlerts(false)} />
        )}
      </div>
    </>
  );
};

export default ProductManagement;