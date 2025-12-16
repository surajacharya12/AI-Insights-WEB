"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API_URL from "../../api/api_url";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Sparkles,
    Loader2,
    GraduationCap,
    Brain,
    Zap,
    BookOpen,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { user, loading: userLoading, setUser } = useUser();

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (!userLoading && user) {
            router.replace("/dashboard");
        }
    }, [user, userLoading, router]);

    // Show loading while checking auth status
    if (userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" />
                        <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                    </div>
                    <p className="text-white/80 font-medium">Checking login status...</p>
                </motion.div>
            </div>
        );
    }

    // If user is logged in, show redirect message
    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                    <p className="text-white/80 font-medium">Redirecting to dashboard...</p>
                </motion.div>
            </div>
        );
    }

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();

                if (!data.id) {
                    toast.error("Login error: User ID not received");
                    return;
                }

                localStorage.setItem("user", JSON.stringify(data));
                setUser(data);

                toast.success(`Welcome back, ${data.name || 'User'}!`, {
                    description: "Redirecting to dashboard...",
                    duration: 2000,
                });

                router.push("/dashboard");
            } else {
                const errorData = await response.json();
                toast.error("Login Failed", {
                    description: errorData.error || "Please check your credentials",
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Connection Error", {
                description: "Unable to connect to server",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    const features = [
        { icon: Brain, text: "AI-Powered Learning" },
        { icon: BookOpen, text: "Custom Course Generation" },
        { icon: Zap, text: "Interactive Quizzes" },
    ];

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-12">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/30">
                                <GraduationCap className="w-10 h-10 text-white" />
                            </div>
                            <span className="text-4xl font-black text-white">AI Insight</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl xl:text-6xl font-black text-white leading-tight mb-6">
                            Welcome back to<br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                your learning journey
                            </span>
                        </h1>

                        <p className="text-xl text-white/60 mb-12 max-w-lg">
                            Continue exploring AI-generated courses, take quizzes, and track your progress towards mastery.
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <feature.icon className="w-5 h-5 text-purple-300" />
                                    </div>
                                    <span className="text-white/80 font-medium">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-10 left-10 flex items-center gap-2 text-white/40 text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Powered by Advanced AI</span>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50 dark:bg-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">AI Insight</span>
                    </div>

                    {/* Form Header */}
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Sign in
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-12 h-14 text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="pl-12 pr-12 h-14 text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            )}
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500">
                                New to AI Insight?
                            </span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <Link href="/signup">
                        <Button
                            variant="outline"
                            className="w-full h-14 text-base font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"
                        >
                            Create an account
                        </Button>
                    </Link>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="text-indigo-600 hover:underline">Terms</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}