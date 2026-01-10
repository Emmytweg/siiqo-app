import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/new/Button';
import Select from '@/components/ui/new/NewSelect';
import Icon, { LucideIconName } from '@/components/AppIcon';
import { productService } from '@/services/productService';

// --- START OF TYPESCRIPT CONVERSION ---

interface Filters {
    category: string;
    customerType: string;
    promotionStatus: string;
    priceRange: string;
}

interface FilterPanelProps {
    onFiltersChange: (filters: Filters) => void;
}

// --- END OF TYPESCRIPT CONVERSION ---

const FilterPanel: React.FC<FilterPanelProps> = ({ onFiltersChange }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [categoryOptions, setCategoryOptions] = useState<Array<{value: string, label: string}>>([{ value: 'all', label: 'All Categories' }]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [filters, setFilters] = useState<Filters>({
        category: 'all',
        customerType: 'all',
        promotionStatus: 'all',
        priceRange: 'all'
    });

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await productService.getCategories();
                if (response && response.categories && Array.isArray(response.categories)) {
                    const options = [
                        { value: 'all', label: 'All Categories' },
                        ...response.categories.map((cat: any) => ({
                            value: cat.name.toLowerCase(),
                            label: cat.name,
                        }))
                    ];
                    setCategoryOptions(options);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const priceRangeOptions = [
        { value: 'all', label: 'All Prices' },
        { value: 'under1000', label: 'Under ₦1,000' },
        { value: '1000to5000', label: '₦1,000 - ₦5,000' },
        { value: '5000to10000', label: '₦5,000 - ₦10,000' },
        { value: 'over10000', label: 'Over ₦10,000' }
    ];

    const handleFilterChange = (key: keyof Filters, value: string): void => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const resetFilters = (): void => {
        const defaultFilters: Filters = {
            category: 'all',
            customerType: 'all',
            promotionStatus: 'all',
            priceRange: 'all'
        };
        setFilters(defaultFilters);
        onFiltersChange(defaultFilters);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

    return (
        <div className="bg-white rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Icon name={'Filter' as LucideIconName} size={20} className="text-text-secondary" />
                    <h3 className="font-medium text-text-primary">Advanced Filters</h3>
                    {hasActiveFilters && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            Active
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            iconName={'X' as LucideIconName}
                            iconPosition="left"
                        >
                            Clear All
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        iconName={(isExpanded ? 'ChevronUp' : 'ChevronDown') as LucideIconName}
                        iconPosition="right"
                    >
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Select
                        label="Product Category"
                        options={categoryOptions}
                        value={filters.category}
                        onChange={(value: string) => handleFilterChange('category', value)}
                        className="w-full"
                    />

                    {/* <Select
                        label="Customer Type"
                        options={customerTypeOptions}
                        value={filters.customerType}
                        onChange={(value: string) => handleFilterChange('customerType', value)}
                        className="w-full"
                    /> */}

                    {/* <Select
                        label="Promotion Status"
                        options={promotionOptions}
                        value={filters.promotionStatus}
                        onChange={(value: string) => handleFilterChange('promotionStatus', value)}
                        className="w-full"
                    /> */}

                    <Select
                        label="Price Range"
                        options={priceRangeOptions}
                        value={filters.priceRange}
                        onChange={(value: string) => handleFilterChange('priceRange', value)}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
};

export default FilterPanel;