"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Sparkles,
    Loader2,
    GraduationCap,
    Brain,
    Zap,
    BookOpen,
    ArrowRight,
    CheckCircle2,
    Rocket,
    Target
} from "lucide-react";
import API_URL from "../../api/api_url";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // New state for OTP
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950">
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

    const handleSignup = async () => {
        if (!name || !email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (name.length < 2) {
            toast.error("Name must be at least 2 characters");
            return;
        }

        if (!email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
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
                toast.success("OTP Sent!", {
                    description: "Please check your email for the verification code",
                    duration: 3000,
                });
                setIsOtpSent(true);
            } else {
                const errorData = await response.json();
                toast.error("Signup Failed", {
                    description: errorData.error || "Unable to create account",
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

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            if (response.ok) {
                // Verification successful, redirect to login
                toast.success("Account Verified!", {
                    description: "Please login with your new account",
                    duration: 3000,
                });
                router.push("/login");
            } else {
                const errorData = await response.json();
                toast.error("Verification Failed", {
                    description: errorData.error || "Invalid OTP",
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
            if (isOtpSent) {
                handleVerifyOtp();
            } else if (agreedToTerms) {
                handleSignup();
            }
        }
    };

    const benefits = [
        { icon: Brain, title: "AI Course Generation", desc: "Create courses on any topic" },
        { icon: Target, title: "Progress Tracking", desc: "Monitor your learning journey" },
        { icon: Zap, title: "Smart Quizzes", desc: "Test your knowledge instantly" },
        { icon: Rocket, title: "Fast Learning", desc: "Learn at your own pace" },
    ];

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Signup Form */}
            <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white dark:bg-gray-900 order-2 lg:order-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">AI Insight</span>
                    </div>

                    {/* Form Header */}
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Create an account
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Start your AI-powered learning journey today
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        {!isOtpSent ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="John Doe"
                                            className="pl-12 h-14 text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                    </div>
                                </div>

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
                                            className="pl-12 h-14 text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                                            placeholder="Create a strong password"
                                            className="pl-12 pr-12 h-14 text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                                </div>

                                <div className="flex items-start gap-3 pt-2">
                                    <Checkbox
                                        id="terms"
                                        checked={agreedToTerms}
                                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                        className="mt-0.5"
                                    />
                                    <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-relaxed">
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-purple-600 hover:underline font-medium">
                                            Terms of Service
                                        </Link>
                                        {" "}and{" "}
                                        <Link href="/privacy" className="text-purple-600 hover:underline font-medium">
                                            Privacy Policy
                                        </Link>
                                    </Label>
                                </div>

                                <Button
                                    onClick={handleSignup}
                                    disabled={loading || !agreedToTerms}
                                    className="w-full h-14 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Sending OTP...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Create Account</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Verify your email</h3>
                                    <p className="text-sm text-gray-500 mt-2">
                                        We've sent a 6-digit code to <span className="font-medium text-gray-900 dark:text-white">{email}</span>
                                    </p>
                                </div>

                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={6}
                                        value={otp}
                                        onChange={(value) => setOtp(value)}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className="border-2 border-black" />
                                            <InputOTPSlot index={1} className="border-2 border-black" />
                                            <InputOTPSlot index={2} className="border-2 border-black" />
                                            <InputOTPSlot index={3} className="border-2 border-black" />
                                            <InputOTPSlot index={4} className="border-2 border-black" />
                                            <InputOTPSlot index={5} className="border-2 border-black" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>


                                <Button
                                    onClick={handleVerifyOtp}
                                    disabled={loading || otp.length !== 6}
                                    className="w-full h-14 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Verifying...</span>
                                        </div>
                                    ) : (
                                        <span>Verify Email</span>
                                    )}
                                </Button>

                                <div className="text-center">
                                    <button
                                        onClick={() => setIsOtpSent(false)}
                                        className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                                    >
                                        Change email or resend
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <Link href="/login">
                        <Button
                            variant="outline"
                            className="w-full h-14 text-base font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all"
                        >
                            Sign in instead
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Right Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 overflow-hidden order-1 lg:order-2">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
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
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/30">
                                <GraduationCap className="w-10 h-10 text-white" />
                            </div>
                            <span className="text-4xl font-black text-white">AI Insight</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl xl:text-6xl font-black text-white leading-tight mb-6">
                            Start learning<br />
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                                with AI power
                            </span>
                        </h1>

                        <p className="text-xl text-white/60 mb-12 max-w-lg">
                            Join thousands of learners using AI to generate personalized courses and accelerate their education.
                        </p>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl w-fit mb-3">
                                        <benefit.icon className="w-6 h-6 text-purple-300" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                                    <p className="text-sm text-white/50">{benefit.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-10 right-10 flex items-center gap-2 text-white/40 text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Join the future of learning</span>
                </div>
            </div>
        </div>
    );
}
