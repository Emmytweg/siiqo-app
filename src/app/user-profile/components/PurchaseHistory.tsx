"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Image from '@/components/ui/AppImage';

interface PurchaseHistoryProps {
    onViewDetails: (productId: string | number) => void;
    onWriteReview: (product: any) => void;
}

interface Purchase {
    id: number;
    title: string;
    price: number;
    image: string;
    seller: string;
    sellerAvatar: string;
    purchaseDate: string;
    status: 'delivered' | 'in_transit' | 'cancelled';
    deliveryDate?: string;
    estimatedDelivery?: string;
    trackingNumber?: string;
    cancelDate?: string;
    cancelReason?: string;
    refundAmount?: number;
    canReorder: boolean;
    canReview: boolean;
    rating: number | null;
}

const PurchaseHistory = ({ onViewDetails, onWriteReview }: PurchaseHistoryProps) => {
    const [filter, setFilter] = useState('all');
    const router = useRouter();

    // Toggle this to true once your API is ready
    const isReady = false;

    const purchases: Purchase[] = [
        {
            id: 1,
            title: "Wireless Bluetooth Headphones",
            price: 89,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
            seller: "TechStore Pro",
            sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
            purchaseDate: "2024-01-25",
            status: "delivered",
            deliveryDate: "2024-01-28",
            trackingNumber: "TRK123456789",
            canReorder: true,
            canReview: true,
            rating: null
        },
        {
            id: 2,
            title: "Organic Coffee Beans - 2lb Bag",
            price: 24,
            image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
            seller: "Local Roasters",
            sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
            purchaseDate: "2024-01-22",
            status: "in_transit",
            estimatedDelivery: "2024-01-30",
            trackingNumber: "TRK987654321",
            canReorder: true,
            canReview: false,
            rating: null
        }
    ];

    const filterOptions = [
        { value: 'all', label: 'All Orders', count: isReady ? purchases.length : 0 },
        { value: 'delivered', label: 'Delivered', count: isReady ? purchases.filter(p => p.status === 'delivered').length : 0 },
        { value: 'in_transit', label: 'In Transit', count: isReady ? purchases.filter(p => p.status === 'in_transit').length : 0 },
        { value: 'cancelled', label: 'Cancelled', count: isReady ? purchases.filter(p => p.status === 'cancelled').length : 0 }
    ];

    const filteredPurchases = filter === 'all'
        ? purchases
        : purchases.filter(purchase => purchase.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-success-50 text-success border-success-100';
            case 'in_transit': return 'bg-warning-50 text-warning border-warning-100';
            case 'cancelled': return 'bg-error-50 text-error border-error-100';
            default: return 'bg-surface-secondary text-text-secondary border-border';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex justify-between overflow-x-scroll md:px-4 md:overflow-x-hidden space-x-2 bg-transparent">
                {filterOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                            filter === option.value
                                ? 'bg-surface text-text-primary shadow-sm'
                                : 'bg-surface-secondary text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        {option.label}
                        <span className={`absolute top-1 -right-2 w-4 h-4 rounded-full text-xs font-semibold flex items-center justify-center ${
                            filter === option.value ? 'bg-[#E0921C] text-white' : 'bg-border text-text-tertiary'
                        }`}>
                            {option.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            {!isReady ? (
                /* Coming Soon State */
                <div className="relative">
                    <div className="grid md:grid-cols-2 gap-4 opacity-40 pointer-events-none filter blur-[1px]">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-surface border border-border rounded-lg p-4">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-border/50 rounded-lg animate-pulse" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-border/50 rounded w-3/4 animate-pulse" />
                                        <div className="h-3 bg-border/50 rounded w-1/2 animate-pulse" />
                                        <div className="h-8 bg-border/50 rounded w-full mt-4 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Centered Coming Soon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-surface/90 border border-border px-8 py-10 rounded-2xl shadow-xl text-center max-w-sm mx-4 backdrop-blur-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="Clock" size={32} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">Coming Soon</h3>
                            <p className="text-text-secondary text-sm">
                                We are currently building your purchase history dashboard. You'll be able to track orders and write reviews very soon!
                            </p>
                        </div>
                    </div>
                </div>
            ) : filteredPurchases.length > 0 ? (
                /* Real Purchase List (Hidden until isReady is true) */
                <div className="grid md:grid-cols-2 gap-4">
                    {filteredPurchases.map((purchase) => (
                        <div key={purchase.id} className="bg-surface border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex gap-4">
                                <div className="relative w-20 h-20 flex-shrink-0">
                                    <Image src={purchase.image} fill alt={purchase.title} className="object-cover rounded-lg" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-text-primary text-sm truncate">{purchase.title}</h3>
                                    <p className="text-xs text-text-secondary mb-2">Purchased {formatDate(purchase.purchaseDate)}</p>
                                    <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(purchase.status)}`}>
                                        {purchase.status.toUpperCase()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-text-primary">${purchase.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="ShoppingBag" size={24} className="text-text-tertiary" />
                    </div>
                    <h3 className="text-lg font-medium text-text-primary mb-2">No orders found</h3>
                    <button 
                        onClick={() => router.push('/')}
                        className="text-primary font-medium hover:underline"
                    >
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;