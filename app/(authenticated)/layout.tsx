"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "../components/app-sidebar";
import AppNavbar from "../components/app-navbar";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "../context/UserContext";
import { Loader2 } from "lucide-react";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    // If not logged in, show loading (will redirect)
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-gray-500">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex flex-col min-h-screen w-full bg-gray-50">
                <div className="relative flex flex-1">
                    {/* Sidebar */}
                    <AppSidebar />

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Navbar */}
                        <AppNavbar />

                        {/* Page Content */}
                        <main className="flex-1 flex flex-col">
                            <div className="flex-1 w-full">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>


            </div>
        </SidebarProvider>
    );
}
