"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API_URL from "../../api/api_url";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        // Validation
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful - Full response:", data);
                console.log("User ID:", data.id);
                console.log("User Name:", data.name);
                console.log("User Email:", data.email);

                // Ensure we have the user ID
                if (!data.id) {
                    console.error("WARNING: No user ID in response!");
                    toast.error("Login error: User ID not received from server");
                    return;
                }

                // Store user data in localStorage
                localStorage.setItem("user", JSON.stringify(data));
                console.log("User data stored in localStorage:", localStorage.getItem("user"));

                // Show success toast
                toast.success(`Welcome back, ${data.name || 'User'}!`, {
                    description: "You have successfully logged in",
                    duration: 3000,
                });

                // Navigate to hero page
                router.push("/hero");
            } else {
                const errorData = await response.json();
                console.error("Login failed:", errorData);
                toast.error("Login Failed", {
                    description: errorData.error || "Please check your credentials and try again",
                });
            }
        } catch (error) {
            console.error("An error occurred:", error);
            toast.error("Connection Error", {
                description: "Unable to connect to server. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>

            <Card className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm bg-white/95 relative z-10 transform transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                            <Sparkles className="w-8 h-8" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-extrabold text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center text-purple-100 mt-2">
                        Sign in to continue your journey
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 p-8">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="pl-10 h-12 border-2 border-gray-200 focus:border-purple-500 transition-all rounded-xl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-purple-500 transition-all rounded-xl"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 p-8 pt-0">
                    <Button
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02]"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></div>
                                <span>Signing In...</span>
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">New to AI Insight?</span>
                        </div>
                    </div>

                    <Link href="/signup" className="text-center">
                        <Button variant="outline" className="w-full h-12 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-xl transition-all">
                            Create Account
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}