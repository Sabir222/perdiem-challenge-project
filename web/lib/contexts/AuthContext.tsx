'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, login as loginApi, signup as signupApi, logout as logoutApi, getProfile } from '@/lib/api';
import { User } from '@/lib/types';

import { AuthResponse } from '@/lib/types';

type AuthContextType = {
        user: User | null;
        loading: boolean;
        login: (email: string, password: string) => Promise<AuthResponse>;
        signup: (email: string, password: string) => Promise<AuthResponse>;
        logout: () => void;
        checkAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
                const checkAuthStatus = async () => {
                        setLoading(true);
                        if (isAuthenticated()) {
                                try {
                                        const profile = await getProfile();
                                        setUser(profile);
                                } catch {
                                        console.error('Auth check failed:');
                                        logout();
                                }
                        }
                        setLoading(false);
                };

                checkAuthStatus();
        }, []);

        const checkAuth = async () => {
                if (isAuthenticated()) {
                        try {
                                const profile = await getProfile();
                                setUser(profile);
                                return true;
                        } catch {
                                console.error('Auth check failed:');
                                logout();
                                return false;
                        }
                }
                return false;
        };

        const login = async (email: string, password: string) => {
                try {
                        const result = await loginApi(email, password);
                        if (result.success && result.token) {
                                localStorage.setItem('token', result.token);
                                setUser(result.user || null);
                                return { success: true, user: result.user || null };
                        } else {
                                return { success: false, error: result.error || 'Login failed' };
                        }
                } catch {
                        return { success: false, error: 'Network error' };
                }
        };

        const signup = async (email: string, password: string) => {
                try {
                        const result = await signupApi(email, password);
                        if (result.success && result.token) {
                                localStorage.setItem('token', result.token);
                                setUser(result.user || null);
                                return { success: true, user: result.user || null };
                        } else {
                                return { success: false, error: result.error || 'Signup failed' };
                        }
                } catch {
                        return { success: false, error: 'Network error' };
                }
        };

        const logout = () => {
                logoutApi();
                setUser(null);
        };

        const value = {
                user,
                loading,
                login,
                signup,
                logout,
                checkAuth,
        };

        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
        const context = useContext(AuthContext);
        if (context === undefined) {
                throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
}