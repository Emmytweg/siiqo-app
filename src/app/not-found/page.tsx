"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        // Check if user is logged in (adjust based on your auth implementation)
        const token = localStorage.getItem("authToken");
        setIsLoggedIn(!!token);

        console.error(
            "404 Error: User attempted to access non-existent route:",
            pathname
        );
    }, [pathname]);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
                    <p className="text-xl text-gray-600 mb-4">Please log in to continue</p>
                    <Link href="/auth/login" className="text-blue-500 hover:text-blue-700 underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
                <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
