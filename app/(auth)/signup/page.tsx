"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Loader2 } from "lucide-react";
import API_URL from "../../api/api_url";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const router = useRouter();
    const { user, loading: userLoading } = useUser();

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (!userLoading && user) {
            router.replace("/dashboard");
        }
    }, [user, userLoading, router]);

    // Show loading while checking auth status
    if (userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                    <p className="text-white/80">Checking login status...</p>
                </div>
            </div>
        );
    }

    // If user is logged in, show loading (will redirect)
    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                    <p className="text-white/80">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    const handleSignup = async () => {
        // Validation
        if (!name || !email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (name.length < 2) {
            toast.error("Name must be at least 2 characters long");
            return;
        }

        if (!email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (!agreedToTerms) {
            toast.warning("Please agree to the terms and conditions");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Signup successful:", data);
                toast.success("Account created successfully!", {
                    description: "Please login with your credentials",
                    duration: 3000,
                });
                router.push("/login");
            } else {
                const errorData = await response.json();
                toast.error("Signup Failed", {
                    description: errorData.error || "Unable to create account. Please try again.",
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Connection Error", {
                description: "Unable to connect to server. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
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
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                            <Sparkles className="w-8 h-8" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-extrabold text-center">Join AI Insight</CardTitle>
                    <CardDescription className="text-center text-indigo-100 mt-2">
                        Create your account and start exploring
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5 p-8">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                id="name"
                                placeholder="John Doe"
                                className="pl-10 h-12 border-2 border-gray-200 focus:border-indigo-500 transition-all rounded-xl"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="pl-10 h-12 border-2 border-gray-200 focus:border-indigo-500 transition-all rounded-xl"
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
                                placeholder="Create a strong password"
                                className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-indigo-500 transition-all rounded-xl"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="terms"
                            checked={agreedToTerms}
                            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                        />
                        <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                            I agree to the{" "}
                            <Link href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                                terms and conditions
                            </Link>
                        </Label>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 p-8 pt-0">
                    <Button
                        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02]"
                        onClick={handleSignup}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></div>
                                <span>Creating account...</span>
                            </div>
                        ) : (
                            "Create Account"
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    <Link href="/login" className="text-center">
                        <Button variant="outline" className="w-full h-12 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-xl transition-all">
                            Sign In
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
