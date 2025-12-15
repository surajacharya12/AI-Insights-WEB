import { AppSidebar } from "../components/app-sidebar";
import AppNavbar from "../components/app-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "../context/UserContext";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <SidebarProvider>
                <div className="flex min-h-screen w-full bg-gray-50">
                    {/* Sidebar */}
                    <AppSidebar />

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Navbar */}
                        <AppNavbar />

                        {/* Page Content */}
                        <main className="flex-1 overflow-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </UserProvider>
    );
}
