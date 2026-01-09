"use client";

import React, { useState, ChangeEvent } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/new/Button";
import Input from "@/components/ui/new/Input";
import { Checkbox } from "@/components/ui/new/Checkbox";

// Types
interface PriceRange {
  min: string;
  max: string;
}

interface AvailabilityFilters {
  inStock: boolean;
  onSale: boolean;
  freeShipping: boolean;
}

export interface Filters {
  categories: string[];
  vendors: string[];
  priceRange: PriceRange;
  minRating: number;
  availability: AvailabilityFilters;
}

interface ExpandedSections {
  categories: boolean;
  price: boolean;
  vendors: boolean;
  rating: boolean;
  availability: boolean;
}

interface FilterPanelProps {
  isMobile?: boolean;
  isOpen?: boolean;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose?: () => void;
}

interface FilterSectionProps {
  title: string;
  sectionKey: keyof ExpandedSections;
  children: React.ReactNode;
  expandedSections: ExpandedSections;
  toggleSection: (key: keyof ExpandedSections) => void;
}

// Filter Section Component
const FilterSection: React.FC<FilterSectionProps & { isMobile?: boolean }> = ({ title, sectionKey, children, expandedSections, toggleSection, isMobile }) => (
  <div className={`${isMobile ? 'pb-3 mb-3' : 'pb-4 mb-4'} border-b border-border last:border-b-0 last:pb-0 last:mb-0`}>
    <button
      onClick={() => toggleSection(sectionKey)}
      className={`flex items-center justify-between w-full ${isMobile ? 'py-1.5' : 'py-2'} text-left`}
    >
      <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-foreground`}>{title}</h3>
      <Icon
        name={expandedSections[sectionKey] ? "ChevronUp" : "ChevronDown"}
        size={isMobile ? 16 : 20}
        className="text-muted-foreground"
      />
    </button>
    {expandedSections[sectionKey] && <div className={`mt-2 ${isMobile ? 'space-y-2' : 'space-y-3'}`}>{children}</div>}
  </div>
);

// Filter Panel
const FilterPanel: React.FC<FilterPanelProps> = ({ isMobile = false, isOpen = false, filters, onFiltersChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    categories: true,
    price: true,
    vendors: true,
    rating: true,
    availability: true,
  });

  // Categories & Vendors sample data
  const categories = [
    { id: "electronics", name: "Electronics", count: 245 },
    { id: "clothing", name: "Clothing & Fashion", count: 189 },
    { id: "home", name: "Home & Garden", count: 156 },
  ];

  const vendors = [
    { id: "techstore", name: "TechStore Pro", count: 45 },
    { id: "fashionhub", name: "Fashion Hub", count: 38 },
  ];

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const updated = checked
      ? [...localFilters.categories, categoryId]
      : localFilters.categories.filter((id) => id !== categoryId);
    setLocalFilters({ ...localFilters, categories: updated });
    onFiltersChange({ ...localFilters, categories: updated });
  };

  const handleVendorChange = (vendorId: string, checked: boolean) => {
    const updated = checked
      ? [...localFilters.vendors, vendorId]
      : localFilters.vendors.filter((id) => id !== vendorId);
    setLocalFilters({ ...localFilters, vendors: updated });
    onFiltersChange({ ...localFilters, vendors: updated });
  };

  const handlePriceChange = (field: keyof PriceRange, value: string) => {
    const updated = { ...localFilters.priceRange, [field]: value };
    setLocalFilters({ ...localFilters, priceRange: updated });
    onFiltersChange({ ...localFilters, priceRange: updated });
  };

  const handleRatingChange = (rating: number) => {
    const updated = localFilters.minRating === rating ? 0 : rating;
    setLocalFilters({ ...localFilters, minRating: updated });
    onFiltersChange({ ...localFilters, minRating: updated });
  };

  const handleAvailabilityChange = (field: keyof AvailabilityFilters, checked: boolean) => {
    const updated = { ...localFilters.availability, [field]: checked };
    setLocalFilters({ ...localFilters, availability: updated });
    onFiltersChange({ ...localFilters, availability: updated });
  };

  const clearAllFilters = () => {
    const cleared: Filters = {
      categories: [],
      vendors: [],
      priceRange: { min: "", max: "" },
      minRating: 0,
      availability: { inStock: false, onSale: false, freeShipping: false },
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Icon key={i} name="Star" size={16} className={`${i < rating ? "text-warning" : "text-muted-foreground"}`} />
    ));

  const panelContent = (
    <div className="flex flex-col md:h-screen  p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-semibold text-foreground`}>Filters</h2>
		<Button variant="ghost" size="icon" onClick={clearAllFilters}>
		  <Icon name="RotateCcw" size={isMobile ? 16 : 20} />
		</Button>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Categories" sectionKey="categories" expandedSections={expandedSections} toggleSection={toggleSection} isMobile={isMobile}>
        <div className={`md:flex items-center justify-start gap-4 ${isMobile ? 'space-y-1.5' : 'space-y-2'}`}>
          {categories.map((c) => (
            <Checkbox
              key={c.id}
              label={c.name}
              checked={localFilters.categories.includes(c.id)}
              onChange={(e) => handleCategoryChange(c.id, e.target.checked)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range" sectionKey="price" expandedSections={expandedSections} toggleSection={toggleSection} isMobile={isMobile}>
        <div className={`grid grid-cols-2 ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
          <Input
            type="number"
            placeholder="Min"
            value={localFilters.priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={localFilters.priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
          />
        </div>
      </FilterSection>

      {/* Vendors */}
	<FilterSection title="Vendors" sectionKey="vendors" expandedSections={expandedSections} toggleSection={toggleSection} isMobile={isMobile}>
	  <div className={`flex justify-between items-center ${isMobile ? 'space-y-1.5' : 'space-y-2'}`}>
		{vendors.map((v) => (
		<div key={v.id} className="flex items-center self-center ">
		  <Checkbox
			label={v.name}
			checked={localFilters.vendors.includes(v.id)}
			onChange={(e) => handleVendorChange(v.id, e.target.checked)}
		  />
		</div>
		))}
	  </div>
	</FilterSection>
{/* Availability */}
      <FilterSection title="Availability" sectionKey="availability" expandedSections={expandedSections} toggleSection={toggleSection} isMobile={isMobile}>
        <div className={`flex justify-between items-center ${isMobile ? 'space-y-1.5' : 'space-y-2'}`}>
          {["inStock", "onSale", "freeShipping"].map((key) => (
            <Checkbox
              key={key}
              label={key === "inStock" ? "In Stock" : key === "onSale" ? "On Sale" : "Free Shipping"}
              checked={localFilters.availability[key as keyof AvailabilityFilters]}
              onChange={(e) => handleAvailabilityChange(key as keyof AvailabilityFilters, e.target.checked)}
            />
          ))}
        </div>
      </FilterSection>
      {/* Rating */}
	<FilterSection title="Customer Rating" sectionKey="rating" expandedSections={expandedSections} toggleSection={toggleSection} isMobile={isMobile}>
	  <div className={`flex items-center pb-18 ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
		{Array.from({ length: 5 }, (_, i) => {
		const starValue = i + 1;
		return (
		  <button
			key={starValue}
			type="button"
			onClick={() => handleRatingChange(starValue)}
			className={`${isMobile ? 'p-0.5' : 'p-1'} rounded transition-colors ${
			localFilters.minRating >= starValue ? "bg-primary/10 border border-primary" : "hover:bg-muted"
			}`}
			aria-label={`Set minimum rating to ${starValue} star${starValue > 1 ? "s" : ""}`}
		  >
			<Icon
			name="Star"
			size={isMobile ? 18 : 24}
			className={localFilters.minRating >= starValue ? "text-warning" : "text-muted-foreground"}
			/>
		  </button>
		);
		})}
	  </div>
	</FilterSection>

      

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="mt-auto">
          <Button variant="default" fullWidth onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-100" onClick={onClose} />}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 transform transition-transform duration-300 max-h-[90vh] overflow-y-auto ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {panelContent}
        </div>
      </>
    );
  }

  // Desktop inline
  return <div className="h-full  ">{panelContent}</div>;
};

export default FilterPanel;
