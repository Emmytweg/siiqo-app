import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/new/Button';
import Input from '@/components/ui/new/Input';
import Select from '@/components/ui/new/NewSelect';
import { ViewMode, BulkAction } from "@/types/vendor/products";

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "stock-asc"
  | "stock-desc"
  | "created-desc"
  | "created-asc";

export interface ProductToolbarProps {
  onAddProduct: () => void;
  onBulkAction: (action: BulkAction, selectedProducts: number[]) => void;
  onViewToggle: (mode: ViewMode) => void;
  viewMode: ViewMode;
  selectedProducts: number[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  showInStockOnly: boolean;
  onStockFilterChange: (show: boolean) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export interface SelectOption<T> {
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
  sortOption,
  onSortChange,
  showInStockOnly,
  onStockFilterChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);

  const bulkActionOptions: SelectOption<BulkAction>[] = [
    { value: 'activate', label: 'Activate Selected' },
    { value: 'deactivate', label: 'Deactivate Selected' },
    { value: 'duplicate', label: 'Duplicate Selected' },
    { value: 'delete', label: 'Delete Selected' },
    { value: 'export', label: 'Export Selected' }
  ];

  const sortOptions: SelectOption<SortOption>[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'stock-asc', label: 'Stock (Low to High)' },
    { value: 'stock-desc', label: 'Stock (High to Low)' },
    { value: 'created-desc', label: 'Newest First' },
    { value: 'created-asc', label: 'Oldest First' }
  ];

  const handleBulkAction = (action: BulkAction) => {
    onBulkAction(action, selectedProducts);
    setShowBulkActions(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-6 shadow-sm">
      
      {/* TOP ROW */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

        {/* LEFT SECTION */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

          {selectedProducts.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowBulkActions(!showBulkActions)}
                iconName="ChevronDown"
                iconPosition="right"
              >
                Bulk Actions ({selectedProducts.length})
              </Button>

              {showBulkActions && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="py-1">
                    {bulkActionOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleBulkAction(option.value)}
                        className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
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

          {/* <Button
            variant="outline"
            iconName="Upload"
            iconPosition="left"
          >
            Bulk Import
          </Button> */}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto">

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
              value={sortOption}
              onChange={(value: any) => onSortChange(value)}
              placeholder="Sort by..."
            />
          </div>

          <div className="flex items-center bg-muted rounded-xl p-1 w-fit">
            <button
              onClick={() => onViewToggle('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-background text-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Table" size={18} />
            </button>
            <button
              onClick={() => onViewToggle('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-background text-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Grid3X3" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TAGS */}
      <div className="flex flex-wrap items-center gap-2 mt-5">
        <span className="text-sm text-muted-foreground">
          Active filters:
        </span>

        {selectedCategory && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
            {selectedCategory}
            <button className="hover:text-primary/70" onClick={() => onCategoryChange(null)}>
              <Icon name="X" size={12} />
            </button>
          </span>
        )}

        {showInStockOnly && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-success/10 text-success">
            In Stock
            <button className="hover:text-success/70" onClick={() => onStockFilterChange(false)}>
              <Icon name="X" size={12} />
            </button>
          </span>
        )}

        {(selectedCategory || showInStockOnly) && (
          <button 
            className="text-xs text-primary hover:text-primary/80 transition-all"
            onClick={() => {
              onStockFilterChange(false);
              onCategoryChange(null);
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

    </div>
  );
};

export default ProductToolbar;
