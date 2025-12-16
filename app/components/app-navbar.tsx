'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Bot,
    ShoppingCart,
    FileText,
    Gavel,
    Bell,
    User,
    Menu,
    X,
    MessageSquare,
} from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";

const NavItem = ({ href, label, icon: Icon, active }: any) => (
    <Link
        href={href}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${active
            ? 'bg-green-100 text-green-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
            }`}
    >
        <Icon className="h-4 w-4 mr-2" />
        <span>{label}</span>
    </Link>
);

const AppNavbar = () => {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;
    const { user, loading } = useUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { href: '/hero', label: 'Home', icon: Home },
        { href: '/thinkbot', label: 'ThinkBot', icon: Bot },
        { href: '/resources', label: 'Resources', icon: FileText },
        { href: '/chatpdf', label: 'ChatPDF', icon: MessageSquare },
    ];

    return (
        <nav className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="h-full px-4 sm:px-6 flex items-center justify-between">
                {/* Left Section - Sidebar Trigger & Nav Items */}
                <div className="flex items-center space-x-2">
                    <SidebarTrigger className="mr-2" />

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                active={isActive(item.href)}
                            />
                        ))}
                    </div>

                    {/* Mobile - Just show title */}
                    <h2 className="lg:hidden text-base sm:text-lg font-semibold text-gray-800">
                        AI Insights
                    </h2>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Desktop Notifications */}
                    <button className="hidden sm:block relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Desktop User Profile */}
                    <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-gray-200">
                        {!loading && user && (
                            <>
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium text-gray-800">
                                        {user.name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user.email || ''}
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform overflow-hidden">
                                    {user.photo ? (
                                        <img
                                            src={user.photo}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-5 w-5 text-white" />
                                    )}
                                </div>
                            </>
                        )}
                        {loading && (
                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        )}
                        {!loading && !user && (
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium text-gray-800">Guest User</p>
                                    <p className="text-xs text-gray-500">Not logged in</p>
                                </div>
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-600" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="sm:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {/* Mobile Navigation Items */}
                            <div className="space-y-1 pb-3 border-b border-gray-200">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.2 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all ${isActive(item.href)
                                                ? 'bg-green-100 text-green-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <item.icon className="h-5 w-5 mr-3" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Mobile User Section */}
                            <motion.div
                                className="pt-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {!loading && user && (
                                    <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {user.photo ? (
                                                <img
                                                    src={user.photo}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-6 w-6 text-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                {user.name || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email || ''}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {!loading && !user && (
                                    <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Guest User</p>
                                            <p className="text-xs text-gray-500">Not logged in</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Mobile Notifications */}
                            <motion.div
                                className="pt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.35 }}
                            >
                                <button className="w-full flex items-center px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Bell className="h-5 w-5 mr-3" />
                                    <span className="text-base font-medium">Notifications</span>
                                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default AppNavbar;
