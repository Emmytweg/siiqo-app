"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/context/AuthContext';

interface Product {
    price: number;
    originalPrice?: number;
}

interface ActionBarProps {
    product: Product;
    cartQuantity: number;
    onAddToCart: () => void;
    onBuyNow: () => void;
    onWishlistToggle: () => void;
    isWishlisted: boolean;
}

const ActionBar = ({
    product,
    cartQuantity,
    onAddToCart,
    onBuyNow,
    onWishlistToggle,
    isWishlisted
}: ActionBarProps) => {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const [showBuyerModal, setShowBuyerModal] = useState(false);

    // Check if user is in buyer mode
    const isBuyerMode = isLoggedIn && (user?.active_view === "buyer" || user?.target_view === "buyer");

    const handleAddToCart = () => {
        if (!isBuyerMode) {
            setShowBuyerModal(true);
            return;
        }
        onAddToCart();
    };

    const handleBuyNow = () => {
        if (!isBuyerMode) {
            setShowBuyerModal(true);
            return;
        }
        onBuyNow();
    };

    const BuyerModeModal = () => (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 md:p-8 animate-in zoom-in duration-300">
                <div className="relative">
                    <button
                        onClick={() => setShowBuyerModal(false)}
                        className="absolute -top-2 -right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-yellow-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Switch to Buyer Mode
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            {isLoggedIn
                                ? "You need to switch to buyer mode to purchase items and add products to your cart."
                                : "Please log in as a buyer to purchase items and add products to your cart."}
                        </p>

                        <div className="space-y-3">
                            {isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        setShowBuyerModal(false);
                                        alert("Please use the mode switcher in the header to switch to buyer mode");
                                    }}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Switch to Buyer Mode
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowBuyerModal(false);
                                        router.push("/auth/login");
                                    }}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Log In
                                </button>
                            )}

                            <button
                                onClick={() => setShowBuyerModal(false)}
                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="fixed bottom-28 md:bottom-20 left-0 right-0 z-100 bg-white border-t border-border p-4 safe-area-inset-bottom">
                <div className="flex items-center space-x-3">
                    {/* Wishlist Button */}
                    <button
                        onClick={onWishlistToggle}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${isWishlisted
                            ? 'border-accent bg-accent-50 text-accent'
                            : 'border-border text-text-secondary hover:border-border-dark hover:text-text-primary'
                            }`}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Icon
                            name="Heart"
                            size={20}
                            className={isWishlisted ? 'fill-current' : ''}
                        />
                    </button>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!isBuyerMode}
                        className={`flex-1 border-2 border-primary py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                            isBuyerMode
                                ? 'bg-surface-secondary text-primary hover:bg-primary-50'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                    >
                        <Icon name="ShoppingCart" size={18} />
                        <span>Add to Cart</span>
                        {cartQuantity > 0 && (
                            <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                {cartQuantity}
                            </span>
                        )}
                    </button>

                    {/* Buy Now Button */}
                    <button
                        onClick={handleBuyNow}
                        disabled={!isBuyerMode}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                            isBuyerMode
                                ? 'bg-primary text-white hover:bg-primary-700'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                    >
                        <Icon name="CreditCard" size={18} />
                        <span>Buy Now</span>
                    </button>
                </div>
            </div>

            {showBuyerModal && <BuyerModeModal />}
        </>
    );
};

export default ActionBar;