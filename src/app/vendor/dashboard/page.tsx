"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useVendorDashboard } from "@/hooks/useVendorDashboard";
import { DashboardStatsData, Order, Product, PerformanceData, Notification } from "@/types/dashboard";

import DashboardStats from "./components/DashboardStats";
import QuickActions from "./components/QuickActions";
import PerformanceChart from "./components/PerformanceChart";
import NotificationPanel from "./components/NotificationPanel";
import RecentOrders from "./components/RecentOrders";
import ProductOverview from "./components/ProductOverview";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
const VendorDashboard: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { dashboardData, isLoading: isDashboardLoading } = useVendorDashboard();
  const router = useRouter();

  const isLoading = isAuthLoading || isDashboardLoading;

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/auth/login");
    }
  }, [isAuthLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is null after loading, it means they are not authenticated, so return null after redirect
  if (!user) {
    return null;
  }

  return (
    <RoleProtectedRoute allowedRoles={["vendor"]}>
    <div className="min-h-screen bg-background mt-14 md:mt-0 pb-10">
      {/* 
        Responsive Container:
        - Mobile: w-full px-4
        - Tablet/Desktop: max-w-[85vw] mx-auto 
      */}
      <main className="w-full md:max-w-[85vw] mx-auto px-4 py-4 md:py-6">
        
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="mb-1 md:mb-2 text-xl md:text-2xl font-bold font-heading text-text-primary">
            Welcome back, {user?.business_name || user?.name}! 👋
          </h1>
          <p className="text-sm md:text-base text-text-muted">
            Here's what's happening with your business today
          </p>
        </div>

        {/* 
          Grid Layout:
          - Mobile: 1 column (grid-cols-1)
          - Tablet: 1 column (grid-cols-1)
          - Desktop (LG): 12 columns (lg:grid-cols-12)
        */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12">
          
          {/* Stats: Top on mobile, Left Main on Desktop */}
          {dashboardData?.stats && (
            <div className="order-1 lg:col-span-8">
              <DashboardStats stats={dashboardData.stats} />
            </div>
          )}

          {/* Quick Actions: After Stats on mobile, Right Sidebar on Desktop */}
          <div className="order-2  lg:col-span-4">
            <QuickActions />
          </div>

          {/* Performance Chart: Below Quick Actions on mobile, Left Main on Desktop */}
          {dashboardData?.performanceData && (
            <div className="order-3 lg:col-span-7">
              <PerformanceChart data={dashboardData.performanceData} />
            </div>
          )}

          {/* Notifications: Below Performance on mobile, Right Sidebar on Desktop */}
          {dashboardData?.notifications && (
            <div className="order-4 lg:col-span-5 z-0 lg:z-10">
              <NotificationPanel notifications={dashboardData.notifications} />
            </div>
          )}

          {/* Recent Orders: Below Notifications on mobile, Left Main on Desktop */}
          {dashboardData?.recentOrders && (
            <div className="order-5 lg:col-span-7">
              <RecentOrders orders={dashboardData.recentOrders} />
            </div>
          )}

          {/* Product Overview: Bottom on mobile, Right Sidebar on Desktop */}
          {dashboardData?.topProducts && (
            <div className="order-6 lg:col-span-5">
              <ProductOverview products={dashboardData.topProducts} />
            </div>
          )}
        </div>
      </main>
    </div>
    </RoleProtectedRoute>
  );
};

export default VendorDashboard;