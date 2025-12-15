"use client";

import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import { Camera, User as UserIcon, Mail, Trash2, Save, Loader2, Lock, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import API_URL from "../../api/api_url";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
    const { user, refreshUser, logout } = useUser();
    const router = useRouter();

    // Edit mode state
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState(user?.photo || "");
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Update local state when user data changes
    React.useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setPhotoPreview(user.photo || "");
        }
    }, [user]);

    // Handle photo upload
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
            setPhotoFile(file);
        }
    };

    // Update profile
    const handleUpdateProfile = async () => {
        if (!name || !email) {
            toast.error("Name and email are required");
            return;
        }

        if (!email.includes("@")) {
            toast.error("Please enter a valid email");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);

            // Add photo if a new one was selected
            if (photoFile) {
                formData.append('photo', photoFile);
            }

            const response = await fetch(`${API_URL}/user/${user?.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem("user", JSON.stringify(updatedUser));
                await refreshUser();
                setPhotoFile(null);
                setIsEditingProfile(false);
                toast.success("Profile updated successfully!");
            } else {
                const error = await response.json();
                toast.error(error.message || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Password visibility state
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Change password
    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setPasswordLoading(true);
        try {
            const response = await fetch(`${API_URL}/user/${user?.id}/password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (response.ok) {
                toast.success("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to change password");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to change password. Please try again.");
        } finally {
            setPasswordLoading(false);
        }
    };

    // Delete account
    const handleDeleteAccount = () => {
        toast.warning("Are you sure you want to delete your account?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    setDeleteLoading(true);
                    try {
                        const response = await fetch(`${API_URL}/user/${user?.id}`, {
                            method: "DELETE",
                        });

                        if (response.ok) {
                            toast.success("Account deleted successfully");
                            logout();
                            router.push("/");
                        } else {
                            const error = await response.json();
                            toast.error(error.message || "Failed to delete account");
                        }
                    } catch (error) {
                        console.error(error);
                        toast.error("Failed to delete account. Please try again.");
                    } finally {
                        setDeleteLoading(false);
                    }
                }
            },
            cancel: {
                label: "Cancel",
                onClick: () => toast.info("Account deletion cancelled")
            },
            duration: 5000,
        });
    };

    if (!user) {
        return (
            <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 rounded-md" />
                        <Skeleton className="h-4 w-64 rounded-md" />
                    </div>
                </div>
                {/* Profile Card Skeleton */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <Skeleton className="h-32 w-full" />
                    <div className="p-6 pt-0">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-12">
                            <Skeleton className="h-32 w-32 rounded-full" />
                            <div className="space-y-2 mb-4 sm:mb-0">
                                <Skeleton className="h-8 w-48 rounded-md" />
                                <Skeleton className="h-4 w-32 rounded-md" />
                            </div>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Password Card Skeleton */}
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                    </div>
                </div>
            </motion.div>

            {/* Profile Section - Combined Photo and Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <Card className="overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 via-green-600 to-blue-600 h-32"></div>
                    <CardContent className="relative pt-0 pb-6">
                        {/* Profile Photo - Overlapping the gradient */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-12">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center overflow-hidden">
                                        {photoPreview ? (
                                            <img
                                                src={photoPreview}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="w-16 h-16 text-white" />
                                        )}
                                    </div>
                                </div>
                                {isEditingProfile && (
                                    <label
                                        htmlFor="photo-upload"
                                        className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full cursor-pointer transition-all shadow-lg hover:scale-110"
                                    >
                                        <Camera className="w-5 h-5" />
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoChange}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="flex-1 text-center sm:text-left mb-4 sm:mb-0">
                                <h2 className="text-2xl font-bold text-gray-900">{user?.name || "User"}</h2>
                                <p className="text-gray-600">{user?.email || ""}</p>
                                {isEditingProfile && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        <Camera className="w-4 h-4 inline mr-1" />
                                        Click camera icon to change photo
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {!isEditingProfile ? (
                                    <Button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => {
                                                setIsEditingProfile(false);
                                                setName(user?.name || "");
                                                setEmail(user?.email || "");
                                                setPhotoFile(null);
                                                setPhotoPreview(user?.photo || "");
                                            }}
                                            variant="outline"
                                            className="border-gray-300"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleUpdateProfile}
                                            disabled={loading}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Profile Information Fields */}
                        <div className="mt-8 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-10"
                                            placeholder="Enter your name"
                                            disabled={!isEditingProfile}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            placeholder="Enter your email"
                                            disabled={!isEditingProfile}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Password Change Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    placeholder="Enter new password (min 6 characters)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            onClick={handleChangePassword}
                            disabled={passwordLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {passwordLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Changing Password...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Change Password
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>Irreversible actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
                            <p className="text-sm text-red-700 mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
