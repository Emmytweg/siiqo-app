'use client'

import React, { useState, useMemo } from 'react';
import Icon, { LucideIconName } from '@/components/AppIcon';
import Button from '@/components/ui/new/Button';
import Image from '@/components/ui/alt/AppImageAlt';

// --- TYPES ---
interface ProductData {
    id: number | string;
    image?: string;
    images?: string[];
    name: string;
    category?: string;
    revenue?: number;
    unitsSold?: number;
    rating?: number;
    stock?: number;
    quantity?: number;
    final_price?: number;
    price?: number;
    sku?: string;
    status?: string;
    orders_count?: number;
}

interface TopProductsTableProps {
    data?: ProductData[]; // Made optional
    isLoading?: boolean;
}

type SortableField = 'revenue' | 'unitsSold' | 'rating' | 'stock';
type SortDirection = 'asc' | 'desc';

const TopProductsTable: React.FC<TopProductsTableProps> = ({ data = [], isLoading = false }) => {
    const [sortField, setSortField] = useState<SortableField>('revenue');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    // memoize the sorting so it doesn't run on every re-render unless data/sort changes
    const sortedData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        
        return [...data].sort((a, b) => {
            // Handle different field names for sorting
            let aValue = 0;
            let bValue = 0;
            
            switch (sortField) {
                case 'revenue':
                    aValue = a.final_price || a.price || a.revenue || 0;
                    bValue = b.final_price || b.price || b.revenue || 0;
                    break;
                case 'unitsSold':
                    aValue = a.unitsSold || a.orders_count || 0;
                    bValue = b.unitsSold || b.orders_count || 0;
                    break;
                case 'stock':
                    aValue = a.quantity || a.stock || 0;
                    bValue = b.quantity || b.stock || 0;
                    break;
                case 'rating':
                    aValue = a.rating || 0;
                    bValue = b.rating || 0;
                    break;
                default:
                    aValue = 0;
                    bValue = 0;
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });
    }, [data, sortField, sortDirection]);

    const handleSort = (field: SortableField): void => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const getSortIcon = (field: SortableField): LucideIconName => {
        if (sortField !== field) return 'ArrowUpDown';
        return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
    };

    const exportToCSV = (): void => {
        if (!sortedData || sortedData.length === 0) {
            alert('No data to export');
            return;
        }

        // Headers for CSV
        const headers = ['Product Name', 'Category', 'Price', 'Stock', 'SKU', 'Status'];
        
        // Map data to CSV rows - handle both API response formats
        const csvData = [
            headers.join(','),
            ...sortedData.map((item: ProductData) => {
                // Escape quotes in product names
                const productName = `"${(item.name || 'Unknown').replace(/"/g, '""')}"`;
                const category = item.category || 'Uncategorized';
                const price = item.final_price || item.price || 0;
                const stock = item.quantity || item.stock || 0;
                const sku = item.sku || 'N/A';
                const status = item.status || 'active';
                
                return [
                    productName,
                    category,
                    price,
                    stock,
                    sku,
                    status
                ].join(',');
            })
        ].join('\n');

        // Create and download CSV file
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generate filename with current date
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `top-products-${dateStr}.csv`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-10 bg-slate-50 rounded"></div>
                    <div className="h-10 bg-slate-50 rounded"></div>
                    <div className="h-10 bg-slate-50 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between bg-white border-b border-slate-50">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Top Performing Products</h3>
                    <p className="text-xs font-medium text-slate-500">Sales and inventory data</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCSV}
                    iconName="Download"
                    className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                    Export CSV
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Product</th>
                            
                            {/* Sortable Headers */}
                            {[
                                { id: 'revenue', label: 'Revenue' },
                                { id: 'unitsSold', label: 'Units Sold' },
                                { id: 'rating', label: 'Rating' },
                                { id: 'stock', label: 'Stock' }
                            ].map((col) => (
                                <th 
                                    key={col.id}
                                    className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                                    onClick={() => handleSort(col.id as SortableField)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{col.label}</span>
                                        <Icon name={getSortIcon(col.id as SortableField)} size={12} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">
                                    No product data found for this period
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                                                <Image
                                                    src={product.images?.[0] || product.image || '/placeholder-product.png'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 leading-none mb-1">{product.name || 'Untitled Product'}</p>
                                                <p className="text-xs font-semibold text-slate-400">{product.category || 'Uncategorized'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="font-black text-slate-900">
                                            ₦{((product.final_price || product.price || product.revenue) ?? 0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="font-bold text-slate-600">{product.unitsSold || product.orders_count || 0}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-1">
                                            <Icon name="Star" size={14} className="text-amber-400 fill-current" />
                                            <span className="font-bold text-slate-700">{product.rating || '0.0'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            ((product.quantity || product.stock) ?? 0) > 20
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : ((product.quantity || product.stock) ?? 0) > 5
                                                    ? 'bg-amber-50 text-amber-600' 
                                                    : 'bg-rose-50 text-rose-600'
                                        }`}>
                                            {((product.quantity || product.stock) ?? 0) > 0 ? `${(product.quantity || product.stock)} In Stock` : 'Out of Stock'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopProductsTable;