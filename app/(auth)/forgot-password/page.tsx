"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
    Mail,
    Lock,
    ArrowRight,
    Loader2,
    Eye,
    EyeOff,
    CheckCircle2
} from "lucide-react";
import API_URL from "../../api/api_url";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isResetComplete, setIsResetComplete] = useState(false);
    const router = useRouter();

    const handleSendOtp = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                toast.success("OTP Sent!", {
                    description: "Please check your email for the verification code",
                });
                setIsOtpSent(true);
            } else {
                const data = await response.json();
                toast.error("Error", {
                    description: data.error || "Failed to send OTP",
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Connection Error");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/user/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            if (response.ok) {
                setIsResetComplete(true);
                toast.success("Password Reset Successfully", {
                    description: "You can now login with your new password",
                });
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                const data = await response.json();
                toast.error("Reset Failed", {
                    description: data.error || "Failed to reset password",
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Connection Error");
        } finally {
            setLoading(false);
        }
    };

    if (isResetComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
                >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Password Reset!</h2>
                        <p className="text-white/70">Redirecting to login...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {isOtpSent ? "Reset Password" : "Forgot Password?"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {isOtpSent
                                ? "Enter the OTP sent to your email and your new password"
                                : "Enter your email address to verify your account"
                            }
                        </p>
                    </div>

                    {!isOtpSent ? (
                        <div className="space-y-6">
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
                                        className="pl-12 h-14 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSendOtp()}
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-base font-semibold"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Sending OTP...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Send Verification Code</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-gray-700 dark:text-gray-300 font-medium mb-3 block text-center">
                                        Enter 6-digit OTP
                                    </Label>
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

                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300 font-medium">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min. 6 characters"
                                            className="pl-12 pr-12 h-14 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleResetPassword}
                                disabled={loading}
                                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-base font-semibold"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Resetting...</span>
                                    </div>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>

                            <div className="text-center">
                                <button
                                    onClick={() => setIsOtpSent(false)}
                                    className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                                >
                                    Change email
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                        <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
