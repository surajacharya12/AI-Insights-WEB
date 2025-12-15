"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import API_URL from '../api/api_url';

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);

                // If we have an ID, fetch fresh data
                if (userData.id) {
                    try {
                        console.log(`Fetching user data from: ${API_URL}/user/${userData.id}`);
                        const response = await fetch(`${API_URL}/user/${userData.id}`);
                        if (response.ok) {
                            const freshData = await response.json();
                            const user = Array.isArray(freshData) ? freshData[0] : freshData;
                            setUser(user);
                            localStorage.setItem('user', JSON.stringify(user));
                        } else {
                            setUser(userData);
                        }
                    } catch (error) {
                        console.error('Error fetching fresh user data:', error);
                        setUser(userData);
                    }
                } else {
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        setLoading(true);
        await fetchUserData();
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, setUser, refreshUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
