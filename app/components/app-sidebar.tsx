'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    BookOpen,
    Settings,
    LogOut,
    GraduationCap,
    BarChart3,
    Users,
    Home
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    Lightbulb,
    Compass,
    BrainCircuit,
    Plus,
    Github,
    Instagram,
    Linkedin,
    Facebook,
    Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddNewCourseDialog } from "./AddNewCourseDialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";

// Navigation section
const sidebarItems = [
    { icon: Home, label: "Home", path: "/hero" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Lightbulb, label: "Quiz", path: "/quiz" },
    { icon: Compass, label: "Explore Courses", path: "/explore-courses" },
    { icon: BrainCircuit, label: "AI Tools", path: "/ai-tools" },
];

// Tools section
const toolItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
];

const socialLinks = [
    { icon: Github, url: "https://github.com/surajacharya12", label: "GitHub" },
    { icon: Instagram, url: "https://www.instagram.com/suraj_acharyaa10/", label: "Instagram" },
    { icon: Linkedin, url: "https://www.linkedin.com/in/surajacharyaa/", label: "LinkedIn" },
    { icon: Facebook, url: "https://www.facebook.com/auraj.acharya/", label: "Facebook" },
    { icon: Twitter, url: "https://x.com/SURAJAC22891334", label: "Twitter" },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useUser();

    const handleLogout = () => {
        toast.warning("Are you sure you want to logout?", {
            action: {
                label: "Logout",
                onClick: () => {
                    logout();
                    toast.success("Logged out successfully!");
                    router.push('/');
                }
            },
            cancel: {
                label: "Cancel",
                onClick: () => {
                    toast.info("Logout cancelled");
                }
            },
            duration: 5000,
        });
    };

    const isActive = (path: string) => pathname === path;

    return (
        <Sidebar className="border-r border-gray-200 bg-gradient-to-b from-white to-gray-50">
            <SidebarHeader className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-green-500 via-green-600 to-blue-600 p-2.5 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                        <GraduationCap className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            AI Insights
                        </h1>
                        <p className="text-xs text-gray-600 font-medium">Education Platform</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
                <SidebarGroup>
                    <AddNewCourseDialog>
                        <Button
                            variant="outline"
                            className="group relative w-full mb-4 flex items-center justify-center space-x-2 px-4 py-6 rounded-xl border-2 border-green-500 text-green-600 font-bold bg-gradient-to-r from-green-50 to-blue-50 shadow-md hover:shadow-2xl hover:from-green-100 hover:to-blue-100 transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1"
                        >
                            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-green-500 p-2 rounded-full group-hover:scale-125 group-hover:rotate-90 transition-all duration-300 shadow-lg">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                            <span className="pl-4 text-base">Create New Course</span>
                        </Button>
                    </AddNewCourseDialog>

                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {sidebarItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                                                ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700 shadow-md'
                                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 hover:shadow-sm hover:translate-x-1'
                                                }`}
                                        >
                                            <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive(item.path)
                                                ? 'bg-green-200 shadow-sm'
                                                : 'bg-gray-100 group-hover:bg-green-100 group-hover:scale-110'
                                                }`}>
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium">{item.label}</span>
                                            {isActive(item.path) && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-6">
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                        Tools
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {toolItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                                                ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700 shadow-md'
                                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 hover:shadow-sm hover:translate-x-1'
                                                }`}
                                        >
                                            <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive(item.path)
                                                ? 'bg-green-200 shadow-sm'
                                                : 'bg-gray-100 group-hover:bg-green-100 group-hover:scale-110'
                                                }`}>
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-6">
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                        About Developer
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="px-3 py-4 bg-gradient-to-br from-green-50/50 to-blue-50/50 rounded-xl border border-green-100/50 mx-2 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-white flex items-center justify-center shadow-md ring-2 ring-white overflow-hidden">
                                    <Image
                                        src="/assets/logo.webp"
                                        alt="Suraj Acharya"
                                        width={60}
                                        height={60}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">Suraj Acharya</p>
                                    <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide truncate">Full Stack Developer</p>
                                </div>
                            </div>
                            <div className="flex gap-1.5 flex-wrap justify-center">
                                {socialLinks.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-white border border-gray-100 text-gray-500 hover:text-green-600 hover:border-green-200 hover:shadow-sm transition-all duration-200 hover:scale-110"
                                        title={item.label}
                                    >
                                        <item.icon className="h-4 w-4" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-200 p-4 bg-gradient-to-r from-red-50 to-orange-50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 group font-medium hover:shadow-md hover:scale-[1.02]"
                            >
                                <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200 group-hover:scale-110 transition-all duration-200">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <span>Logout</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    );
}
