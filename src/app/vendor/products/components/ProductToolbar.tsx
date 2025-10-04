import React, { useState, useRef, useEffect } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/new/Button";
import Input from "@/components/ui/new/Input";
import Select from "@/components/ui/new/NewSelect";

// Define specific types for props to ensure type safety
type ViewMode = "table" | "grid";
type BulkAction = "activate" | "deactivate" | "duplicate" | "delete" | "export";
type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "stock-asc"
  | "stock-desc"
  | "created-desc"
  | "created-asc";

// Interface for the component's props
interface ProductToolbarProps {
  onAddProduct: () => void;
  onBulkAction: (action: BulkAction, selectedProducts: string[] | any) => void;
  onViewToggle: (mode: ViewMode) => void;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  selectedProducts: string[] | any;
  searchQuery: string;
}

// Interface for select options
interface SelectOption<T> {
  value: T;
  label: string;
}

const ProductToolbar: React.FC<ProductToolbarProps> = ({
  onAddProduct,
  onBulkAction,
  onViewToggle,
  viewMode,
  selectedProducts,
  searchQuery,
  onSearchChange,
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);
  const bulkRef = useRef<HTMLDivElement | null>(null);

  const bulkActionOptions: SelectOption<BulkAction>[] = [
    { value: "activate", label: "Activate Selected" },
    { value: "deactivate", label: "Deactivate Selected" },
    { value: "duplicate", label: "Duplicate Selected" },
    { value: "delete", label: "Delete Selected" },
    { value: "export", label: "Export Selected" },
  ];

  const sortOptions: SelectOption<SortOption>[] = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "stock-asc", label: "Stock (Low to High)" },
    { value: "stock-desc", label: "Stock (High to Low)" },
    { value: "created-desc", label: "Newest First" },
    { value: "created-asc", label: "Oldest First" },
  ];

  const handleBulkAction = (action: BulkAction) => {
    onBulkAction(action, selectedProducts);
    setShowBulkActions(false);
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!showBulkActions) return;
      const target = e.target as Node;
      if (bulkRef.current && !bulkRef.current.contains(target)) {
        setShowBulkActions(false);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [showBulkActions]);

  return (
    <div className="p-4 mb-6 border rounded-lg bg-card border-border">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        {/* Left Section - Bulk Actions & Add Product */}
        <div className="flex items-center min-w-0 space-x-3">
          {selectedProducts.length > 0 && (
            <div ref={bulkRef} className="relative">
              <Button
                variant="outline"
                onClick={() => setShowBulkActions(prev => !prev)}
                iconName="ChevronDown"
                iconPosition="right"
                className="flex-shrink-0"
              >
                Bulk Actions ({selectedProducts.length})
              </Button>

              {showBulkActions && (
                <div className="absolute right-0 z-50 w-48 mt-2 border rounded-lg top-full bg-popover border-border shadow-dropdown">
                  <div className="py-1">
                    {bulkActionOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleBulkAction(option.value)}
                        className="w-full px-4 py-2 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Button
            variant="default"
            onClick={onAddProduct}
            iconName="Plus"
            iconPosition="left"
          >
            Add New Product
          </Button>

          <Button variant="outline" iconName="Upload" iconPosition="left">
            Bulk Import
          </Button>
        </div>

        {/* Right Section - Search, Sort & View Toggle */}
        <div className="flex flex-wrap items-center min-w-0 space-x-3 lg:flex-nowrap">
          <div className="w-full sm:w-64">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              className="w-full"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              options={sortOptions}
              value="created-desc"
              onChange={() => {}} // Assuming Select component handles this
              placeholder="Sort by..."
            />
          </div>

          <div className="flex items-center flex-shrink-0 p-1 rounded-lg bg-muted">
            <button
              onClick={() => onViewToggle("table")}
              className={`p-2 rounded-md transition-smooth ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              type="button"
            >
              <Icon name="Table" size={18} />
            </button>
            <button
              onClick={() => onViewToggle("grid")}
              className={`p-2 rounded-md transition-smooth ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              type="button"
            >
              <Icon name="Grid3X3" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center mt-4 space-x-2 overflow-x-auto">
        <span className="text-sm text-muted-foreground">Active filters:</span>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
            Electronics
            <button className="ml-1 hover:text-primary/80" type="button">
              <Icon name="X" size={12} />
            </button>
          </span>
          <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-success/10 text-success">
            In Stock
            <button className="ml-1 hover:text-success/80" type="button">
              <Icon name="X" size={12} />
            </button>
          </span>
          <button
            className="text-xs text-primary hover:text-primary/80 transition-smooth"
            type="button"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
