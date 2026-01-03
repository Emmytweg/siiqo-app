"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Icon from "./AppIcon";
import Link from "next/link";
import { ShoppingCart, Store, X } from "lucide-react";
import CartSystem from "../../app/CartSystem/page";
import { useAuth } from "@/context/AuthContext"; // Import LIVE Auth
import Skeleton from "../skeleton";
import Button from "../Button";

type OptionType = "shopping" | "vendor" | null;

interface ModalOption {
  id: "shopping" | "vendor";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  buttonText: string;
  gradient: string;
  hoverGradient: string;
  iconColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  ringColor: string;
  pulseColor: string;
  route: string;
}

const Header: React.FC = () => {
  // --- local UI state ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType>(null);

  // --- refs / router ---
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname() || "/";

  // --- LIVE AUTH STATE ---
  // We extract the real status from your AuthProvider
  const { logout, user, isLoggedIn, isLoading } = useAuth();

  // --- pages considered "app/dashboard" pages ---
  const appPages = [
    "/home-dashboard",
    "/map-view",
    "/search-results",
    "/product-detail",
    "/user-profile",
    "/create-listing",
    "/vendor",
    "/shopping",
  ];
  const isAppPage = appPages.some((page) => pathname.startsWith(page));

  // --- modal options ---
  const modalOptions: ModalOption[] = [
    {
      id: "shopping",
      title: "Start Shopping",
      description: "Browse our amazing collection of products and find exactly what you need.",
      icon: ShoppingCart,
      buttonText: "Start Shopping",
      gradient: "from-purple-50 to-purple-100",
      hoverGradient: "hover:border-purple-300",
      iconColor: "text-purple-600",
      buttonColor: "bg-purple-600",
      buttonHoverColor: "group-hover:bg-purple-700",
      ringColor: "ring-purple-500",
      pulseColor: "bg-purple-600",
      route: "/auth/login",
    },
    {
      id: "vendor",
      title: "Start Selling",
      description: "Join our marketplace and grow your business by connecting with thousands of eager buyers.",
      icon: Store,
      buttonText: "Start Selling",
      gradient: "from-blue-50 to-blue-100",
      hoverGradient: "hover:border-blue-300",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600",
      buttonHoverColor: "group-hover:bg-blue-700",
      ringColor: "ring-blue-500",
      pulseColor: "bg-blue-600",
      route: "/auth/login",
    },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOption(null);
  };
  
  const handleBackNavigation = () => window.history.length > 1 ? router.back() : router.push("/");
  
  // LIVE LOGOUT
  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    // Logout logic inside Context handles redirect
  };

  const handleCartOpen = () => {
    setIsCartOpen(true);
    setIsOpen(false);
  };
  
  // Logic to handle "business_name" for vendors and "name" for shoppers
  const getFirstName = () => {
    const displayName = user?.name || user?.business_name || "User";
    return displayName.split(" ")[0];
  };

  // --- UI effects ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopRef.current && !desktopRef.current.contains(event.target as Node) && 
          mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) closeModal();
    setIsOpen(false);
  }, [pathname]);

  const showBackButton = pathname === "/product-detail" || pathname === "/create-listing";

  const GetStartedModal: React.FC = () => {
    if (!isModalOpen) return null;
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={closeModal}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-4xl px-4 py-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="relative p-6 pb-0">
            <button onClick={closeModal} className="absolute p-2 rounded-full top-4 right-4 hover:bg-gray-100"><X className="w-6 h-6 text-gray-500" /></button>
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-800">Choose Your Path</h2>
              <p className="text-gray-600">Select how you'd like to get started</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 mb-6 sm:grid-cols-2">
            {modalOptions.map((option) => {
              const IconComp = option.icon;
              return (
                <div key={option.id} className={`group relative bg-gradient-to-br ${option.gradient} border-2 rounded-xl p-6 cursor-pointer transition-all hover:scale-105`}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center mb-4 bg-white rounded-full shadow-md w-14 h-14 sm:w-16 sm:h-16">
                      <IconComp className={`w-7 h-7 ${option.iconColor}`} />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{option.title}</h3>
                    <p className="mb-4 text-sm text-gray-600">{option.description}</p>
                    <button 
                      onClick={() => { router.push(option.route); }} 
                      className={`inline-block ${option.buttonColor} text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors`}
                    >
                      {option.buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 1) Public Header
  if (!isAppPage) {
    return (
      <header className="sticky top-0 z-[200] bg-white border-b border-gray-100">
        <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl md:px-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <img src="/images/siiqo.png" alt="Logo" className="w-full h-14" />
          </Link>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <Skeleton type="rect" width="100px" height="36px" />
            ) : isLoggedIn ? (
              <Button type="button" variant="navy" onClick={() => router.push(user?.target_view === 'vendor' ? "/vendor/dashboard" : "/user-profile")} className="px-5 py-2 text-sm font-medium">
                Dashboard
              </Button>
            ) : (
              <Button type="button" variant="navy" onClick={openModal} className="px-5 py-2 text-sm font-medium">
                Get Started
              </Button>
            )}
          </div>
          <GetStartedModal />
        </div>
      </header>
    );
  }

  // 2) Dashboard/App Header
  return (
    <header className="sticky top-0 z-[200] bg-white border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl md:h-18 md:px-2">
        <div className="flex items-center space-x-4">
          {showBackButton ? (
            <button onClick={handleBackNavigation} className="p-2 -ml-2 rounded-lg hover:bg-surface-secondary">
              <Icon name="ArrowLeft" size={20} />
            </button>
          ) : (
            <Link href="/" className="block">
                <img src="/images/siiqo.png" alt="Logo" className="w-full h-14" />
            </Link>
          )}
        </div>

        <div className="items-center hidden sm:flex gap-x-3">
          {isLoading ? (
            <Skeleton type="rect" width="150px" height="30px" />
          ) : isLoggedIn ? (
            <>
              <span className="hidden text-sm text-gray-600 lg:block">Welcome, {getFirstName()}</span>
              <button onClick={handleCartOpen} className="relative p-2 rounded-lg hover:bg-surface-secondary">
                <Icon name="ShoppingCart" size={20} />
                <div className="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1 border-1 border-surface"></div>
              </button>
              
              <div className="relative" ref={desktopRef}>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-surface-secondary">
                  <Icon name="AlignJustify" size={20} />
                </button>
                {isOpen && (
                  <div className="absolute right-0 z-10 flex flex-col gap-3 p-4 mt-2 bg-white border rounded-lg shadow-xl w-60 border-surface-border">
                    <button 
                      onClick={() => { router.push("/user-profile"); setIsOpen(false); }} 
                      className="w-full text-left p-3 hover:bg-surface-secondary flex items-center gap-2 text-sm font-medium rounded-md"
                    >
                        <Icon name="User" size={16} /> My Profile
                    </button>

                    {user?.target_view === "shopper" || !user?.target_view ? (
                      <button
                        onClick={() => { router.push("/auth/vendor-onboarding"); setIsOpen(false); }}
                        className="flex items-center w-full gap-2 p-3 text-sm font-medium text-left hover:bg-surface-secondary rounded-md"
                      >
                        <Store size={16} /> Become a Vendor
                      </button>
                    ) : (
                      <button
                        onClick={() => { router.push("/vendor/dashboard"); setIsOpen(false); }}
                        className="flex items-center w-full gap-2 p-3 text-sm font-medium text-left hover:bg-surface-secondary rounded-md"
                      >
                        <Store size={16} /> Vendor Dashboard
                      </button>
                    )}
                    
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left p-3 text-white bg-red-600 hover:bg-red-700 flex items-center gap-2 text-sm font-medium rounded-md"
                    >
                      <Icon name="LogOut" size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button type="button" variant="navy" onClick={() => router.push("/auth/login")} className="px-4 py-2 font-medium">Login</Button>
          )}
        </div>

        {/* Mobile App Header */}
        <div className="sm:hidden flex items-center gap-2">
            {isLoggedIn && (
                 <div className="relative" ref={mobileRef}>
                 <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-surface-secondary">
                   <Icon name="AlignJustify" size={20} />
                 </button>
                 {isOpen && (
                   <div className="absolute right-0 z-10 flex flex-col gap-2 p-4 mt-2 bg-white border rounded-lg shadow-xl w-60 border-surface-border">
                     <span className="pb-2 text-sm font-bold border-b">Hi, {getFirstName()}</span>
                     <button onClick={handleCartOpen} className="flex items-center px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg">
                       <ShoppingCart size={16} className="mr-2" /> Cart
                     </button>
                     
                    {user?.target_view === "shopper" || !user?.target_view ? (
                      <button
                        onClick={() => { router.push("/auth/vendor-onboarding"); setIsOpen(false); }}
                        className="flex items-center w-full gap-2 p-3 text-sm font-medium text-left hover:bg-surface-secondary rounded-md"
                      >
                        <Store size={16} /> Become a Vendor
                      </button>
                    ) : (
                      <button
                        onClick={() => { router.push("/vendor/dashboard"); setIsOpen(false); }}
                        className="flex items-center w-full gap-2 p-3 text-sm font-medium text-left hover:bg-surface-secondary rounded-md"
                      >
                        <Store size={16} /> Vendor Dashboard
                      </button>
                    )}

                     <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg text-left">Logout</button>
                   </div>
                 )}
               </div>
            )}
        </div>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full bg-white shadow-lg w-96 max-w-full">
            <div className="p-4">
              <button onClick={() => setIsCartOpen(false)} className="float-right p-2 rounded hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
              <CartSystem />
            </div>
          </div>
        </div>
      )}
      <GetStartedModal />
    </header>
  );
};

export default Header;