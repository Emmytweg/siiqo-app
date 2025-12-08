
"use client";

import React from 'react';
import Icon, { LucideIconName } from '@/components/ui/AppIcon';

interface Filter {
    id: string;
    label: string;
    type: string;
    value: any;
    icon: LucideIconName;
    colorClass: string;
}

interface QuickFiltersProps {
    onApplyFilter: (filter: Omit<Filter, 'id'>) => void;
}

const QuickFilters = ({ onApplyFilter }: QuickFiltersProps) => {
    // Enhanced filters with colors to match the visual style
    // Colors updated to brand: Navy #1B3F61, Gold #DE941D
    const quickFilters: Omit<Filter, 'id'>[] = [
        {
            label: 'Coffee',
            type: 'category',
            value: 'coffee',
            icon: 'Coffee',
            colorClass: 'bg-[#DE941D] text-white'
        },
        {
            label: 'Fresh',
            type: 'category',
            value: 'fresh',
            icon: 'Leaf',
            colorClass: 'bg-emerald-400 text-white'
        },
        {
            label: 'Deals',
            type: 'price',
            value: 20,
            icon: 'Zap',
            colorClass: 'bg-rose-400 text-white'
        },
        {
            label: 'Nearby',
            type: 'distance',
            value: 2,
            icon: 'MapPin',
            colorClass: 'bg-[#1B3F61] text-white'
        }
    ];

    return (
        <div className="flex items-center justify-between w-full py-2">
            <div className="flex space-x-4 justify-center w-full">
                {quickFilters.map((filter, index) => (
                    <button
                        key={index}
                        onClick={() => onApplyFilter(filter)}
                        className="group flex flex-col items-center space-y-1"
                    >
                        <div className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform transform group-hover:scale-110 ${filter.colorClass}`}>
                            <Icon name={filter.icon} size={20} />
                        </div>
                        {/* Only show label for accessibility/tooltip, distinct visual style uses just icons mostly */}
                        <span className="text-[10px] font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 bg-white/90 px-2 py-0.5 rounded-full">
                            {filter.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickFilters;
