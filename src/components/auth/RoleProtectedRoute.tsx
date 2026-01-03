"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Import your context hook
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowed_views: string[]; // e.g., ["vendor"] or ["shopper", "admin"]
}

export default function ProtectedRoute({ children, allowed_views }: ProtectedRouteProps) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the AuthProvider has finished checking for the user
    if (!isLoading) {
      if (!isLoggedIn || !user) {
        router.push("/auth/login");
      } else if (!allowed_views.includes(user.target_view)) {
        // If logged in but wrong target_view, send them to their appropriate home
        if (user.target_view === "vendor") {
          router.push("/vendor/dashboard");
        } else {
          router.push("/user-profile");
        }
      }
    }
  }, [isLoading, isLoggedIn, user, allowed_views, router]);

  // While checking auth status, show a loading spinner
  if (isLoading || !isLoggedIn || !user || !allowed_views.includes(user.target_view)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="mt-4 text-sm font-medium text-gray-500">Verifying access...</p>
      </div>
    );
  }

  // If all checks pass, render the page content
  return <>{children}</>;
}